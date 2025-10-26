import { LoginCredentials, AuthResponse } from '@/types/user';
import { Product, ProductsResponse } from '@/types/product';
import { mockProducts, getMockProductById, getMockRecommendedProducts } from './mockData';

// TODO: Replace with actual backend URL
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Simulated delay for realistic API behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Login API call
 * TODO: Replace with actual API call to [BACKEND_API_URL]/auth/login
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  await delay(800);

  // Mock authentication - accept any email/password
  if (credentials.email && credentials.password) {
    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 'user-1',
        email: credentials.email,
        name: credentials.email.split('@')[0],
      },
    };
  }

  throw new Error('Invalid credentials');
};

/**
 * Get products with pagination
 * TODO: Replace with actual API call to [BACKEND_API_URL]/products?page={page}&limit={limit}
 */
export const getProducts = async (page: number = 1, limit: number = 8): Promise<ProductsResponse> => {
  await delay(500);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const products = mockProducts.slice(startIndex, endIndex);

  return {
    products,
    hasMore: endIndex < mockProducts.length,
    total: mockProducts.length,
  };
};

/**
 * Get single product by ID
 * TODO: Replace with actual API call to [BACKEND_API_URL]/products/{id}
 */
export const getProductById = async (id: string): Promise<Product> => {
  await delay(400);

  const product = getMockProductById(id);
  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};

/**
 * Get recommended products for a product
 * TODO: Replace with actual API call to [BACKEND_API_URL]/products/{id}/recommended
 */
export const getRecommendedProducts = async (productId: string): Promise<Product[]> => {
  await delay(400);

  return getMockRecommendedProducts(productId, 6);
};

/**
 * Helper to get auth token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

/**
 * Helper to check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Logout user
 */
export const logoutUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};
