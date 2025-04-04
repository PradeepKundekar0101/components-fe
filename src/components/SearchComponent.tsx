import { useCallback, useState, useRef, useEffect } from "react";
import { Search, SearchIcon, Heart, ShoppingCart, ArrowUp } from "lucide-react";
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
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuthFlow from "@/store/authFlow";
import { usePostHog } from "posthog-js/react";
import { ProductType } from "@/types/data";

// Fetch all results at once
const MAX_RESULTS = 1000; // Set a reasonable maximum
const allSourceIds = sources.map((source) => source.id);

const ComponentSearch = () => {
  const [searchQuery, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchQuery.get("q") || "");
  const [results, setResults] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSources, setSelectedSources] =
    useState<string[]>(allSourceIds);
  const [totalHits, setTotalHits] = useState(0);
  const isVerified = useSelector((state: any) => state.auth.isVerified);
  const posthog = usePostHog();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // For infinite scrolling detection
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Check if user has been on the site for 3 minutes before showing login popup
  React.useEffect(() => {
    // Only proceed if user is not verified
    if (!isVerified) {
      // Get or set the first visit timestamp
      const firstVisitTime = localStorage.getItem("firstVisitTime");

      if (!firstVisitTime) {
        // First time visit, set the timestamp
        localStorage.setItem("firstVisitTime", Date.now().toString());
      }

      // Setup a timer to check elapsed time every 30 seconds
      const timer = setInterval(() => {
        const storedTime = localStorage.getItem("firstVisitTime");
        if (storedTime) {
          // Check if 3 minutes (180000ms) have passed
          const timeElapsed = Date.now() - parseInt(storedTime);

          if (timeElapsed >= 180000) {
            // 3 minutes have passed, show login modal
            const authFlow = useAuthFlow.getState();
            const user = localStorage.getItem("user");

            if (authFlow.currentModal === "null" && user === null) {
              authFlow.setModal("login");

              // Clear the interval after showing the modal
              clearInterval(timer);
            }
          }
        }
      }, 30000); // Check every 30 seconds

      // Also check immediately when component mounts
      const storedTime = localStorage.getItem("firstVisitTime");
      if (storedTime) {
        const timeElapsed = Date.now() - parseInt(storedTime);
        if (timeElapsed >= 180000) {
          const authFlow = useAuthFlow.getState();
          const user = localStorage.getItem("user");

          if (authFlow.currentModal === "null" && user === null) {
            authFlow.setModal("login");
          }
        }
      }

      // Cleanup the interval when component unmounts
      return () => clearInterval(timer);
    }
  }, [isVerified]);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollTop(scrollY > 400); // Show button after scrolling 400px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const algoliaClient = axios.create({
    baseURL: `https://${import.meta.env.VITE_ALGOLIA_APP_ID}-dsn.algolia.net`,
    headers: {
      "X-Algolia-Application-Id": import.meta.env.VITE_ALGOLIA_APP_ID,
      "X-Algolia-API-Key": import.meta.env.VITE_ALGOLIA_API_KEY,
      "Content-Type": "application/json",
    },
    timeout: 10000, // Increased timeout for larger requests
  });

  const handleSearch = async (searchQuery: string, signal?: AbortSignal) => {
    try {
      if (selectedSources.length === 0) {
        setResults([]);
        setTotalHits(0);
        return;
      }

      // Only count complete search keywords (not just character inputs)
      // Store searched keywords in localStorage and count unique ones
      const normalizedQuery = searchQuery.toLowerCase().trim();

      if (normalizedQuery.length > 0) {
        // Get previously searched keywords from localStorage
        const searchedKeywords = JSON.parse(
          localStorage.getItem("searchedKeywords") || "[]"
        );

        // Check if this is a new unique keyword
        if (!searchedKeywords.includes(normalizedQuery)) {
          // Add the new keyword to the array
          searchedKeywords.push(normalizedQuery);
          localStorage.setItem(
            "searchedKeywords",
            JSON.stringify(searchedKeywords)
          );

          // Update the search count based on unique keywords count
          localStorage.setItem(
            "searchCount",
            searchedKeywords.length.toString()
          );
        }
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

      // Fetch all results in one request
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
            "weight",
          ],
          distinct: true,
          hitsPerPage: MAX_RESULTS,
        },
        { signal }
      );

      posthog.capture("search_query", {
        query: normalizedQuery,
        source: "website",
        $current_url: normalizedQuery,
        $set: {
          [`search_count_${normalizedQuery}`]: {
            $increment: 1,
          },
        },
      });

      const fetchedResults = response.data.hits;

      // Sort results by weight (higher weights first, undefined weights last)
      const sortedResults = fetchedResults.sort(
        (a: ProductType, b: ProductType) => {
          // If both have weights, compare them (higher first)
          if (a.weight !== undefined && b.weight !== undefined) {
            return b.weight - a.weight;
          }
          // If only a has weight, a comes first
          if (a.weight !== undefined) {
            return -1;
          }
          // If only b has weight, b comes first
          if (b.weight !== undefined) {
            return 1;
          }
          // If neither has weight, maintain original order
          return 0;
        }
      );

      setResults(sortedResults);
      setTotalHits(response.data.nbHits);
    } catch (error) {
      console.log(error);
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
    debounce((searchQuery: string, signal?: AbortSignal) => {
      if (searchQuery.trim() !== "") {
        setIsLoading(true);
        handleSearch(searchQuery, signal);
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

    // Update URL query parameters
    setSearchParams(searchQuery ? { q: searchQuery } : {});

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    debouncedSearch(searchQuery, abortControllerRef.current.signal);
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
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      debouncedSearch(query, abortControllerRef.current.signal);
    }
  }, [selectedSources, isVerified]);

  const { likedProducts, removeFromWishlist, isSyncing } =
    React.useContext(WishlistContext);

  const handleRemoveFromWishlist = async (
    product: ProductType & { mongodbID?: string }
  ) => {
    if (product) {
      await removeFromWishlist(product);
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Add Go to Top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}

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
                    Components
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
                <div className="h-full" ref={resultsContainerRef}>
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
                        </div>
                      )}

                      <div className="space-y-2 md:space-y-4  overflow-y-auto">
                        {results.map((product: ProductType) => (
                          <ProductItem
                            key={product.objectID}
                            product={product}
                            query={query}
                          />
                        ))}
                      </div>
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
                        onClick={() => handleRemoveFromWishlist(product)}
                        disabled={isSyncing}
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
