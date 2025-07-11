import { combineReducers } from '@reduxjs/toolkit';
import categoryReducer from '../slice/category.slice';
import subcategoryReducer from '../slice/subcat.slice.jsx';
import productReducer from '../slice/product.slice.js';

export const rootReducer = combineReducers({
  category: categoryReducer,
  subcategory: subcategoryReducer,
  product: productReducer,
});

export default rootReducer;
