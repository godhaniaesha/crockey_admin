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
import CategoryForm from './Pages/CategoryForm';
import SubCategoryForm from './Pages/SubCategoryForm';
import CouponForm from './Pages/CouponForm';
import OffersForm from './Pages/OffersForm';
import CheckOut from './Pages/CheckOut';

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
          <Route path='category/add' element={<CategoryForm />} />
          <Route path='subcategory/add' element={<SubCategoryForm />} />
          <Route path='coupons/add' element={<CouponForm />} />
          <Route path='offers/add' element={<OffersForm />} />
          <Route path='product/add' element={<ProductForm />} />
          <Route path='product/add' element={<ProductForm />} />
          <Route path='product/list' element={<ProductTable />} />
          <Route path='shop/product' element={<Product />} />
          <Route path='category/list' element={<CategoryList />} />
          <Route path='checkOut' element={<CheckOut />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
