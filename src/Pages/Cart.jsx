import React, { useState } from 'react';
import { Minus, Plus, X, ShoppingCart, Tag, Percent, Gift } from 'lucide-react';

const ShoppingCartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      price: 2999,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
      color: 'Black',
      size: 'M'
    },
    {
      id: 2,
      name: 'Premium Cotton T-Shirt',
      price: 899,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
      color: 'Blue',
      size: 'L'
    },
    {
      id: 3,
      name: 'Smartphone Case',
      price: 599,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=100&h=100&fit=crop',
      color: 'Clear',
      size: 'iPhone 14'
    }
  ]);

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const coupons = [
    {
      id: 1,
      code: 'SAVE20',
      discount: 20,
      type: 'percentage',
      title: '20% Off',
      description: 'On orders above ₹2000',
      icon: <Percent className="w-5 h-5" />
    },
    {
      id: 2,
      code: 'FLAT500',
      discount: 500,
      type: 'fixed',
      title: '₹500 Off',
      description: 'On orders above ₹3000',
      icon: <Tag className="w-5 h-5" />
    },
    {
      id: 3,
      code: 'NEWUSER',
      discount: 15,
      type: 'percentage',
      title: '15% Off',
      description: 'For new customers',
      icon: <Gift className="w-5 h-5" />
    }
  ];

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyCoupon = (coupon) => {
    setAppliedCoupon(coupon);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % coupons.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + coupons.length) % coupons.length);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 1999 ? 0 : 99;
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.discount) / 100;
    } else {
      discountAmount = appliedCoupon.discount;
    }
  }
  
  const total = subtotal + shippingCost - discountAmount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
            <div className="text-sm text-gray-500">
              {cartItems.length} items in cart
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Products & Coupons */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Cart Items</h2>
                
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-medium text-gray-700">Product</th>
                        <th className="text-center py-3 px-2 font-medium text-gray-700">Price</th>
                        <th className="text-center py-3 px-2 font-medium text-gray-700">Quantity</th>
                        <th className="text-center py-3 px-2 font-medium text-gray-700">Total</th>
                        <th className="text-center py-3 px-2 font-medium text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="py-4 px-2">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div>
                                <h3 className="font-medium text-gray-900">{item.name}</h3>
                                <p className="text-sm text-gray-500">
                                  {item.color} | {item.size}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="text-center py-4 px-2 font-medium text-gray-900">
                            ₹{item.price.toLocaleString()}
                          </td>
                          <td className="text-center py-4 px-2">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className="text-center py-4 px-2 font-medium text-gray-900">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </td>
                          <td className="text-center py-4 px-2">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {item.color} | {item.size}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              ₹{item.price.toLocaleString()}
                            </span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <span className="font-semibold text-gray-900">
                              Total: ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Apply Coupon</h2>
                
                {/* Applied Coupon Display */}
                {appliedCoupon && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                          {appliedCoupon.icon}
                        </div>
                        <div>
                          <p className="font-medium text-green-800">
                            {appliedCoupon.code} Applied!
                          </p>
                          <p className="text-sm text-green-600">
                            You saved ₹{discountAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Coupon Slider */}
                <div className="relative">
                  <div className="overflow-hidden rounded-lg">
                    <div 
                      className="flex transition-transform duration-300 ease-in-out"
                      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                      {coupons.map((coupon) => (
                        <div key={coupon.id} className="w-full flex-shrink-0">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                  {coupon.icon}
                                </div>
                                <div>
                                  <h3 className="font-bold text-lg">{coupon.title}</h3>
                                  <p className="text-sm text-white text-opacity-90">
                                    {coupon.description}
                                  </p>
                                  <p className="text-sm font-mono bg-white bg-opacity-20 px-2 py-1 rounded mt-1 inline-block">
                                    {coupon.code}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => applyCoupon(coupon)}
                                disabled={appliedCoupon?.id === coupon.id}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                  appliedCoupon?.id === coupon.id
                                    ? 'bg-green-500 text-white cursor-not-allowed'
                                    : 'bg-white text-blue-600 hover:bg-gray-100'
                                }`}
                              >
                                {appliedCoupon?.id === coupon.id ? 'Applied' : 'Apply'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Dots */}
                  <div className="flex justify-center space-x-2 mt-4">
                    {coupons.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Bill Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border sticky top-8">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${shippingCost}`
                      )}
                    </span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {subtotal < 1999 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Add ₹{(1999 - subtotal).toLocaleString()} more to get free shipping!
                    </p>
                  </div>
                )}

                <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                  Proceed to Checkout
                </button>

                <button className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors">
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;