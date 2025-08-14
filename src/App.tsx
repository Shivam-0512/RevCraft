import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import { PrivateRoute, SellerPrivateRoute } from './components/PrivateRoute';

// Import all your pages
import Home from './pages/Home';
import BuyParts from './pages/BuyParts';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import ModBot from './pages/ModBot';
import SignIn from './pages/SignIn';
import SellerLanding from './pages/SellerLanding';
import SellerLogin from './pages/SellerLogin';
import SellerRegister from './pages/SellerRegister';
import SellerDashboard from './pages/SellerDashboard';
import AddProduct from './pages/AddProduct';
import MyProducts from './pages/MyProducts';
import Orders from './pages/Orders';
import Profile from './pages/Profile';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-zinc-900 text-white">
          <Routes>
            {/* Public routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/buy-parts" element={<BuyParts />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/seller" element={<SellerLanding />} />
              <Route path="/sellerlogin" element={<SellerLogin />} />
              <Route path="/sellerregister" element={<SellerRegister />} />
              <Route path="/modbot" element={<ModBot />} />
            </Route>

            {/* User-protected routes */}
            <Route element={<PrivateRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/cart" element={<Cart />} />
              </Route>
            </Route>

            {/* Seller-protected routes */}
            <Route element={<SellerPrivateRoute />}>
              <Route path="/sellerdashboard" element={<SellerDashboard />} />
              <Route path="/addproduct" element={<AddProduct />} />
              <Route path="/myproduct" element={<MyProducts />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </div>
      </Router>
    </AuthProvider>
  );
}