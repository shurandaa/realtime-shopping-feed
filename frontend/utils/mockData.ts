import { Product } from '@/types/product';
import { Order } from '@/types/cart';

const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Books', 'Sports', 'Toys'];

const productTitles = [
  'Wireless Bluetooth Headphones with Noise Cancellation',
  'Smart Watch with Fitness Tracker and Heart Rate Monitor',
  'Portable Laptop Stand - Ergonomic Design',
  'USB-C Hub 7-in-1 Multiport Adapter',
  'Mechanical Gaming Keyboard RGB Backlit',
  'Wireless Mouse - Rechargeable Silent Click',
  '4K Webcam with Auto Focus and Ring Light',
  'Phone Holder for Car Dashboard - Universal Mount',
  'Power Bank 20000mAh Fast Charging',
  'Bluetooth Speaker Waterproof Portable',
  'Cotton T-Shirt Premium Quality - Unisex',
  'Running Shoes Lightweight Breathable',
  'Yoga Mat Non-Slip Extra Thick',
  'Stainless Steel Water Bottle Insulated',
  'Backpack Laptop Bag with USB Charging Port',
  'Sunglasses Polarized UV Protection',
  'Smart LED Light Bulbs WiFi Enabled',
  'Air Purifier HEPA Filter for Home',
  'Coffee Maker Programmable 12-Cup',
  'Blender for Smoothies and Protein Shakes',
  'Non-Stick Cookware Set 10-Piece',
  'Memory Foam Pillow Cooling Gel',
  'Weighted Blanket for Better Sleep',
  'Electric Toothbrush Rechargeable',
  'Hair Dryer Professional Ionic Technology',
  'Desk Lamp LED with USB Charging Port',
  'Gaming Chair Ergonomic High Back',
  'Monitor Stand with Storage Drawer',
  'Noise Cancelling Earbuds Wireless',
  'Fitness Tracker Smart Band Waterproof',
];

export const generateMockProducts = (count: number = 30): Product[] => {
  return Array.from({ length: count }, (_, index) => {
    const id = `product-${index + 1}`;
    const title = productTitles[index % productTitles.length];
    const category = categories[index % categories.length];
    const price = Math.floor(Math.random() * 200) + 10;
    const rating = (Math.random() * 2 + 3).toFixed(1);
    const reviewCount = Math.floor(Math.random() * 5000) + 10;

    return {
      id,
      title,
      description: `This is a detailed description of ${title}. It features high-quality materials and construction, designed to meet your needs perfectly. With excellent customer reviews and proven reliability, this product is a great choice for anyone looking for quality and value. Enjoy fast shipping and hassle-free returns.`,
      shortDescription: `High-quality ${category.toLowerCase()} item with excellent features and great value.`,
      price,
      images: [
        `https://placehold.co/600x600/e2e8f0/1e293b?text=${encodeURIComponent(title.substring(0, 20))}`,
        `https://placehold.co/600x600/f1f5f9/334155?text=Image+2`,
        `https://placehold.co/600x600/cbd5e1/475569?text=Image+3`,
        `https://placehold.co/600x600/94a3b8/1e293b?text=Image+4`,
      ],
      rating: parseFloat(rating),
      reviewCount,
      category,
      inStock: Math.random() > 0.1, // 90% in stock
    };
  });
};

export const mockProducts = generateMockProducts(30);

export const getMockProductById = (id: string): Product | undefined => {
  return mockProducts.find(p => p.id === id);
};

export const getMockRecommendedProducts = (productId: string, count: number = 6): Product[] => {
  // Return random products excluding the current one
  return mockProducts
    .filter(p => p.id !== productId)
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
};

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2024-10-15',
    total: 249.99,
    status: 'delivered',
    items: [
      {
        productId: 'product-1',
        title: 'Wireless Bluetooth Headphones',
        price: 79.99,
        image: 'https://placehold.co/100x100/e2e8f0/1e293b?text=Headphones',
        quantity: 1,
      },
      {
        productId: 'product-2',
        title: 'Smart Watch',
        price: 169.99,
        image: 'https://placehold.co/100x100/e2e8f0/1e293b?text=Watch',
        quantity: 1,
      },
    ],
  },
  {
    id: 'ORD-002',
    date: '2024-10-20',
    total: 129.99,
    status: 'shipped',
    items: [
      {
        productId: 'product-5',
        title: 'Mechanical Gaming Keyboard',
        price: 129.99,
        image: 'https://placehold.co/100x100/e2e8f0/1e293b?text=Keyboard',
        quantity: 1,
      },
    ],
  },
  {
    id: 'ORD-003',
    date: '2024-10-24',
    total: 89.97,
    status: 'processing',
    items: [
      {
        productId: 'product-14',
        title: 'Stainless Steel Water Bottle',
        price: 29.99,
        image: 'https://placehold.co/100x100/e2e8f0/1e293b?text=Bottle',
        quantity: 3,
      },
    ],
  },
];
