import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/auth.slice';
import categoryReducer from '../slice/category.slice';
import subcategoryReducer from '../slice/subcat.slice.jsx';
import productReducer from '../slice/product.slice.js';

export const rootReducer = combineReducers({
  auth: authReducer,
  category: categoryReducer,
  subcategory: subcategoryReducer,
  product: productReducer,
});

export default rootReducer;
