import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const subtotal = getCartTotal();
  const estimatedTax = subtotal * 0.1; // 10% tax
  const total = subtotal + estimatedTax;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId: string, title: string) => {
    removeFromCart(productId);
    toast.success(`Removed ${title} from cart`);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    router.push('/checkout');
  };

  if (cart.length === 0) {
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Link
              href="/"
              className="inline-block bg-amazon-orange text-white px-6 py-3 rounded-md font-semibold hover:bg-orange-600 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4"
              >
                {/* Product Image */}
                <Link
                  href={`/product/${item.productId}`}
                  className="relative w-32 h-32 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </Link>

                {/* Product Info */}
                <div className="flex-1 flex flex-col">
                  <Link
                    href={`/product/${item.productId}`}
                    className="text-lg font-medium text-gray-900 hover:text-amazon-orange transition-colors mb-2"
                  >
                    {item.title}
                  </Link>

                  <div className="text-xl font-bold text-gray-900 mb-4">
                    ${item.price.toFixed(2)}
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    {/* Quantity Adjuster */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.productId, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
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
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.productId,
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-amazon-orange"
                      />
                      <button
                        onClick={() =>
                          handleQuantityChange(item.productId, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
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

                    {/* Subtotal */}
                    <div className="text-lg font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.productId, item.title)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Estimated Tax</span>
                  <span>${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-amazon-orange text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-orange-600 transition-colors"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/"
                className="block text-center text-amazon-orange font-medium mt-4 hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
