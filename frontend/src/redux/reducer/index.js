import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/auth.slice';

export const rootReducer = combineReducers({
//   category: categoryReducer
    auth: authReducer
});

export default rootReducer;
