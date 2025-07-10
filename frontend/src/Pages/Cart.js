import React, { useState } from 'react';
import '../style/z_style.css';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css/pagination';

const sampleCartData = [
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=100&q=80',
    name: 'Ceramic Plate',
    price: 12.99,
    quantity: 2,
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=100&q=80',
    name: 'Glass Bowl',
    price: 8.5,
    quantity: 1,
  },
];

const coupons = [
  { code: 'SAVE10', desc: 'Get 10% off', btn: 'Apply Coupon' },
  { code: 'FREESHIP', desc: 'Free Shipping', btn: 'Apply Coupon' },
  { code: 'VIP20', desc: '20% off for VIP', btn: 'Apply Coupon' },
  { code: 'VIP20', desc: '20% off for VIP', btn: 'Apply Coupon' },
];

function Cart(props) {
  const [cart, setCart] = useState(sampleCartData);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleDelete = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, value) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, Number(value)) } : item
      )
    );
  };

  const getTotal = (item) => (item.price * item.quantity).toFixed(2);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calculate discount based on applied coupon
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.code === 'SAVE10') {
      discount = cartTotal * 0.10;
    } else if (appliedCoupon.code === 'FREESHIP') {
      discount = 5; // Example: $5 off for free shipping
    } else if (appliedCoupon.code === 'VIP20') {
      discount = cartTotal * 0.20;
    }
  }
  const totalAfterDiscount = (cartTotal - discount).toFixed(2);

  const handleApplyCoupon = (coupon) => {
    setAppliedCoupon(coupon);
  };

  return (
    <div className="w-full bg-gray-100 flex items-center justify-center py-6">
      <div className="container mx-auto px-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Table (2/3 width on desktop, full width on mobile/tablet) */}
          <div className="lg:col-span-2">
            <div className="z_cart_container">
              <h3 className="z_cart_title">Cart</h3>
              <div className="z_cart_tableWrapper">
                <table className="z_cart_table">
                  <thead>
                    <tr className="z_cart_tr">
                      <th className="z_cart_th">Product</th>
                      <th className="z_cart_th">Product Name</th>
                      <th className="z_cart_th">Price</th>
                      <th className="z_cart_th">Quantity</th>
                      <th className="z_cart_th">Total</th>
                      <th className="z_cart_th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr className="z_cart_tr" key={item.id}>
                        <td className="z_cart_td">
                          <img src={item.img} alt={item.name} className="z_cart_img" />
                        </td>
                        <td className="z_cart_td">{item.name}</td>
                        <td className="z_cart_td">${item.price.toFixed(2)}</td>
                        <td className="z_cart_td">
                          <div className="z_qty_wrapper">
                            <button
                              className="z_qty_btn"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              –
                            </button>
                            <span className="z_qty_value">{item.quantity}</span>
                            <button
                              className="z_qty_btn"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="z_cart_td">${getTotal(item)}</td>
                        <td className="z_cart_td">
                          <button
                            className="z_cart_actionBtn z_cart_deleteBtn"
                            title="Delete"
                            onClick={() => handleDelete(item.id)}
                          >
                            <RiDeleteBin5Fill />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="z_cart_totalRow">
                <span className="z_cart_totalLabel">Grand Total:</span>
                <span className="z_cart_totalValue">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            {/* Coupon Swiper */}
            <div className="mt-6">
              <Swiper
                spaceBetween={16}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                pagination={{ clickable: true, el: '.z_swiper-pagination' }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop={true}
                modules={[Pagination, Autoplay]}
              >
                {coupons.map((coupon, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center border z_cart_coupon_brdr">
                      <div className="font-bold text-lg mb-1 z_cart_btn_text">{coupon.code}</div>
                      <div className="text-gray-600 mb-3">{coupon.desc}</div>
                      <button
                        className="z_cart_btn"
                        onClick={() => handleApplyCoupon(coupon)}
                        disabled={appliedCoupon && appliedCoupon.code === coupon.code}
                      >
                        {appliedCoupon && appliedCoupon.code === coupon.code ? 'Applied' : coupon.btn}
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="z_swiper-pagination" />
            </div>
          </div>
          {/* Cart Details (1/3 width on desktop, full width below on mobile/tablet) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Cart Details</h4>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-green-600">
                  – ${discount > 0 ? discount.toFixed(2) : '0.00'}
                  {appliedCoupon ? ` (${appliedCoupon.code})` : ''}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="border-t my-3"></div>
              <div className="flex justify-between mb-4">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="font-bold  text-lg">${totalAfterDiscount}</span>
              </div>
              <button className="z_cart_btn w-full font-semibold">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;