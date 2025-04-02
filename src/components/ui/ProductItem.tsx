import React from "react";
import { ExternalLink, Info } from "lucide-react";
import { ProductType } from "@/types/data";
import { codInformation, freeShippingAbove, shippingFee } from "@/data";
import { LikeButton } from "../Wishlist";
import { Button } from "./button";
import BellDialog from "./BellDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

// Import vendor images
import quartzLogo from "@/assets/vendors/quartz.png";
import eveltaLogo from "@/assets/vendors/evelta.png";
import robuLogo from "@/assets/vendors/robu.png";
import robocrazeLogo from "@/assets/vendors/robocraze.png";
import robokitLogo from "@/assets/vendors/robokit.png";
import sunromLogo from "@/assets/vendors/sunrom.png";
import zboticLogo from "@/assets/vendors/zbotic.png";

const ProductItem = ({
  product,
  query,
  showMoreData = true,
}: {
  product: ProductType;
  query: string;
  showMoreData?: boolean;
}) => {
  const getImageUrl = (source: string) => {
    switch (source) {
      case "quartz":
        return quartzLogo;
      case "evelta":
        return eveltaLogo;
      case "robu":
        return robuLogo;
      case "robocraze":
        return robocrazeLogo;
      case "robokit":
        return robokitLogo;
      case "sunrom":
        return sunromLogo;
      case "zbotic":
        return zboticLogo;
      default:
        return null;
    }
  };

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isMobile = window.innerWidth < 768;
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

  const shippingAndCodInfo = (
    <>
      <div className="space-y-4">
        <h3 className="text-sm text-gray-700 mb-2">{product.productName}</h3>
        <div>
          <span className="font-semibold">Shipping Details:</span>
          <div className="text-sm text-gray-600 mt-1">
            {!isFreeShipping && (
              <div className="flex items-center gap-1">
                <span>•</span>
                <span>
                  Shipping fee:{" "}
                  {shippingFee[product.source as keyof typeof shippingFee]}
                </span>
              </div>
            )}
            {isFreeShipping ? (
              <div className="flex items-center gap-1">
                <span>•</span>
                <span>Free shipping</span>
              </div>
            ) : !eligibleForFreeShipping ? (
              <div className="flex items-center gap-1">
                <span>•</span>
                <span>
                  Free shipping above ₹
                  {
                    freeShippingAbove[
                      product.source as keyof typeof freeShippingAbove
                    ]
                  }
                </span>
              </div>
            ) : null}
          </div>
        </div>
        <div>
          <span className="font-semibold">Payment Details:</span>
          <div className="text-sm text-gray-600 mt-1">
            <div className="flex items-center gap-1">
              <span>•</span>
              <span>
                {codInformation[product.source as keyof typeof codInformation]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div
      key={product.objectID}
      className={`flex gap-2 md:gap-4 p-2 md:p-4 ${
        showMoreData ? "border rounded-lg" : "border-b"
      }  border-gray-200 transition-all flex-row relative`}
    >
      {showMoreData && (
        <div className="flex flex-col gap-2 absolute top-2 right-4">
          <div className="flex w-full justify-end">
            <img
              src={getImageUrl(product.source) || ""}
              alt={product.source}
              className="h-6 w-20 md:h-8 md:w-28 object-contain rounded"
            />
          </div>
          <div className="flex items-center gap-2 md:gap-3 justify-end">
            <LikeButton product={product} />
            <div className="block md:hidden">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`
                      flex items-center justify-center
                      h-6 w-6 md:h-6 md:w-6
                      rounded-full p-0
                      text-gray-700 hover:bg-gray-100
                      transition-all duration-200 ease-in-out
                      transform hover:scale-105
                      hover:bg-transparent bg-gray-100 border-gray-400 border-[0.8px]
                    `}
                    size="sm"
                  >
                    <Info className="h-3 w-3 md:h-5 md:w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90%] rounded-lg">
                  <DialogHeader>
                    <DialogTitle>Shipping & Payment Details</DialogTitle>
                  </DialogHeader>
                  {shippingAndCodInfo}
                </DialogContent>
              </Dialog>
            </div>
            <BellDialog
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      <div className="w-24 h-16 md:h-24 flex items-center justify-center flex-shrink-0 ">
        <img
          src={product.imageUrl || product.productImage}
          alt={product.productName}
          className="object-contain max-w-[80%] md:max-w-full max-h-[80%] md:max-h-full rounded-lg"
        />
      </div>

      <div className="flex-grow">
        <h2
          className={`font-medium mb-1 text-xs md:text-sm ${
            !showMoreData ? "md:pr-10 pr-8" : "md:pr-32 pr-24"
          }`}
        >
          {highlightText(
            isMobile
              ? product.productName?.length > 30
                ? product.productName.slice(0, 30) + "..."
                : product.productName || "Untitled Product"
              : product.productName?.length > 60
              ? product.productName.slice(0, 60) + "..."
              : product.productName || "Untitled Product",
            query
          )}
        </h2>

        <div className="text-xs mb-1 rounded-none md:text-sm w-full md:w-auto flex items-center">
          <span
            className={`rounded-full h-2 w-2 mr-1 ${
              stockString.toLowerCase().includes("in stock") ||
              stockString.toLowerCase().includes("available") ||
              stockString.toLowerCase().includes("many") ||
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
              stockString.toLowerCase().includes("available") ||
              stockString.toLowerCase().includes("many") ||
              Number(product.stock) > 0
                ? "!text-green-600"
                : isNaN(Number(product.stock)) || Number(product.stock) === 0
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {stockString.toLowerCase().split("-").length == 3
              ? "Unknown"
              : stockString.toLocaleLowerCase() === "out"
              ? "Out of stock"
              : stockString.toLowerCase().includes("many")
              ? "In stock"
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
              <span className="hidden md:block">
                |{" "}
                {codInformation[product.source as keyof typeof codInformation]}
              </span>
            </span>
          </span>
        </div>

        <div className="flex items-center md:w-full">
          {showMoreData && (
            <div className="flex flex-col md:flex-row justify-start w-0 md:w-full">
              <div className="text-xs text-gray-500 rounded-none md:text-sm flex items-center w-auto gap-2">
                <div className="md:block hidden">
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
              className="flex items-center border text-white bg-red-500 hover:bg-red-600 md:w-full h-6 md:h-8 text-left md:text-center md:justify-center justify-start shadow-none rounded-full px-2 md:px-3 gap-1 md:gap-2 absolute bottom-[10%] left-3 w-fit md:relative "
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
