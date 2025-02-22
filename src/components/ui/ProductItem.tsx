import React from "react";
import { ExternalLink } from "lucide-react";
import { ProductType } from "../SearchComponent";
import { codInformation, freeShippingAbove, shippingFee } from "@/data";
import { LikeButton } from "../Wishlist";
import { Button } from "./button";
import BellDialog from "./BellDialog";

const ProductItem = ({
  product,
  query,
  showMoreData = true,
}: {
  product: ProductType;
  query: string;
  showMoreData?: boolean;
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  console.log(showMoreData);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };
  const isFreeShipping =
    Number(product.price) >=
    Number(freeShippingAbove[product.source as keyof typeof freeShippingAbove]);
  const eligibleForFreeShipping =
    freeShippingAbove[product.source as keyof typeof freeShippingAbove] ===
    "999999999999";

  const stockString = (product.stock || "").toString();

  return (
    <div
      key={product.objectID}
      className={`flex gap-2 md:gap-4 p-4 ${
        showMoreData ? "border rounded-lg" : "border-b"
      }  border-gray-200 transition-all  flex-row relative`}
    >
      {showMoreData && (
        <div className="flex flex-col gap-2 absolute top-2 right-4">
          <div className="flex w-full justify-end">
            <img
              src={product.sourceImage}
              alt={product.source}
              className="h-6 w-20 md:h-8 md:w-28 object-contain rounded"
            />
          </div>
          <div className="flex items-center gap-2 md:gap-3 justify-end">
            <LikeButton product={product} />
            <BellDialog
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center flex-shrink-0 bg-slate-50">
        <img
          src={product.imageUrl || product.productImage}
          alt={product.productName}
          className="object-contain max-w-full max-h-full rounded-lg"
        />
      </div>

      <div className="flex-grow">
        <h2
          className={`font-medium mb-1 text-xs md:text-sm ${
            !showMoreData ? "pr-10" : "pr-32"
          }`}
        >
          {highlightText(
            product.productName?.length > 60
              ? product.productName.slice(0, 60) + "..."
              : product.productName || "Untitled Product",
            query
          )}
        </h2>

        <div className="text-xs mb-1 rounded-none md:text-sm w-full md:w-auto flex items-center">
          <span
            className={`rounded-full h-2 w-2 mr-1 ${
              stockString.toLowerCase().includes("in stock") ||
              Number(product.stock) > 0
                ? "bg-green-600"
                : isNaN(Number(product.stock)) || Number(product.stock) === 0
                ? "bg-red-500"
                : "bg-gray-500"
            }`}
          ></span>
          <span
            className={`${
              stockString.toLowerCase().includes("in stock") ||
              Number(product.stock) > 0
                ? "!text-green-600"
                : isNaN(Number(product.stock)) || Number(product.stock) === 0
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {stockString.toLocaleLowerCase() === "out"
              ? "Out of stock"
              : isNaN(Number(product.stock))
              ? stockString.charAt(0).toUpperCase() + stockString.slice(1)
              : `${product.stock} left`}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm md:text-lg font-semibold">
            ₹{" "}
            {product.source === "quartz" || product.source === "evelta"
              ? (Number(product.price) * 1.18).toFixed(2)
              : Number(product.price || 0).toFixed(2)}
            <span className="text-xs md:text-sm text-muted-foreground ml-1">
              (Inc. GST)
            </span>
            <span className="text-gray-500 text-xs md:text-sm font-light ml-1">
              | {codInformation[product.source as keyof typeof codInformation]}
            </span>
          </span>
        </div>

        <div className="flex justify-between items-center w-full">
          {showMoreData && (
            <div className="flex flex-col md:flex-row justify-start w-full">
              <div className="text-xs text-gray-500 rounded-none md:text-sm w-full md:w-auto flex items-center gap-2">
                {!isFreeShipping && (
                  <span className="">
                    Shipping fee
                    {" " +
                      shippingFee[product.source as keyof typeof shippingFee]}
                  </span>
                )}
                {isFreeShipping ? (
                  <span>Free shipping</span>
                ) : !eligibleForFreeShipping ? (
                  <span>
                    {` | Free above ₹${
                      freeShippingAbove[
                        product.source as keyof typeof freeShippingAbove
                      ]
                    }`}
                  </span>
                ) : (
                  ""
                )}
              </div>

              <div className="text-xs px-0 md:px-2 rounded-none md:text-sm w-full md:w-auto flex items-center gap-2"></div>
            </div>
          )}

          <a
            href={product.productUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            <Button
              className="flex items-center border text-white bg-red-500 hover:bg-red-600 w-full h-8 text-left md:text-center md:justify-center justify-start shadow-none rounded-full px-1 md:px-3 gap-1 md:gap-2"
              size="sm"
            >
              <span className="flex items-center font-semibold gap-0 md:gap-1 text-xs md:text-sm">
                View Product
              </span>
              <ExternalLink className="hidden md:block w-2 md:h-4 md:w-4" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
