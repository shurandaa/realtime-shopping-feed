import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { ShippingAddress } from '@/types/cart';
import toast from 'react-hot-toast';

const Checkout: React.FC = () => {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'paypal'>('credit');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      router.push('/login');
      return;
    }

    // Redirect to cart if cart is empty
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      router.push('/cart');
    }
  }, [isAuthenticated, cart, router]);

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!shippingAddress.fullName || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      clearCart();
      setIsProcessing(false);
      toast.success('Order placed successfully!');
      router.push('/account');
    }, 2000);
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Shipping and Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={shippingAddress.addressLine1}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={shippingAddress.addressLine2}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zip/Postal Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Payment Method
                </h2>

                <div className="space-y-4">
                  {/* Credit Card Option */}
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'credit'
                        ? 'border-amazon-orange bg-orange-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => setPaymentMethod('credit')}
                  >
                    <div className="flex items-center mb-3">
                      <input
                        type="radio"
                        name="payment"
                        value="credit"
                        checked={paymentMethod === 'credit'}
                        onChange={() => setPaymentMethod('credit')}
                        className="mr-3"
                      />
                      <label className="font-medium text-gray-900">
                        Credit/Debit Card
                      </label>
                    </div>

                    {paymentMethod === 'credit' && (
                      <div className="ml-6 space-y-3">
                        <input
                          type="text"
                          placeholder="Card Number"
                          className="input-field"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="input-field"
                          />
                          <input
                            type="text"
                            placeholder="CVV"
                            className="input-field"
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          (UI mockup only - no actual payment processing)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* PayPal Option */}
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'paypal'
                        ? 'border-amazon-orange bg-orange-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => setPaymentMethod('paypal')}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                        className="mr-3"
                      />
                      <label className="font-medium text-gray-900">PayPal</label>
                    </div>

                    {paymentMethod === 'paypal' && (
                      <div className="ml-6 mt-3">
                        <button
                          type="button"
                          className="bg-blue-500 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-600 transition-colors"
                        >
                          Connect PayPal
                        </button>
                        <p className="text-xs text-gray-500 mt-2">
                          (UI mockup only)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Order Summary
                </h2>

                {/* Order Items */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Order Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-amazon-orange text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-orange-600 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Place Order'
                  )}
                </button>

                {subtotal < 50 && (
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Add ${(50 - subtotal).toFixed(2)} more for FREE shipping
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
