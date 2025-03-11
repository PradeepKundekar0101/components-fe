import { useCallback, useState } from "react";
import {
  Search,
  SearchIcon,
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
} from "lucide-react";
import axios from "axios";
import React from "react";
import debounce from "lodash/debounce";
import { Button } from "@/components/ui/button";
import ProductSkeleton from "@/components/ui/SkeletonLoading";
import { sources } from "@/data";
import SourceFilterDialog from "./ui/FilterDialog";
import ProductItem from "./ui/ProductItem";
import { sites } from "@/config";
import { WishlistContext, WishlistDrawer } from "./Wishlist";
import FeatureCards from "./FeatureCards";
import BrandList from "./BrandList";
// import { usePostHog } from "posthog-js/react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import useAuthFlow from "@/store/authFlow";
import { usePostHog } from "posthog-js/react";

export type ProductType = {
  objectID: string;
  productName: string;
  price: string;
  stock: string;
  imageUrl?: string;
  productUrl: string;
  category: string;
  source: string;
  sourceImage: string;
  productImage?: string;
};

const ITEMS_PER_PAGE = 10;
const allSourceIds = sources.map((source) => source.id);

const ComponentSearch = () => {
  const [searchQuery, setSearchQuery] = useSearchParams();
  const [query, setQuery] = useState(searchQuery.get("q") || "");
  const [results, setResults] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSources, setSelectedSources] =
    useState<string[]>(allSourceIds);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalHits, setTotalHits] = useState(0);
  const isVerified = useSelector((state: any) => state.auth.isVerified);
  const posthog = usePostHog();

  const algoliaClient = axios.create({
    baseURL: `https://${import.meta.env.VITE_ALGOLIA_APP_ID}-dsn.algolia.net`,
    headers: {
      "X-Algolia-Application-Id": import.meta.env.VITE_ALGOLIA_APP_ID,
      "X-Algolia-API-Key": import.meta.env.VITE_ALGOLIA_API_KEY,
      "Content-Type": "application/json",
    },
    timeout: 5000,
  });

  const handleSearch = async (
    searchQuery: string,
    page: number,
    signal?: AbortSignal
  ) => {
    try {
      if (selectedSources.length === 0) {
        setResults([]);
        setTotalHits(0);
        return;
      }

      // Increment search count in localStorage
      let searchCount = parseInt(localStorage.getItem("searchCount") || "0", 10);
      searchCount += 1;
      localStorage.setItem("searchCount", searchCount.toString());

      // Show login modal only if user has searched 3 or more times and is not authenticated
      if (searchCount >= 3 && !isVerified) {
        const authFlow = useAuthFlow.getState();
        const user = localStorage.getItem("user");
        if (authFlow.currentModal === "null" && user === null) {
          authFlow.setModal("login");
        }

        return;
      }

      const allowedSources = sites
        .filter((site) => site.isAllowed)
        .map((site) => site.name);

      const selectedAllowedSources = selectedSources.filter((source) =>
        allowedSources.includes(source)
      );

      if (selectedAllowedSources.length === 0) {
        setResults([]);
        setTotalHits(0);
        return;
      }

      const filters = [];
      filters.push(`source:${selectedAllowedSources.join(" OR source:")}`);

      const response = await algoliaClient.post(
        `/1/indexes/Products/query`,
        {
          query: searchQuery,
          analytics: false,
          filters: filters.join(" AND "),
          attributesToRetrieve: [
            "productName",
            "price",
            "stock",
            "productImage",
            "imageUrl",
            "productUrl",
            "category",
            "source",
            "sourceImage",
          ],
          distinct: true,
          hitsPerPage: ITEMS_PER_PAGE,
          page,
        },
        { signal }
      );

      const normalizedQuery = searchQuery.toLowerCase().trim();
      posthog.capture("search_query", {
        query: normalizedQuery,
        $set: {
          [`search_count_${normalizedQuery}`]: {
            $increment: 1,
          },
        },
      });

      const fetchedResults = response.data.hits;
      setResults(fetchedResults);
      setTotalHits(response.data.nbHits);


    } catch (error) {
      console.log(error)
      if (axios.isCancel(error)) {
        console.log("Request cancelled");
      } else {
        console.error("Error fetching data from Algolia:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };


  const debouncedSearch = useCallback(
    debounce((searchQuery: string, page: number, signal?: AbortSignal) => {
      if (searchQuery.trim() !== "") {
        setIsLoading(true);
        handleSearch(searchQuery, page, signal);
      } else {
        setResults([]);
        setTotalHits(0);
        setIsLoading(false);
      }
    }, 300),
    [selectedSources, isVerified]
  );

  const abortControllerRef = React.useRef<AbortController | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value;
    setQuery(searchQuery);
    setCurrentPage(0); // Reset to first page on new search

    // Update URL query parameters
    setSearchQuery(searchQuery ? { q: searchQuery } : {});

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    debouncedSearch(searchQuery, 0, abortControllerRef.current.signal);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    debouncedSearch(query, newPage, abortControllerRef.current.signal);
  };



  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  React.useEffect(() => {
    if (query.trim() !== "") {
      setCurrentPage(0);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      debouncedSearch(query, 0, abortControllerRef.current.signal);
    }
  }, [selectedSources, isVerified]);

  const totalPages = Math.ceil(totalHits / ITEMS_PER_PAGE);
  const { likedProducts, setLikedProducts } = React.useContext(WishlistContext);

  const removeFromWishlist = (productId: string) => {
    const updatedProducts = likedProducts.filter(
      (p) => p.objectID !== productId
    );
    setLikedProducts(updatedProducts);
    localStorage.setItem("likedProducts", JSON.stringify(updatedProducts));
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-row">
        <div className="w-[0%] md:w-[10%] overflow-x-hidden bg-gray-100 flex justify-center items-center">
          <div className="bg-gray-200 rounded-lg px-4 py-2 text-slate-400">
            Ads
          </div>
        </div>
        <div className="min-h-screen w-[100%] md:w-[50%] flex flex-col pt-40 md:pt-36 overflow-x-hidden">
          <div className="flex-1">
            <div className="max-w-xl md:max-w-5xl mx-auto p-4">
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <div className="flex items-center gap-2">
                  <div className="text-red-600 text-2xl">
                    <SearchIcon />
                  </div>
                  <h1 className="text-red-600 text-md md:text-2xl font-semibold">
                    Components Radar
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <SourceFilterDialog
                    selectedSources={selectedSources}
                    setSelectedSources={setSelectedSources}
                  />
                  {window.innerWidth < 768 && (
                    <WishlistDrawer title="Wishlist" showBadge={true} />
                  )}
                </div>
              </div>

              <h1 className="text-gray-600 text-sm md:text-lg font-semibold my-3">
                Find & Compare Electronic Components
              </h1>
              <div className="relative mb-2 md:mb-6">
                <input
                  type="text"
                  placeholder="Search components by name or part number"
                  value={query}
                  onChange={handleInputChange}
                  className="w-full p-2 pr-12 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
                />
                <button className="absolute right-0 top-0 h-full px-4 bg-red-600 rounded-r hover:bg-red-700 transition-colors">
                  <Search className="h-5 w-5 text-white" />
                </button>
              </div>

              {query.length === 0 ? (
                <>
                  <FeatureCards />
                  <BrandList />
                </>
              ) : (
                <div className="h-full">
                  {isLoading && (
                    <div className="space-y-2 md:space-y-4">
                      {[...Array(6)].map((_, index) => (
                        <ProductSkeleton key={index} />
                      ))}
                    </div>
                  )}

                  {!isLoading &&
                    results.length === 0 &&
                    query.trim() !== "" && (
                      <div className="text-center text-gray-500 p-4 flex flex-col items-center justify-center">
                        No components found matching your search.
                      </div>
                    )}

                  {!isLoading && (
                    <div className="space-y-2 md:space-y-4 h-full">
                      {query.length > 0 && (
                        <div className="flex justify-between items-center">
                          <h1 className="text-gray-600 text-xl font-semibold">
                            {totalHits} results found
                          </h1>
                          <div className="text-sm text-gray-500">
                            Page {currentPage + 1} of {totalPages}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 md:space-y-4">
                        {results.map((product: ProductType) => (
                          <ProductItem
                            key={product.objectID}
                            product={product}
                            query={query}
                          />
                        ))}
                      </div>

                      {results.length > 0 && (
                        <div className="flex justify-center gap-2 mt-6 pb-6">
                          <Button
                            variant="outline"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="flex items-center gap-1"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                          </Button>

                          <div className="flex items-center gap-1">
                            {[...Array(Math.min(5, totalPages))].map(
                              (_, index) => {
                                let pageNumber = 0;
                                if (totalPages <= 5) {
                                  pageNumber = index;
                                } else if (currentPage <= 2) {
                                  pageNumber = index;
                                } else if (currentPage >= totalPages - 3) {
                                  pageNumber = totalPages - 5 + index;
                                } else {
                                  pageNumber = currentPage - 2 + index;
                                }

                                return (
                                  <Button
                                    key={pageNumber}
                                    variant={
                                      currentPage === pageNumber
                                        ? "default"
                                        : "outline"
                                    }
                                    onClick={() => handlePageChange(pageNumber)}
                                    className="w-10"
                                  >
                                    {pageNumber + 1}
                                  </Button>
                                );
                              }
                            )}
                          </div>

                          <Button
                            variant="outline"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1}
                            className="flex items-center gap-1"
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-[0%] md:w-[40%] mt-32 overflow-x-hidden bg-white flex justify-center items-start md:border-l border-gray-200 px-2 ">
          <div className="w-[400px] flex flex-col sm:w-[540px] overflow-y-auto">
            {likedProducts.length !== 0 && (
              <div className="mb-2 md:mb-4">
                <h1 className="text-xl font-bold">
                  Your Wishlist ({likedProducts.length} items)
                </h1>
              </div>
            )}
            <div className="space-y-2 md:space-y-4">
              {likedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                  <ShoppingCart className="h-16 w-16 text-gray-300" />
                  <p className="text-center text-gray-500">
                    Your wishlist is empty
                  </p>
                </div>
              ) : (
                <>
                  {likedProducts.slice(0, 5).map((product) => (
                    <div key={product.objectID} className="relative">
                      <div className="flex items-center justify-between">
                        <ProductItem
                          showMoreData={false}
                          product={product}
                          query=""
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeFromWishlist(product.objectID)}
                      >
                        <Heart className="h-5 w-5" fill="currentColor" />
                      </Button>
                    </div>
                  ))}
                  {likedProducts.length > 5 && (
                    <div className="flex items-center justify-center">
                      <WishlistDrawer
                        title={`Show all ${likedProducts.length} items`}
                        showBadge={false}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="w-[0%] md:w-[10%] overflow-x-hidden bg-gray-100 flex justify-center items-center">
          <div className="bg-gray-200 rounded-lg px-4 py-2 text-slate-400">
            Ads
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentSearch;