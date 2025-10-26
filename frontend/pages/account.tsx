import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { mockOrders } from '@/utils/mockData';
import { Order } from '@/types/cart';

type Tab = 'profile' | 'orders' | 'addresses' | 'settings';

const Account: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [orders] = useState<Order[]>(mockOrders);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-white border border-gray-200 rounded-lg p-4">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-md mb-2 transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-amazon-orange text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 rounded-md mb-2 transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-amazon-orange text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Order History
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-4 py-3 rounded-md mb-2 transition-colors ${
                  activeTab === 'addresses'
                    ? 'bg-amazon-orange text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Saved Addresses
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-amazon-orange text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Settings
              </button>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Profile Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      className="input-field bg-gray-50"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      className="input-field bg-gray-50"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User ID
                    </label>
                    <input
                      type="text"
                      value={user.id}
                      className="input-field bg-gray-50"
                      disabled
                    />
                  </div>

                  <p className="text-sm text-gray-500 mt-4">
                    Profile editing is currently disabled in demo mode
                  </p>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Order History
                </h2>

                {orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Order {order.id}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Placed on {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex gap-3">
                              <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {item.title}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Qty: {item.quantity} × ${item.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                          <span className="font-semibold text-gray-900">
                            Total: ${order.total.toFixed(2)}
                          </span>
                          <button className="text-amazon-orange font-medium hover:underline">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Saved Addresses
                </h2>

                <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">No saved addresses</p>
                  <button className="btn-primary">Add New Address</button>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Email Notifications
                    </h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3"
                          defaultChecked
                        />
                        <span className="text-gray-700">Order updates</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3"
                          defaultChecked
                        />
                        <span className="text-gray-700">Promotional emails</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span className="text-gray-700">Newsletter</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Privacy
                    </h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3"
                          defaultChecked
                        />
                        <span className="text-gray-700">
                          Keep me logged in
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span className="text-gray-700">
                          Share data for better recommendations
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button className="btn-primary">Save Settings</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
