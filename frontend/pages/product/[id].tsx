import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout';
import ProductGrid from '@/components/ProductGrid';
import { Product } from '@/types/product';
import { getProductById, getRecommendedProducts } from '@/utils/api';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import toast from 'react-hot-toast';

const ProductDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [product, setProduct] = useState<Product | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadProductData(id);
    }
  }, [id]);

  const loadProductData = async (productId: string) => {
    setIsLoading(true);
    try {
      const [productData, recommended] = await Promise.all([
        getProductById(productId),
        getRecommendedProducts(productId),
      ]);
      setProduct(productData);
      setRecommendedProducts(recommended);
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Product not found');
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(
      {
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0],
      },
      quantity
    );
    toast.success(`Added ${quantity} item(s) to cart`);
  };

  const handleToggleFavorite = () => {
    if (!product) return;
    toggleFavorite(product.id);
    toast.success(
      isFavorite(product.id) ? 'Removed from favorites' : 'Added to favorites'
    );
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${
              index < Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return null;
  }

  const favorite = isFavorite(product.id);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Images */}
          <div>
            {/* Main Image */}
            <div className="relative h-96 bg-gray-100 rounded-lg mb-4 overflow-hidden">
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 bg-gray-100 rounded overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-amazon-orange'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-4">
              {renderStars(product.rating)}
              <span className="text-gray-600">
                ({product.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            <div className="text-4xl font-bold text-gray-900 mb-6">
              ${product.price.toFixed(2)}
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              {product.shortDescription}
            </p>

            <div className="mb-6">
              <span
                className={`text-lg font-medium ${
                  product.inStock ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={decrementQuantity}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-amazon-orange"
                />
                <button
                  onClick={incrementQuantity}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-amazon-orange text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              <button
                onClick={handleToggleFavorite}
                className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-md font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className={`w-6 h-6 ${
                    favorite ? 'text-red-500 fill-current' : 'text-gray-600'
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
                {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </div>
          </div>
        </div>

        {/* Full Description */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product Description
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Customers Also Bought
            </h2>
            <ProductGrid products={recommendedProducts} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
