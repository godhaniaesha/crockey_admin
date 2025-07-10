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
import Cart from './Pages/Cart.jsx';

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
          <Route path='product/detail' element={<ProductDetail />} />
          <Route path='shop/product' element={<Product />} />
          <Route path='category/list' element={<CategoryList />} />
          <Route path='privacy_policy' element={<PrivacyPolicy></PrivacyPolicy>} />
          <Route path='shop/cart' element={<Cart></Cart>} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
