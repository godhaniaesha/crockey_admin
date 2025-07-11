# Authentication Middleware Documentation

This middleware provides role-based access control for your application with three main user roles: **Admin**, **Seller**, and **User**.

## Available Middleware Functions

### 1. `authenticateToken`
- **Purpose**: Verifies JWT token and loads user data
- **Usage**: Use this for any route that requires authentication
- **Example**: `router.get('/profile', authenticateToken, controller.getProfile)`

### 2. `requireAdmin`
- **Purpose**: Ensures only admin users can access the route
- **Usage**: For admin-only functionality like dashboard, user management
- **Example**: `router.get('/dashboard', requireAdmin, controller.getDashboard)`

### 3. `requireSeller`
- **Purpose**: Ensures only seller users can access the route
- **Usage**: For seller-specific functionality
- **Example**: `router.get('/seller/products', requireSeller, controller.getSellerProducts)`

### 4. `requireUser`
- **Purpose**: Ensures only regular users can access the route
- **Usage**: For user-specific functionality
- **Example**: `router.get('/user/orders', requireUser, controller.getUserOrders)`

### 5. `requireAdminOrSeller`
- **Purpose**: Allows both admin and seller access
- **Usage**: For functionality that both admins and sellers need
- **Example**: `router.post('/products', requireAdminOrSeller, controller.createProduct)`

### 6. `requireAdminOrUser`
- **Purpose**: Allows both admin and user access
- **Usage**: For functionality that both admins and users need
- **Example**: `router.get('/orders', requireAdminOrUser, controller.getOrders)`

### 7. `requireOwnership`
- **Purpose**: Ensures users can only access their own data (admin can access all)
- **Usage**: For user-specific data like profiles, orders
- **Example**: `router.get('/users/:userId', requireOwnership, controller.getUserProfile)`

### 8. `requireSellerOwnership`
- **Purpose**: Ensures sellers can only access their own data
- **Usage**: For seller-specific data like their products
- **Example**: `router.put('/products/:id', requireSellerOwnership, controller.updateProduct)`

## Role-Based Access Matrix

| Route Type | Admin | Seller | User | Public |
|------------|-------|--------|------|--------|
| Dashboard | ✅ | ❌ | ❌ | ❌ |
| User Management | ✅ | ❌ | ❌ | ❌ |
| Product Management | ✅ | ✅ (own products) | ❌ | ❌ |
| Product Viewing | ✅ | ✅ | ✅ | ✅ |
| Order Management | ✅ | ✅ (own orders) | ✅ (own orders) | ❌ |
| Cart Operations | ❌ | ❌ | ✅ | ❌ |
| Wishlist Operations | ❌ | ❌ | ✅ | ❌ |
| Category Management | ✅ | ❌ | ❌ | ❌ |
| Coupon Management | ✅ | ❌ | ❌ | ❌ |
| Offer Management | ✅ | ❌ | ❌ | ❌ |

## Implementation Examples

### Admin-Only Routes
```javascript
// Dashboard routes
router.get('/dashboard/summary', requireAdmin, controller.getSummary);
router.get('/dashboard/sales', requireAdmin, controller.getSales);

// User management
router.get('/users', requireAdmin, controller.getAllUsers);
router.post('/users', requireAdmin, controller.createUser);
router.put('/users/:id', requireAdmin, controller.updateUser);
router.delete('/users/:id', requireAdmin, controller.deleteUser);
```

### Seller-Specific Routes
```javascript
// Seller can manage their own products
router.post('/products', requireAdminOrSeller, controller.createProduct);
router.put('/products/:id', requireAdminOrSeller, requireSellerOwnership, controller.updateProduct);
router.delete('/products/:id', requireAdminOrSeller, requireSellerOwnership, controller.deleteProduct);

// Seller can view their own orders
router.get('/seller/orders', requireSeller, controller.getSellerOrders);
```

### User-Specific Routes
```javascript
// User can manage their own cart
router.post('/cart/add', authenticateToken, controller.addToCart);
router.get('/cart', authenticateToken, controller.getCart);
router.delete('/cart/:itemId', authenticateToken, controller.removeFromCart);

// User can manage their own orders
router.post('/orders', authenticateToken, controller.createOrder);
router.get('/orders/my-orders', authenticateToken, controller.getUserOrders);
router.get('/orders/:id', authenticateToken, requireOwnership, controller.getOrder);
```

### Public Routes
```javascript
// Product viewing (public)
router.get('/products', controller.getAllProducts);
router.get('/products/:id', controller.getProductById);

// Category viewing (public)
router.get('/categories', controller.getAllCategories);
router.get('/categories/:id', controller.getCategoryById);
```

## Error Responses

The middleware returns standardized error responses:

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token is required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Authentication error"
}
```

## Security Features

1. **Token Verification**: Validates JWT tokens
2. **User Validation**: Checks if user exists and is active
3. **Role-Based Access**: Enforces role-specific permissions
4. **Ownership Validation**: Ensures users can only access their own data
5. **Error Handling**: Comprehensive error handling for different scenarios

## Usage Notes

1. **Order Matters**: Apply middleware in the correct order - authentication first, then role checks
2. **Ownership Checks**: Use `requireOwnership` for user-specific data
3. **Public Routes**: Don't apply any middleware for truly public routes
4. **Error Handling**: The middleware handles common authentication errors automatically
5. **Token Format**: Expects Bearer token format: `Authorization: Bearer <token>`

## Environment Variables Required

Make sure you have these environment variables set:
- `JWT_SECRET`: Secret key for JWT token verification
- `JWT_EXPIRES_IN`: Token expiration time (e.g., '24h') 