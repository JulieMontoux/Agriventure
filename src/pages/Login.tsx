import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { useAuth } from '../contexts/AuthContext';
import '../assets/styles/login.css';
import logo from '../assets/images/agriventure-logo.png';

// page de pré-login (choix vendeur et admin)

const Login: React.FC = () => {
  const { loading, error } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async (): Promise<void> => {
    try {
      navigate('/login-form');
    } catch (err: unknown) {
      console.error('Erreur navigation admin:', err);
    }
  };

  const handleSellerLogin = async (): Promise<void> => {
    try {
      navigate('/seller-login-form');
    } catch (err: unknown) {
      console.error('Erreur navigation vendeur:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-logo">
          <Image src={logo} alt="Agriventure logo" width="180" />
        </div>

        <div className="login-buttons">
          <Button
            label="Compte administrateur"
            icon="pi pi-shield"
            className="p-button-raised admin-button mb-3"
            onClick={handleAdminLogin}
            disabled={loading}
            aria-label="Se connecter en tant qu'administrateur"
          />
          
          <Button
            label="Compte vendeur"
            icon="pi pi-user"
            className="p-button-raised seller-button"
            onClick={handleSellerLogin}
            disabled={loading}
            aria-label="Se connecter en tant que vendeur"
          />

          {error && <div className="login-error mt-3" role="alert">{error}</div>}
          
          <div className="login-info mt-4">
            <small className="text-600">
              <i className="pi pi-info-circle mr-1"></i>
              Les comptes vendeurs sont créés par l&rsquo;administrateur
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
