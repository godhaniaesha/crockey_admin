import React, { useState, useEffect } from 'react';
import '../style/x_app.css';
import { FiX, FiEye } from 'react-icons/fi';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const initialCartItems = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=facearea&w=64&h=64',
    name: 'Long Top',
    price: 21,
    quantity: 5,
    total: 12456,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=64&h=64',
    name: 'Fancy watch',
    price: 50,
    quantity: 5,
    total: 12456,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=64&h=64',
    name: 'Man shoes',
    price: 11,
    quantity: 5,
    total: 12456,
  },
];

const couponList = [
  { code: 'SAVE10', desc: 'Save 10% on your order' },
  { code: 'FREESHIP', desc: 'Free Shipping' },
  { code: 'WELCOME', desc: 'Welcome Offer: 15% Off' },
];

// Add a function to extract percentage from coupon description
function getCouponDiscountPercent(code) {
  if (code === 'SAVE10') return 10;
  if (code === 'WELCOME') return 15;
  return 0;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [shipping, setShipping] = useState('flat');
  const [couponIdx, setCouponIdx] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const navigate = useNavigate();

  const getVisibleCoupons = () => {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 2561) return 3;
    return 2;
  };

  const [visibleCoupons, setVisibleCoupons] = useState(getVisibleCoupons());

  useEffect(() => {
    const handleResize = () => {
      setVisibleCoupons(getVisibleCoupons());
    };
    window.addEventListener('resize', handleResize);
    // Set initial value
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shipping === 'flat' ? 40 : 30;
  const discountPercent = getCouponDiscountPercent(appliedCoupon);
  const discountAmount = subtotal * (discountPercent / 100);
  const tax = 20; // You can make this dynamic if needed
  const total = subtotal - discountAmount + shippingCost + tax;

  const handleQtyChange = (id, delta) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleCouponSlide = (dir) => {
    setCouponIdx(idx => {
      let next = idx + dir;
      if (next < 0) next = couponList.length - 1;
      if (next >= couponList.length) next = 0;
      return next;
    });
  };

  const handleApplyCoupon = () => {
    setAppliedCoupon(couponList[couponIdx].code);
  };

  return (
    <div className="x_cart_main_grid">
      <div className="x_cart_table_section">
        <div className="x_cart_table_wrapper">
          <table className="x_cart_table">
            <thead>
              <tr>
                <th>Prduct</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.id}>
                  <td className='flex justify-center'><img src={item.image} alt={item.name} className="x_cart_img" /></td>
                  <td>{item.name}</td>
                  <td>${item.price}</td>
                  <td>
                    <div className="x_cart_qty">
                      <button className="x_cart_qty_btn" onClick={() => handleQtyChange(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button className="x_cart_qty_btn" onClick={() => handleQtyChange(item.id, 1)}>+</button>
                    </div>
                  </td>
                  <td>${item.price * item.quantity}</td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button className="x_cart_remove" onClick={() => handleRemove(item.id)}><FiX size={22} /></button>
                      <button className="x_cart_remove"><FiEye size={22} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="x_cart_coupon_card_row">
          <button className="x_cart_coupon_slide_btn" onClick={() => handleCouponSlide(-1)}><FaAngleLeft /></button>
          <div className="x_cart_coupon_cards">
            {Array.from({ length: visibleCoupons }).map((_, offset) => {
              const idx = (couponIdx + offset) % couponList.length;
              const coupon = couponList[idx];
              return (
                <div className="x_cart_coupon_card" key={coupon.code}>
                  <div className="x_cart_coupon_content">
                    <div className="x_cart_coupon_code">{coupon.code}</div>
                    <div className="x_cart_coupon_desc">{coupon.desc}</div>
                  </div>
                  <button
                    className="x_cart_coupon_apply_btn"
                    onClick={() => setAppliedCoupon(coupon.code)}
                    disabled={appliedCoupon === coupon.code}
                  >
                    {appliedCoupon === coupon.code ? 'Applied' : 'Apply Coupon'}
                  </button>
                </div>
              );
            })}
          </div>
          <button className="x_cart_coupon_slide_btn" onClick={() => handleCouponSlide(1)}><FaAngleRight /></button>
        </div>
      </div>
      <div className="x_cart_side_section">
        
        <div className="x_cart_totals_card">
          <h3 className="x_cart_totals_title">CART TOTALS</h3>
          <div className="x_cart_totals_row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="x_cart_totals_row">
            <span>Discount Amount</span>
            <span>{discountPercent > 0 ? `- $${discountAmount.toFixed(2)} (${discountPercent}%)` : '-'}</span>
          </div>
          <div className="x_cart_totals_row">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <hr className="x_cart_totals_divider" />
          <div className="x_cart_totals_shipping">
            <div className="x_cart_totals_shipping_title">Shipping</div>
            <label className="x_cart_radio_label">
              <input type="radio" name="shipping" checked={shipping === 'flat'} onChange={() => setShipping('flat')} />
              <span className="x_cart_radio_custom"></span>
              Flat rate: $40.00
            </label>
            <label className="x_cart_radio_label">
              <input type="radio" name="shipping" checked={shipping === 'local'} onChange={() => setShipping('local')} />
              <span className="x_cart_radio_custom"></span>
              Local pickup: $30.00
            </label>
            {/* <div className="x_cart_shipping_info">Shipping options will be updated during checkout.</div> */}
            <div className="x_cart_calculate_shipping" onClick={() => navigate('/shop/product')} style={{cursor: 'pointer'}}>
              <span>Continue Shopping</span>
              <span className="x_cart_calculate_icon">+</span>
            </div>
          </div>
          <hr className="x_cart_totals_divider" />
          <div className="x_cart_totals_row x_cart_totals_total">
            <span>Total</span>
            <span className="x_cart_totals_total_value">${total.toFixed(2)}</span>
          </div>
          <button className="x_cart_checkout_btn">PROCEED TO CHECKOUT</button>
        </div>

      </div>
    </div>
  );
};

export default Cart;
