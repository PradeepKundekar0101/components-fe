import { useCallback, useState } from "react";
import { Search, SearchIcon } from "lucide-react";
import axios from "axios";
import React from "react";
import debounce from "lodash/debounce";

import ProductSkeleton from "@/components/ui/SkeletonLoading";
import { sources } from "@/data";
import SourceFilterDialog from "./ui/FilterDialog";
import ProductItem from "./ui/ProductItem";
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

const allSourceIds = sources.map((source) => source.id);

const ComponentSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSources, setSelectedSources] =
    useState<string[]>(allSourceIds);

  const algoliaClient = axios.create({
    baseURL: `https://${import.meta.env.VITE_ALGOLIA_APP_ID}-dsn.algolia.net`,
    headers: {
      "X-Algolia-Application-Id": import.meta.env.VITE_ALGOLIA_APP_ID,
      "X-Algolia-API-Key": import.meta.env.VITE_ALGOLIA_API_KEY,
      "Content-Type": "application/json",
    },
    timeout: 5000,
  });

  const handleSearch = async (searchQuery: string, signal?: AbortSignal) => {
    try {
      if (selectedSources.length === 0) {
        setResults([]);
        return;
      }
      const filters = [];
      filters.push(`source:${selectedSources.join(" OR source:")}`);
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
        },
        { signal }
      );
      setResults(response.data.hits);
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
    debounce((searchQuery: string, signal?: AbortSignal) => {
      if (searchQuery.trim() !== "") {
        setIsLoading(true);
        handleSearch(searchQuery, signal);
      } else {
        setResults([]);
        setIsLoading(false);
      }
    }, 300),
    [selectedSources]
  );

  // Create a ref to store the current abort controller
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value;
    setQuery(searchQuery);

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    debouncedSearch(searchQuery, abortControllerRef.current.signal);
  };

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Effect to trigger search when filters change
  React.useEffect(() => {
    if (query.trim() !== "") {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      debouncedSearch(query, abortControllerRef.current.signal);
    }
  }, [selectedSources]);

  return (
    <div className="min-h-screen flex flex-col">
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
            <SourceFilterDialog
              selectedSources={selectedSources}
              setSelectedSources={setSelectedSources}
            />
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
              <div className="space-y-4 h-full overflow-y-auto">
                {query.length > 0 && (
                  <h1 className="text-gray-600  text-xl font-semibold">
                    {results.length} results found
                  </h1>
                )}
                {results.map((product: ProductType) => (
                  <ProductItem product={product} query={query} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentSearch;
