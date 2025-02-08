import React from "react";
import { ExternalLink, Bell } from "lucide-react";
import { ProductType } from "../SearchComponent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { freeShippingAbove, shippingFee } from "@/data";
import { LikeButton } from "../Wishlist";

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
  console.log(product);

  return (
    <div
      key={product.objectID}
      className="flex gap-4 bg-slate-50 p-4 border border-gray-200 hover:shadow-md transition-all duration-300 rounded-lg flex-row relative"
    >
      {showMoreData && (
        <>
          <LikeButton product={product} />

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex rounded-lg md:items-center  bg-gray-800 border-none hover:bg-gray-200 md:text-center md:justify-center justify-start absolute top-2 right-2 text-white"
                size="sm"
              >
                <Bell className="h-2 w-2 md:h-4 md:w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-slate-50">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Set Product Reminder
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reminderType">Reminder Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reminder type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock">Back in Stock</SelectItem>
                      <SelectItem value="price">Price Drop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Alert>
                  <AlertDescription className="text-sm text-muted-foreground">
                    🚧 This feature is currently under development. We'll notify
                    you when it's ready!
                  </AlertDescription>
                </Alert>

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Setting reminder..." : "Set Reminder"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </>
      )}
      {/* Product Image */}
      <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center flex-shrink-0 bg-slate-50">
        <img
          src={product.imageUrl || product.productImage}
          alt={product.productName}
          className="object-contain max-w-full max-h-full rounded-lg"
        />
      </div>

      <div className="flex-grow">
        <h2 className="font-medium mb-2 pr-10 text-xs md:text-sm">
          {highlightText(
            product.productName.length > 60
              ? product.productName.slice(0, 60) + "..."
              : product.productName,
            query
          )}
        </h2>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm md:text-lg font-semibold">
            ₹ {(Number(product.price) * 1.18).toFixed(2)}
            <span className="text-xs md:text-sm text-muted-foreground">
              (Inc. GST)
            </span>
          </span>

          <div className="ml-auto">
            <img
              src={product.sourceImage}
              alt={product.source}
              className={`h-6 w-20 md:h-8 md:w-28 object-contain rounded ${
                product.source === "evelta" || product.source === "sunrom"
                  ? "bg-black"
                  : "bg-white"
              }`}
            />
          </div>
        </div>

        <div className="gap-2 grid md:grid-cols-4 grid-cols-1">
          {showMoreData && (
            <>
              <div className="bg-yellow-100 border-yellow-500 border px-3 border-dashed py-0.5 md:py-1.5 rounded-md text-xs md:text-sm w-full md:w-auto">
                Availability: <br />
                <span className="font-semibold ">
                  {isNaN(Number(product.stock))
                    ? product.stock.charAt(0).toUpperCase() +
                      product.stock.slice(1)
                    : `${product.stock} left`}
                </span>
              </div>
              <div>
                <div className="bg-gray-100 border-gray-500 border border-dashed px-3 py-0.5 md:py-1.5 rounded-md md:text-sm w-full md:w-auto text-xs">
                  Shipping fee: <br />
                  <span className="font-semibold">
                    {shippingFee[product.source as keyof typeof shippingFee]}
                  </span>
                </div>
              </div>
              <div>
                <div className="bg-purple-100  text-xs border-purple-500 border px-3 border-dashed py-0.5 md:py-1.5 rounded-md md:text-sm w-full md:w-auto">
                  Free Shipping:
                  <br />
                  <span className="font-semibold">
                    {
                      freeShippingAbove[
                        product.source as keyof typeof freeShippingAbove
                      ]
                    }
                  </span>
                </div>
              </div>
            </>
          )}

          <a
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full col-span-1 ${
              showMoreData ? "col-span-1" : "col-span-4 h-8"
            }`}
          >
            <Button
              className="flex items-center border text-white  bg-red-500 hover:bg-red-600 hover:text-white w-full h-full  text-left md:text-center md:justify-center justify-start "
              size="sm"
            >
              <span
                className={`flex items-center font-semibold gap-1 py-2 md:py-0 text-xs md:text-sm `}
              >
                View Product
              </span>

              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
