import { useCallback, useState } from "react";
import { Search, SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import React from "react";
import debounce from "lodash/debounce";
import { Button } from "@/components/ui/button";
import ProductSkeleton from "@/components/ui/SkeletonLoading";
import { sources } from "@/data";
import SourceFilterDialog from "./ui/FilterDialog";
import ProductItem from "./ui/ProductItem";
import { sites } from "@/config";
import { WishlistDrawer } from "./Wishlist";
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
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSources, setSelectedSources] =
    useState<string[]>(allSourceIds);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalHits, setTotalHits] = useState(0);

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

      // Get the list of allowed sources
      const allowedSources = sites
        .filter((site) => site.isAllowed)
        .map((site) => site.name);

      // Create filter for allowed sources that are also selected
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

      setResults(response.data.hits);
      setTotalHits(response.data.nbHits);
    } catch (error) {
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
    [selectedSources]
  );

  const abortControllerRef = React.useRef<AbortController | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value;
    setQuery(searchQuery);
    setCurrentPage(0); // Reset to first page on new search

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
  }, [selectedSources]);

  const totalPages = Math.ceil(totalHits / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen flex flex-col mt-32">
      <div className="flex-1">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="text-red-600 text-2xl">
                <SearchIcon />
              </div>
              <h1 className="text-red-600 text-2xl font-semibold">
                Components Search
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <SourceFilterDialog
                selectedSources={selectedSources}
                setSelectedSources={setSelectedSources}
              />
              <WishlistDrawer />
            </div>
          </div>

          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search components..."
              value={query}
              onChange={handleInputChange}
              className="w-full p-2 pr-12 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <button className="absolute right-0 top-0 h-full px-4 bg-red-600 rounded-r hover:bg-red-700 transition-colors">
              <Search className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="h-full">
            {query.length === 0 && (
              <div className="text-center text-gray-500">
                Search for components...
              </div>
            )}

            {isLoading && (
              <div className="space-y-4">
                {[...Array(6)].map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            )}

            {!isLoading && results.length === 0 && query.trim() !== "" && (
              <div className="text-center text-gray-500 p-4 flex flex-col items-center justify-center">
                No components found matching your search.
              </div>
            )}

            {!isLoading && (
              <div className="space-y-4 h-full">
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

                <div className="space-y-4">
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
                      {[...Array(Math.min(5, totalPages))].map((_, index) => {
                        let pageNumber;
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
                              currentPage === pageNumber ? "default" : "outline"
                            }
                            onClick={() => handlePageChange(pageNumber)}
                            className="w-10"
                          >
                            {pageNumber + 1}
                          </Button>
                        );
                      })}
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
        </div>
      </div>
    </div>
  );
};

export default ComponentSearch;
