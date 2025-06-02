import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import LoginForm from './pages/LoginForm';
import LandingPage from './pages/LandingPage';
import AdminPanel from './pages/AdminPanel';
import ProductTest from './pages/ProductTest';
import AddProduct from './pages/AddProduct';
import AccountingReport from './components/reports/AccountingReport';
import UserSettings from './pages/UserSettings';
import SellerLoginForm from './pages/SellerLoginForm';
import ProtectedRoute from './components/ProtectedRoute';

// différentes routes + point d'entrée de notre code

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/login-form',
    element: <LoginForm />,
  },
  {
    path: '/seller-login-form',
    element: <SellerLoginForm/>,
  },
  {
    path: '/landing-page',
    element: <LandingPage />,
  },
  {
    path: '/admin-panel',
    element: (
      <ProtectedRoute requireAdmin>
        <AdminPanel />
      </ProtectedRoute>
    ),
  },
  {
    path: '/products-test',
    element: <ProductTest/>
  },
    {
    path: '/add-product',
    element: <AddProduct />
  },
  {
    path: '/comptabilite',
    element: (
      <ProtectedRoute requireAdmin>
        <AccountingReport />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: <UserSettings />
  }
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
