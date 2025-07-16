import { useEffect, useState } from 'react';
import '../style/z_style.css';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Pagination, Autoplay } from 'swiper/modules';
import { deleteCart, fetchUserCarts, updateCart, removeProduct } from '../redux/slice/cart.slice';
import 'swiper/css/pagination';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import norecordfound from '../Image/norecordfound.png';

const coupons = [
  { code: 'SAVE10', desc: 'Get 10% off', btn: 'Apply Coupon' },
  { code: 'FREESHIP', desc: 'Free Shipping', btn: 'Apply Coupon' },
  { code: 'VIP20', desc: '20% off for VIP', btn: 'Apply Coupon' },
];

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { carts, loading, error } = useSelector((state) => state.cart);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          return;
        }
        const decoded = jwtDecode(token);
        await dispatch(fetchUserCarts(decoded._id)).unwrap();
      } catch (error) {
        console.error('Data fetching error:', error);
      }
    };
  
    fetchCartData();
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteCart(id)).unwrap();
      // No need to update local state if using Redux state directly
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleQuantityChange = async (cartId, newQuantity, productId) => {
    const quantity = Math.max(1, Number(newQuantity));

    try {
      const cartData = {
        product_id: productId,
        quantity: quantity,
      };
      await dispatch(updateCart({ id: cartId, cartData })).unwrap();
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleRemoveProduct = async (cartId, productId) => {
    // Optimistically remove from local state
    setLocalProducts(prev => prev.filter(item => item.product_id._id !== productId));
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      await dispatch(removeProduct({ user_id: decoded._id, product_id: productId })).unwrap();
    } catch (error) {
      console.error('Remove product error:', error);
      // Optionally restore product if error
      // setLocalProducts(products);
    }
  };

  const getTotal = (item) => {
    const price = item.products[0]?.product_id.price;
    const quantity = item.products[0]?.quantity;
    return (price * quantity).toFixed(2);
  };

  // Convert carts object to array if needed
  const cartItems = Array.isArray(carts) ? carts : Object.values(carts || {});

  const cart = cartItems[0] || {};
  const products = cart.products || [];
  const [localProducts, setLocalProducts] = useState(products);

  // Sync localProducts with Redux products when cart changes
  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  const cartTotal = localProducts.reduce((sum, item) => {
    return sum + (item.product_id.price * item.quantity);
  }, 0);

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

  const handleNavigate = () => {
    const checkoutData = {
      cartItems: cartItems,
      subtotal: cartTotal,
      discount: discount,
      appliedCoupon: appliedCoupon,
      total: parseFloat(totalAfterDiscount)
    };

    navigate('/checkout', { state: checkoutData });
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full bg-gray-100 flex items-center justify-center py-6">
      <div className="container mx-auto px-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Table */}
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
                    {localProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <img
                            src={require('../Image/norecordfound.png')}
                            alt="No records found"
                            style={{ width: 150, margin: "0 auto", display: "block" }}
                          />
                          {/* <div>No records found.</div> */}
                        </td>
                      </tr>
                    ) : (
                      localProducts.map((item) => (
                        <tr className="z_cart_tr" key={item._id}>
                          <td className="z_cart_td">
                            <img
                              src={`http://localhost:5000/uploads/${item.product_id.images[0]}`}
                              alt={item.product_id.name}
                              className="z_cart_img"
                            />
                          </td>
                          <td className="z_cart_td">{item.product_id.name}</td>
                          <td className="z_cart_td">${item.product_id.price.toFixed(2)}</td>
                          <td className="z_cart_td">
                            <div className="z_qty_wrapper">
                              <button
                                type="button"
                                className="z_qty_btn"
                                onClick={() => handleQuantityChange(cart._id, item.quantity - 1, item.product_id._id)}
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                –
                              </button>
                              <span className="z_qty_value">{item.quantity}</span>
                              <button
                                type="button"
                                className="z_qty_btn"
                                onClick={() => handleQuantityChange(cart._id, item.quantity + 1, item.product_id._id)}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>

                            </div>
                          </td>
                          <td className="z_cart_td">${(item.product_id.price * item.quantity).toFixed(2)}</td>
                          <td className="z_cart_td">
                            <button
                              className="z_cart_actionBtn z_cart_deleteBtn"
                              title="Delete"
                              onClick={() => handleRemoveProduct(cart._id, item.product_id._id)}
                            >
                              <RiDeleteBin5Fill />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
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

          {/* Cart Details */}
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
                  – ${discount > 0 ? discount.toFixed(2).replace(/\\.$/, '') : '0.00'}
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
                <span className="font-bold text-lg">${totalAfterDiscount}</span>
              </div>
              <button className="z_cart_btn w-full font-semibold" onClick={handleNavigate}>Proceed to Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;