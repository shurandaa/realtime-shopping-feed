import axios from "axios";
import { Product } from "@/data/mockProducts";

const API_BASE_URL = "http://localhost:8080";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "X-User-Id": "1",
    "Content-Type": "application/json",
  },
});

export interface LoginResponse {
  token: string;
  userId: string;
  email: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface BackendCartItem {
  productId: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

// API functions
export const api = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    // Keep mock login for now since backend doesn't have auth yet
    const userId = `user_${Date.now()}`;
    const token = `mock_token_${btoa(email)}_${Date.now()}`;

    return {
      token,
      userId,
      email,
    };
  },

  getRecommendationList: async (
    page: number = 1,
    pageSize: number = 12
  ): Promise<{ products: Product[]; hasMore: boolean; total: number }> => {
    const response = await apiClient.get("/api/menu");

    let allProducts;
    try {
      allProducts = response.data.data.products.map((p: any) => {
        console.log("Processing product:", p);
        return {
          id: String(p.id),
          name: p.title,
          category: p.category,
          price: p.price,
          image: p.images[0],
        };
      });
    } catch (error) {
      console.error("Error in mapping products:", error);
      throw error;
    }
    // Implement pagination on frontend
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const products = allProducts.slice(startIndex, endIndex);

    return {
      products,
      hasMore: endIndex < allProducts.length,
      total: allProducts.length,
    };
  },

  getAllProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get("/api/menu");
    return response.data.data.products.map((p: any) => ({
      id: String(p.id),
      name: p.name,
      category: p.category,
      price: p.price,
      description: p.description || `High-quality ${p.name.toLowerCase()}`,
      image: p.image || "/placeholder.svg",
      rating: 4.5,
      stock: 50,
    }));
  },

  getDetail: async (
    productId: string
  ): Promise<Product & { recommendedList: Product[] }> => {
    const response = await apiClient.get(`/api/products/${productId}`);
    const data = response.data.data;

    const product: Product = {
      id: String(data.id),
      name: data.name,
      category: data.category,
      price: data.price,
      description:
        data.description || `High-quality ${data.name.toLowerCase()}`,
      image: data.image || "/placeholder.svg",
      rating: 4.5,
      stock: 50,
    };

    // Get related products from relatedImages or fetch menu for recommendations
    let recommendedList: Product[] = [];
    if (data.relatedImages && data.relatedImages.length > 0) {
      // Map related images to products (simplified)
      recommendedList = data.relatedImages
        .slice(0, 4)
        .map((img: string, idx: number) => ({
          id: `related_${idx}`,
          name: `Related Product ${idx + 1}`,
          category: data.category,
          price: data.price * 0.9,
          description: "Related product",
          image: img,
          rating: 4.5,
          stock: 50,
        }));
    } else {
      // Fetch other products as recommendations
      const menuResponse = await apiClient.get("/api/menu");
      const allProducts = menuResponse.data.data.products;
      recommendedList = allProducts
        .filter(
          (p: any) => String(p.id) !== productId && p.category === data.category
        )
        .slice(0, 4)
        .map((p: any) => ({
          id: String(p.id),
          name: p.name,
          category: p.category,
          price: p.price,
          description: p.description || `High-quality ${p.name.toLowerCase()}`,
          image: p.image || "/placeholder.svg",
          rating: 4.5,
          stock: 50,
        }));
    }

    return {
      ...product,
      recommendedList,
    };
  },

  addCart: async (
    productId: string,
    quantity: number = 1
  ): Promise<{ success: boolean }> => {
    await apiClient.post("/api/cart/add", {
      productId: Number(productId),
    });

    return { success: true };
  },

  getCart: async (): Promise<CartItem[]> => {
    const response = await apiClient.get("/api/cart");
    const backendCart: BackendCartItem[] = response.data.data;

    return backendCart.map((item) => ({
      productId: String(item.productId),
      quantity: item.quantity,
      price: item.price,
    }));
  },

  removeFromCart: async (productId: string): Promise<{ success: boolean }> => {
    await apiClient.delete(`/api/cart/${productId}`);
    return { success: true };
  },

  updateCartQuantity: async (
    productId: string,
    quantity: number
  ): Promise<{ success: boolean }> => {
    await apiClient.put(`/api/cart/${productId}?quantity=${quantity}`);
    return { success: true };
  },

  purchase: async (
    productIds: string[]
  ): Promise<{ success: boolean; orderId: string }> => {
    await apiClient.post("/api/cart/purchase");

    const orderId = `order_${Date.now()}`;
    return { success: true, orderId };
  },
};
