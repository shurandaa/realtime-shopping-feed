import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types/product';
import { mockProducts } from '@/utils/mockData';
import toast from 'react-hot-toast';

const Favorites: React.FC = () => {
  const router = useRouter();
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Get product details for favorite IDs
    const products = mockProducts.filter((p) => favorites.includes(p.id));
    setFavoriteProducts(products);
  }, [favorites]);

  const handleRemoveFavorite = (productId: string, title: string) => {
    removeFromFavorites(productId);
    toast.success(`Removed ${title} from favorites`);
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
    });
    toast.success('Added to cart');
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-4 h-4 ${
              index < Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (favoriteProducts.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start adding products to your favorites to see them here.
            </p>
            <Link
              href="/"
              className="inline-block bg-amazon-orange text-white px-6 py-3 rounded-md font-semibold hover:bg-orange-600 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
          <p className="text-gray-600">
            {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                {/* Image */}
                <div
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden mb-3 cursor-pointer"
                >
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Title */}
                <h3
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="font-medium text-gray-900 line-clamp-2 mb-2 cursor-pointer hover:text-amazon-orange transition-colors"
                >
                  {product.title}
                </h3>

                {/* Rating */}
                <div className="mb-2">{renderStars(product.rating)}</div>

                {/* Price */}
                <div className="text-2xl font-bold text-gray-900 mb-4">
                  ${product.price.toFixed(2)}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-amazon-orange text-white py-2 px-4 rounded-md font-medium hover:bg-orange-600 transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveFavorite(product.id, product.title)}
                    className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5 text-red-500 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Favorites;
