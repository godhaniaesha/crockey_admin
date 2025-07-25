import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login';
import ForgotPassword from './Pages/ForgotPassword';
import EmailVerificaion from './Pages/EmailVerification';
import ResetPassword from './Pages/ResetPassword';
import Dashboard from './Pages/Dashboard';
import Main from './Pages/Main';
import ProductForm from './Pages/ProductForm';
import ProductTable from './Pages/ProductTable';
import Product from './Pages/Product';
import CategoryList from './Pages/CategoryList';
import ProductDetail from './Pages/ProductDetail.jsx';
import PrivacyPolicy from './Pages/PrivacyPolicy.jsx';
import Cart from './Pages/Cart.js';
import SubcategoryList from './Pages/SubcategoryList';
import OrderList from './Pages/OrderList';
import CustomerList from './Pages/CustomerList';
import CouponList from './Pages/CouponList';
import Profile from './Pages/Profile';
import CategoryForm from './Pages/CategoryForm';
import SubCategoryForm from './Pages/SubCategoryForm';
import CouponForm from './Pages/CouponForm';
import CouponEditForm from './Pages/CouponEditForm';
import CheckOut from './Pages/CheckOut';
import Spinner from './Pages/Spinner.js';
import OrdersPlacedTable from './Pages/OrdersPlacedTable';
import OrdersForMyProductsTable from './Pages/OrdersForMyProductsTable';
import OrderView from './Pages/OrderView.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/forgotPassword' element={<ForgotPassword />}></Route>
        <Route path='/emailVerification' element={<EmailVerificaion />}></Route>
        <Route path='/resetPassword' element={<ResetPassword />}></Route>
        <Route path='/spinner' element={<Spinner />}></Route>

        <Route path='/' element={<Main />}>
          <Route index element={<Dashboard />} />
          <Route path='category/add' element={<CategoryForm />} />
          <Route path='subcategory/add' element={<SubCategoryForm />} />
          <Route path='coupons/add' element={<CouponForm />} />
          <Route path='coupons/edit/:id' element={<CouponEditForm />} />
          <Route path='product/add' element={<ProductForm />} />
          <Route path='product/add' element={<ProductForm />} />
          <Route path='product/list' element={<ProductTable />} />
          <Route path='product/detail' element={<ProductDetail />} />
          <Route path='shop/product' element={<Product />} />
          <Route path='category/list' element={<CategoryList />} />
          <Route path='privacy_policy' element={<PrivacyPolicy></PrivacyPolicy>} />
          <Route path='shop/cart' element={<Cart></Cart>} />
          <Route path='subcategory/list' element={<SubcategoryList />} />
          <Route path='orders/list' element={<OrderList />} />
          <Route path='customer/list' element={<CustomerList />} />
          <Route path='coupons/list' element={<CouponList />} />       
          <Route path='/profile' element={<Profile />} />
          <Route path='checkOut' element={<CheckOut />} />
          <Route path='orders/placed' element={<OrdersPlacedTable />} />
          <Route path='orders/for-my-products' element={<OrdersForMyProductsTable />} />
          <Route path='orders/singleOrder' element={<OrderView />} />

          {/* edit */}
          <Route path="/edit-category/:id" element={<CategoryForm />} />
          <Route path="product/edit/:id" element={<ProductForm />} />
          <Route path="/edit-subcategory/:id" element={<SubCategoryForm />} />

        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
