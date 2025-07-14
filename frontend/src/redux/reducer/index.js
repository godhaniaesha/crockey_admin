import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/auth.slice';
import categoryReducer from '../slice/category.slice';
import subcategoryReducer from '../slice/subcat.slice.jsx';
import productReducer from '../slice/product.slice.js';
import cartReducer from '../slice/cart.slice.js';
import couponReducer from '../slice/coupon.slice.js';
import dashboardReducer from '../slice/dashboard.slice.js';
import offerReducer from '../slice/offer.slice.js';
import orderReducer from '../slice/order.slice.js';
import wishlistReducer from '../slice/wishlist.slice.js';

export const rootReducer = combineReducers({
  auth: authReducer,
  category: categoryReducer,
  subcategory: subcategoryReducer,
  product: productReducer,
  cart: cartReducer,
  coupon: couponReducer,
  dashboard: dashboardReducer,
  offer: offerReducer,
  order: orderReducer,
  wishlist: wishlistReducer,
});

export default rootReducer;
