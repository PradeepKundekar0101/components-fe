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
import { ProductType } from "@/types/data";
import ProductItem from "./ui/ProductItem";
import { Badge } from "@/components/ui/badge";
import { wishlistService } from "@/services/wishlistService";
import { useSelector } from "react-redux";

export type EnhancedProductType = ProductType & {
  mongodbID?: string;
};

// Create a context to manage wishlist state globally
export const WishlistContext = React.createContext<{
  likedProducts: EnhancedProductType[];
  setLikedProducts: React.Dispatch<React.SetStateAction<EnhancedProductType[]>>;
  addToWishlist: (product: EnhancedProductType) => Promise<void>;
  removeFromWishlist: (product: EnhancedProductType) => Promise<void>;
  isProductWishlisted: (objectID: string) => boolean;
  isSyncing: boolean;
}>({
  likedProducts: [],
  setLikedProducts: () => {},
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  isProductWishlisted: () => false,
  isSyncing: false,
});

export const WishlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [likedProducts, setLikedProducts] = React.useState<
    EnhancedProductType[]
  >([]);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const isAuthenticated = useSelector((state: any) => state.auth.isVerified);

  // Fetch wishlisted products from backend on initial load
  React.useEffect(() => {
    const fetchWishlistedProducts = async () => {
      if (isAuthenticated) {
        try {
          setIsSyncing(true);
          const wishlistData = await wishlistService.getUserWishlists();
          // Map backend data to EnhancedProductType
          const enhancedWishlist = wishlistData.map((item: any) => ({
            objectID: item.objectID || item._id,
            productName: item.productName,
            price: item.price,
            stock: item.stock,
            imageUrl: item.imageUrl,
            productUrl: item.productUrl,
            category: item.category,
            source: item.source,
            sourceImage: item.sourceImage,
            mongodbID: item._id,
          }));
          setLikedProducts(enhancedWishlist);
        } catch (error) {
          console.error("Failed to fetch wishlist:", error);
          // If API fails, try to load from localStorage as fallback
          const liked = localStorage.getItem("likedProducts");
          if (liked) {
            setLikedProducts(JSON.parse(liked));
          }
        } finally {
          setIsSyncing(false);
        }
      } else {
        // Not authenticated, use localStorage
        const liked = localStorage.getItem("likedProducts");
        if (liked) {
          setLikedProducts(JSON.parse(liked));
        }
      }
    };

    fetchWishlistedProducts();
  }, [isAuthenticated]);

  // Check if a product is in the wishlist
  const isProductWishlisted = (objectID: string) => {
    return likedProducts.some((p) => p.objectID === objectID);
  };

  // Add product to wishlist
  const addToWishlist = async (product: EnhancedProductType) => {
    try {
      if (isAuthenticated) {
        setIsSyncing(true);
        const response = await wishlistService.addWishlist(product);

        // Add mongodbID from backend to the product
        const enhancedProduct = {
          ...product,
          mongodbID: response.mongodbID,
        };

        // Update state and localStorage
        const updatedProducts = [...likedProducts, enhancedProduct];
        setLikedProducts(updatedProducts);
        localStorage.setItem("likedProducts", JSON.stringify(updatedProducts));
      } else {
        // Not authenticated, just update localStorage
        const updatedProducts = [...likedProducts, product];
        setLikedProducts(updatedProducts);
        localStorage.setItem("likedProducts", JSON.stringify(updatedProducts));
      }
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (product: EnhancedProductType) => {
    try {
      if (isAuthenticated && product.mongodbID) {
        setIsSyncing(true);
        await wishlistService.deleteWishlist(product.mongodbID);
      }

      // Always update local state regardless of API result
      const updatedProducts = likedProducts.filter(
        (p) => p.objectID !== product.objectID
      );
      setLikedProducts(updatedProducts);
      localStorage.setItem("likedProducts", JSON.stringify(updatedProducts));
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        likedProducts,
        setLikedProducts,
        addToWishlist,
        removeFromWishlist,
        isProductWishlisted,
        isSyncing,
      }}
    >
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
  const { likedProducts, removeFromWishlist, isSyncing } =
    React.useContext(WishlistContext);
  const [open, setOpen] = React.useState(false);

  const handleRemoveFromWishlist = async (product: EnhancedProductType) => {
    await removeFromWishlist(product);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center justify-center w-full gap-2 relative text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
          disabled={isSyncing}
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
                  onClick={() => handleRemoveFromWishlist(product)}
                  disabled={isSyncing}
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
  const {
    isProductWishlisted,
    addToWishlist,
    removeFromWishlist,
    likedProducts,
    isSyncing,
  } = React.useContext(WishlistContext);
  const isLiked = isProductWishlisted(product.objectID);

  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Find if this product already exists in wishlist to get its mongodbID
    const existingProduct = likedProducts.find(
      (p) => p.objectID === product.objectID
    );

    if (isLiked && existingProduct) {
      await removeFromWishlist(existingProduct);
    } else {
      await addToWishlist(product);
    }
  };

  return (
    <Button
      variant="ghost"
      className={`
        flex items-center justify-center
        h-6 w-6 md:h-6 md:w-6
        rounded-full p-0
        ${
          isLiked
            ? "text-white hover:text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }
        transition-all duration-200 ease-in-out
        transform hover:scale-105
        hover:bg-transparent bg-gray-100 border-gray-400 border-[0.8px]
      `}
      size="sm"
      onClick={toggleLike}
      disabled={isSyncing}
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
