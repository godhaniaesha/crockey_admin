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
import SubcategoryList from './Pages/SubcategoryList';
import OrderList from './Pages/OrderList';
import CustomerList from './Pages/CustomerList';
import CouponList from './Pages/CouponList';
import OfferList from './Pages/OfferList';
import Profile from './Pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/forgotPassword' element={<ForgotPassword />}></Route>
        <Route path='/emailVerification' element={<EmailVerificaion />}></Route>
        <Route path='/resetPassword' element={<ResetPassword />}></Route>

        <Route path='/' element={<Main />}>
          <Route index element={<Dashboard />} />
          <Route path='product/add' element={<ProductForm />} />
          <Route path='product/list' element={<ProductTable />} />
          <Route path='shop/product' element={<Product />} />
          <Route path='category/list' element={<CategoryList />} />
          <Route path='subcategory/list' element={<SubcategoryList />} />
          <Route path='orders/list' element={<OrderList />} />
          <Route path='customer/list' element={<CustomerList />} />
          <Route path='coupons/list' element={<CouponList />} />
          <Route path='offers/list' element={<OfferList />} />
          <Route path='profile' element={<Profile />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
