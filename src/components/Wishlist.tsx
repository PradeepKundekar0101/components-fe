import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductType } from "./SearchComponent";
import ProductItem from "./ui/ProductItem";
import { Badge } from "@/components/ui/badge";

// Create a context to manage wishlist state globally
export const WishlistContext = React.createContext<{
  likedProducts: ProductType[];
  setLikedProducts: React.Dispatch<React.SetStateAction<ProductType[]>>;
}>({
  likedProducts: [],
  setLikedProducts: () => { },
});

export const WishlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [likedProducts, setLikedProducts] = React.useState<ProductType[]>([]);

  React.useEffect(() => {
    const liked = localStorage.getItem("likedProducts");
    if (liked) {
      setLikedProducts(JSON.parse(liked));
    }
  }, []);

  return (
    <WishlistContext.Provider value={{ likedProducts, setLikedProducts }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const WishlistDrawer = ({
  title,
  showBadge,
}: {
  title: string;
  showBadge: boolean;
}) => {
  const { likedProducts, setLikedProducts } = React.useContext(WishlistContext);
  const [open, setOpen] = React.useState(false);

  const removeFromWishlist = (productId: string) => {
    const updatedProducts = likedProducts.filter(
      (p) => p.objectID !== productId
    );
    setLikedProducts(updatedProducts);
    localStorage.setItem("likedProducts", JSON.stringify(updatedProducts));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center justify-center w-full gap-2 relative text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
        >
          <Heart className="h-4 w-4" />
          {title}
          {showBadge && likedProducts.length > 0 && (
            <Badge
              variant="secondary"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white"
            >
              {likedProducts.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-[400px] sm:w-[540px] overflow-y-auto"
        side="right"
      >
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl font-bold">
            Your Wishlist ({likedProducts.length} items)
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-4">
          {likedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <Heart className="h-16 w-16 text-gray-300" />
              <p className="text-center text-gray-500">
                Your wishlist is empty
              </p>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            likedProducts.map((product) => (
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
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const LikeButton = ({ product }: { product: ProductType }) => {
  const { likedProducts, setLikedProducts } = React.useContext(WishlistContext);
  const isLiked = likedProducts.some((p) => p.objectID === product.objectID);

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let updatedProducts;
    if (isLiked) {
      updatedProducts = likedProducts.filter(
        (p) => p.objectID !== product.objectID
      );
    } else {
      updatedProducts = [...likedProducts, product];
    }

    setLikedProducts(updatedProducts);
    localStorage.setItem("likedProducts", JSON.stringify(updatedProducts));
  };

  return (
    <Button
      variant="ghost"
      className={`
        flex items-center justify-center
        h-6 w-6 md:h-6 md:w-6
        rounded-full p-0
        ${isLiked
          ? "text-white hover:text-white"
          : "bg-white text-gray-700 hover:bg-gray-100"
        }
        transition-all duration-200 ease-in-out
        transform hover:scale-105
        hover:bg-transparent bg-gray-100 border-gray-400 border-[0.8px]
      `}
      size="sm"
      onClick={toggleLike}
    >
      <Heart
        className="h-4 w-4 md:h-5 md:w-5"
        fill={isLiked ? "red" : "currentColor"}
        strokeWidth={2}
        stroke={isLiked ? "red" : "currentColor"}
      />
    </Button>
  );
};
