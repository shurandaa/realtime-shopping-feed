import React, { useState, useEffect, useCallback, useRef } from 'react';
import Layout from '@/components/Layout/Layout';
import ProductGrid from '@/components/ProductGrid';
import { Product } from '@/types/product';
import { getProducts } from '@/utils/api';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Load initial products
  useEffect(() => {
    loadProducts(1);
  }, []);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (isLoading || !hasMore) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadProducts(page + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [page, hasMore, isLoading]);

  const loadProducts = async (pageNum: number) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await getProducts(pageNum, 8);
      setProducts((prev) => [...prev, ...response.products]);
      setHasMore(response.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
      setInitialLoading(false);
    }
  };

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden p-4 animate-pulse">
      <div className="w-full h-48 bg-gray-200 rounded-md mb-3"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  if (initialLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">
            Discover our wide selection of quality products
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <ProductGrid products={products} />

            {/* Loading indicator for infinite scroll */}
            {hasMore && (
              <div ref={loadMoreRef} className="mt-8">
                {isLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* End of products message */}
            {!hasMore && products.length > 0 && (
              <div className="text-center py-8 text-gray-500">
                You&apos;ve reached the end of our product catalog
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;
