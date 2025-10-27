export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  stock: number;
}

// Generate 60 products by extending the base set
const baseProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    category: "electronics",
    rating: 4.5,
    stock: 15
  },
  {
    id: "2",
    name: "Smart Watch",
    description: "Feature-rich smartwatch with health tracking and notifications",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    category: "electronics",
    rating: 4.8,
    stock: 22
  },
  {
    id: "3",
    name: "Running Shoes",
    description: "Lightweight running shoes with excellent cushioning and support",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    category: "footwear",
    rating: 4.6,
    stock: 30
  },
  {
    id: "4",
    name: "Backpack",
    description: "Durable waterproof backpack with laptop compartment",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
    category: "accessories",
    rating: 4.3,
    stock: 18
  },
  {
    id: "5",
    name: "Coffee Maker",
    description: "Programmable coffee maker with thermal carafe",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&q=80",
    category: "home",
    rating: 4.4,
    stock: 12
  },
  {
    id: "6",
    name: "Yoga Mat",
    description: "Non-slip yoga mat with carrying strap",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80",
    category: "fitness",
    rating: 4.7,
    stock: 25
  },
  {
    id: "7",
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with precision tracking",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80",
    category: "electronics",
    rating: 4.2,
    stock: 40
  },
  {
    id: "8",
    name: "Sunglasses",
    description: "Polarized sunglasses with UV protection",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
    category: "accessories",
    rating: 4.5,
    stock: 20
  },
  {
    id: "9",
    name: "Desk Lamp",
    description: "LED desk lamp with adjustable brightness and color temperature",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80",
    category: "home",
    rating: 4.6,
    stock: 15
  },
  {
    id: "10",
    name: "Water Bottle",
    description: "Insulated stainless steel water bottle, keeps drinks cold for 24 hours",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80",
    category: "fitness",
    rating: 4.8,
    stock: 50
  },
  {
    id: "11",
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with 360-degree sound",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
    category: "electronics",
    rating: 4.4,
    stock: 28
  },
  {
    id: "12",
    name: "Sneakers",
    description: "Classic canvas sneakers in multiple colors",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80",
    category: "footwear",
    rating: 4.3,
    stock: 35
  }
];

// Generate 60 products by repeating and modifying the base set
export const mockProducts: Product[] = Array.from({ length: 60 }, (_, index) => {
  const baseProduct = baseProducts[index % baseProducts.length];
  const iteration = Math.floor(index / baseProducts.length);
  
  return {
    ...baseProduct,
    id: `${index + 1}`,
    name: iteration > 0 ? `${baseProduct.name} ${String.fromCharCode(65 + iteration)}` : baseProduct.name,
    price: baseProduct.price + (iteration * 10),
    stock: baseProduct.stock + (iteration * 5)
  };
});

export const getRecommendedProducts = (category: string, currentProductId?: string): Product[] => {
  return mockProducts
    .filter(p => p.category === category && p.id !== currentProductId)
    .slice(0, 4);
};

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(p => p.id === id);
};
