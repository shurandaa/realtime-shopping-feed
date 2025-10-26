import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { Product } from "@/data/mockProducts";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement | null>(null);

  const loadProducts = useCallback(async (pageNum: number) => {
    try {
      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      console.log("before");
      const response = await api.getRecommendationList(pageNum, 12);
      console.log("response%", response);

      if (pageNum === 1) {
        setProducts(response.products);
      } else {
        setProducts((prev) => [...prev, ...response.products]);
      }

      setHasMore(response.hasMore);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    loadProducts(1);
  }, [isAuthenticated, navigate, loadProducts]);

  useEffect(() => {
    if (isLoading || isLoadingMore || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (lastProductRef.current) {
      observerRef.current.observe(lastProductRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading, isLoadingMore, hasMore, products]);

  useEffect(() => {
    if (page > 1) {
      loadProducts(page);
    }
  }, [page, loadProducts]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6">All Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <section>
          <h2 className="text-3xl font-bold mb-6">All Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div
                key={product.id}
                ref={index === products.length - 1 ? lastProductRef : null}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {isLoadingMore && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`skeleton-${index}`} className="space-y-4">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          )}

          {!hasMore && products.length > 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                You've reached the end of the catalog
              </p>
            </div>
          )}

          {!isLoading && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No products available at the moment
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Index;
