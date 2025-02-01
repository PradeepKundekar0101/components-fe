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

const ProductItem = ({
  product,
  query,
}: {
  product: ProductType;
  query: string;
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

  return (
    <div
      key={product.objectID}
      className="flex gap-4 bg-white p-4 border border-gray-200 hover:shadow-md transition-all duration-300 rounded-lg"
    >
      {/* Product Image */}
      <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
        <img
          src={product.imageUrl || product.productImage}
          alt={product.productName}
          className="object-contain max-w-full max-h-full"
        />
      </div>

      {/* Product Info */}
      <div className="flex-grow">
        {/* Product Name */}
        <h2 className="text-base font-medium mb-2">
          {highlightText(product.productName, query)}
        </h2>

        {/* Price and Details */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-semibold">₹ {product.price}</span>

          {/* Company Logo */}
          <div className="ml-auto">
            <img
              src={product.sourceImage}
              alt={product.source}
              className={`h-8 w-28 object-contain rounded ${
                product.source === "evelta" || product.source === "sunrom"
                  ? "bg-black"
                  : "bg-white"
              }`}
            />
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-3">
          {/* Stock Status */}
          <div className="bg-yellow-100 px-3 py-1.5 rounded-md text-sm">
            Avl.Qty: In Stock
          </div>

          {/* Category */}
          <div className="bg-blue-100 px-3 py-1.5 rounded-md text-sm">
            Category: {product.category.slice(0, 15)}...
          </div>

          {/* Reminder Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-1.5 bg-green-100 border-none hover:bg-green-200"
                size="sm"
              >
                <Bell className="h-4 w-4" />
                Reminder
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
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

          {/* View Product Button */}
          <a
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto"
          >
            <Button
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700"
              size="sm"
            >
              View Product
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
