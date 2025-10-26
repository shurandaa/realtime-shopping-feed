export interface Product {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  images: string[];
  rating: number;
  reviewCount: number;
  category: string;
  inStock: boolean;
}

export interface ProductsResponse {
  products: Product[];
  hasMore: boolean;
  total: number;
}
