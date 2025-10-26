import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Product } from '@/types/product';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const favorite = isFavorite(product.id);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    // Expand card after 1 second of hover
    hoverTimeoutRef.current = setTimeout(() => {
      setIsExpanded(true);
    }, 1000);
  };

  const handleMouseLeave = () => {
    // Clear timeout and collapse card
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsExpanded(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Navigate to product detail page
    if ((e.target as HTMLElement).closest('button')) {
      // Don't navigate if clicking a button
      return;
    }
    router.push(`/product/${product.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
    toast.success(favorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
    });
    toast.success('Added to cart');
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/product/${product.id}`);
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

  return (
    <div
      ref={cardRef}
      className={`product-card bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ease-in-out ${
        isExpanded ? 'expanded shadow-xl z-10' : 'shadow-sm hover:shadow-md'
      }`}
      style={{
        gridColumn: isExpanded ? 'span 2' : 'span 1',
        minHeight: isExpanded ? '400px' : '320px',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      <div className="p-4 h-full flex flex-col">
        <div className={`flex ${isExpanded ? 'flex-row gap-4' : 'flex-col'}`}>
          {/* Image */}
          <div
            className={`relative ${
              isExpanded ? 'w-1/2 h-64' : 'w-full h-48'
            } bg-gray-100 rounded-md overflow-hidden flex-shrink-0`}
          >
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover"
              unoptimized
            />
            {/* Favorite button */}
            <button
              onClick={handleFavoriteClick}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
            >
              <svg
                className={`w-5 h-5 ${
                  favorite ? 'text-red-500 fill-current' : 'text-gray-400'
                }`}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className={`flex-1 flex flex-col ${isExpanded ? '' : 'mt-3'}`}>
            {/* Title */}
            <h3
              className={`font-medium text-gray-900 ${
                isExpanded ? 'text-lg mb-2' : 'line-clamp-2 mb-2'
              }`}
            >
              {product.title}
            </h3>

            {/* Rating */}
            <div className="mb-2">{renderStars(product.rating)}</div>

            {/* Price */}
            <div className="text-2xl font-bold text-gray-900 mb-2">
              ${product.price.toFixed(2)}
            </div>

            {/* Expanded content */}
            {isExpanded && (
              <div className="flex-1 flex flex-col">
                <div className="text-sm text-gray-600 mb-2">
                  {product.reviewCount.toLocaleString()} reviews
                </div>

                <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                  {product.shortDescription}
                </p>

                <div className="mt-auto space-y-2">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-amazon-orange text-white py-2 px-4 rounded-md font-medium hover:bg-orange-600 transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleViewDetails}
                    className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-medium hover:bg-gray-300 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            )}

            {/* Stock status */}
            {!isExpanded && (
              <div className="mt-auto">
                <span
                  className={`text-sm ${
                    product.inStock ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
