// src/redux/middleware/tokenExpiryMiddleware.js
import { logout } from '.././redux/slice/auth.slice'; // adjust path

export const tokenExpiryMiddleware = (store) => (next) => (action) => {
  if (
    action.type.endsWith('/rejected') &&
    action.payload &&
    typeof action.payload === 'string' &&
    (
      action.payload.toLowerCase().includes('token expired') ||
      action.payload.toLowerCase().includes('jwt expired') ||
      action.payload.toLowerCase().includes('unauthorized') ||
      action.payload.toLowerCase().includes('Invalid token')
    )
  ) {
    // Remove sensitive data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    // Dispatch logout
    store.dispatch(logout());
    // Redirect
    window.location.href = '/login';
  }
  return next(action);
};