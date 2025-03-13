import { ProductType } from "@/components/SearchComponent";
import api from "@/config/axios";

export const wishlistService = {
  // Get all wishlisted products for the authenticated user
  getUserWishlists: async () => {
    try {
      const response = await api.get("/api/v1/wishlist/getAll");
      return response.data;
    } catch (error) {
      console.error("Error fetching wishlisted products:", error);
      throw error;
    }
  },

  // Add product to user's wishlist
  addWishlist: async (product: ProductType) => {
    try {
      const productWithObjectID = {
        ...product,
        objectID: product.objectID || product._id, 
      };
      
      const response = await api.post("/api/v1/wishlist/add", productWithObjectID);
      return response.data;
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
      throw error;
    }
  },

  // Delete product from user's wishlist
  deleteWishlist: async (mongodbID: string) => {
    try {
      const response = await api.delete(`/api/v1/wishlist/delete/${mongodbID}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting product from wishlist:", error);
      throw error;
    }
  },
};