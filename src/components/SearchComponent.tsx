import { useCallback, useState } from "react";
import { Search, ExternalLink, SlidersHorizontal } from "lucide-react";
import axios from "axios";
import React from "react";
import debounce from "lodash/debounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

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

// Skeleton Loading Component
const ProductSkeleton = () => (
  <div className="flex gap-4 bg-gray-100 p-4 rounded animate-pulse">
    <div className="w-20 h-20 bg-gray-300 rounded"></div>
    <div className="flex-grow space-y-2">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="flex items-center gap-2">
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

// Highlighting function
const highlightText = (text: string, query: string) => {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 font-semibold">
        {part}
      </mark>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  );
};

const ComponentSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);

  // Sources list
  const sources = [
    { id: "sunrom", label: "Sunrom" },
    { id: "zbotic", label: "ZBotic" },
    { id: "robu", label: "Robu" },
    { id: "robokit", label: "Robokit" },
  ];

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
      // const filters = [];
      // if (selectedSources.length > 0) {
      //   filters.push(`source:${selectedSources.join(" OR source:")}`);
      // }
      // if (priceRange) {
      //   filters.push(`price:${priceRange[0]} TO ${priceRange[1]}`);
      // }

      const response = await algoliaClient.post(
        `/1/indexes/Products/query`,
        {
          query: searchQuery,
          analytics: false,
          // filters: filters.join(" AND "),
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

  // Debounce search to prevent excessive API calls
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
    []
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
  }, [selectedSources, priceRange]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="max-w-3xl mx-auto p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="text-red-600 text-2xl">⚡</div>
              <h1 className="text-red-600 text-xl font-semibold">
                Components Search
              </h1>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {selectedSources.length > 0 && (
                    <span className="ml-2 bg-red-600 text-white text-xs rounded-full px-2 py-1">
                      {selectedSources.length}
                    </span>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Filter Components</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-4">
                    <Label>Sources</Label>
                    {sources.map((source) => (
                      <div
                        key={source.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={source.id}
                          checked={selectedSources.includes(source.id)}
                          onCheckedChange={(checked) => {
                            setSelectedSources(
                              checked
                                ? [...selectedSources, source.id]
                                : selectedSources.filter((s) => s !== source.id)
                            );
                          }}
                        />
                        <label
                          htmlFor={source.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {source.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <Label>Price Range (₹)</Label>
                    <Slider
                      defaultValue={[0, 10000]}
                      max={10000}
                      step={100}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="my-6"
                    />
                    <div className="flex justify-between text-sm">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search Bar */}
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

          {/* Fixed height container for results */}
          <div className="h-[500px]">
            {query.length === 0 && (
              <div className="text-center text-gray-500">
                Search for components...
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            )}

            {/* Product List */}
            {!isLoading && (
              <div className="space-y-4 h-full overflow-y-auto">
                {results.map((product: ProductType) => (
                  <div
                    key={product.objectID}
                    className="flex gap-4 bg-gray-100 p-4 rounded hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 flex items-center justify-center">
                      <img
                        src={
                          product.imageUrl === "" || !product.imageUrl
                            ? product.productImage
                            : product.imageUrl
                        }
                        alt={product.productName}
                        className="object-contain max-w-full max-h-full rounded"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow">
                      <h2 className="text-lg font-medium mb-2">
                        {product.source === "robu"
                          ? highlightText(
                              product.productName.slice(
                                0,
                                product.productName.length / 2
                              ),
                              query
                            )
                          : highlightText(product.productName, query)}
                      </h2>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">
                            ₹ {product.price}
                          </span>
                        </div>
                        {product.stock && (
                          <div className="bg-yellow-100 px-2 py-1 rounded text-sm">
                            Avl.Qty:{" "}
                            {isNaN(Number(product.stock))
                              ? product.stock
                              : `${product.stock} units`}
                          </div>
                        )}
                        {/* Company Logo */}
                        <div className="flex items-center gap-2 ml-auto">
                          <img
                            src={product.sourceImage}
                            alt={product.source}
                            className="h-6 w-32 object-contain"
                          />
                          <span className="text-sm text-gray-600">
                            {product.source}
                          </span>
                        </div>
                      </div>

                      {/* Additional Product Details */}
                      <div className="mt-2 flex items-center">
                        <span className="text-sm text-gray-600 mr-2">
                          Category: {product.category}
                        </span>
                        <a
                          href={product.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto"
                        >
                          <button className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-sm w-36">
                            View Product
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results State */}
            {!isLoading && results.length === 0 && query.trim() !== "" && (
              <div className="text-center text-gray-500 p-4">
                No components found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentSearch;
