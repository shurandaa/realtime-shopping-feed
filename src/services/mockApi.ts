import { mockProducts, getRecommendedProducts, getProductById, Product } from '@/data/mockProducts';

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export interface LoginResponse {
  token: string;
  userId: string;
  email: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

// Mock API functions
export const mockApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    await delay();
    
    // Simple mock - generate a temporary account
    const userId = `user_${Date.now()}`;
    const token = `mock_token_${btoa(email)}_${Date.now()}`;
    
    return {
      token,
      userId,
      email
    };
  },

  getRecommendationList: async (page: number = 1, pageSize: number = 12): Promise<{ products: Product[]; hasMore: boolean; total: number }> => {
    await delay();
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const products = mockProducts.slice(startIndex, endIndex);
    
    return {
      products,
      hasMore: endIndex < mockProducts.length,
      total: mockProducts.length
    };
  },

  getAllProducts: async (): Promise<Product[]> => {
    await delay();
    return mockProducts;
  },

  getDetail: async (productId: string): Promise<Product & { recommendedList: Product[] }> => {
    await delay();
    
    const product = getProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    
    const recommendedList = getRecommendedProducts(product.category, productId);
    
    return {
      ...product,
      recommendedList
    };
  },

  addCart: async (productId: string, quantity: number = 1): Promise<{ success: boolean }> => {
    await delay(300);
    
    const cartData = localStorage.getItem('cart');
    let cart: CartItem[] = cartData ? JSON.parse(cartData) : [];
    
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    return { success: true };
  },

  getCart: async (): Promise<CartItem[]> => {
    await delay(300);
    
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
  },

  removeFromCart: async (productId: string): Promise<{ success: boolean }> => {
    await delay(300);
    
    const cartData = localStorage.getItem('cart');
    let cart: CartItem[] = cartData ? JSON.parse(cartData) : [];
    
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    return { success: true };
  },

  updateCartQuantity: async (productId: string, quantity: number): Promise<{ success: boolean }> => {
    await delay(300);
    
    const cartData = localStorage.getItem('cart');
    let cart: CartItem[] = cartData ? JSON.parse(cartData) : [];
    
    const item = cart.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    return { success: true };
  },

  purchase: async (productIds: string[]): Promise<{ success: boolean; orderId: string }> => {
    await delay(800);
    
    // Save to purchase history
    const purchaseHistory = localStorage.getItem('purchaseHistory');
    const history: string[] = purchaseHistory ? JSON.parse(purchaseHistory) : [];
    history.push(...productIds);
    localStorage.setItem('purchaseHistory', JSON.stringify(history));
    
    // Clear purchased items from cart
    const cartData = localStorage.getItem('cart');
    let cart: CartItem[] = cartData ? JSON.parse(cartData) : [];
    cart = cart.filter(item => !productIds.includes(item.productId));
    localStorage.setItem('cart', JSON.stringify(cart));
    
    const orderId = `order_${Date.now()}`;
    
    return { success: true, orderId };
  }
};
