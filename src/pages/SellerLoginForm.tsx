import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

// formulaire de login vendeur

function SellerLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/seller-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userRole', 'vendor');
        localStorage.setItem('sellerName', data.user_info.seller_name);
        navigate('/landing-page');
        window.location.reload()
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Erreur de connexion');
      }
    } catch (err) {
      setError('Impossible de se connecter au serveur');
      console.error('Erreur de connexion:', err);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="flex justify-content-center align-items-center min-h-screen" style={{ backgroundColor: 'transparent' }}>
      <div className="p-4 w-full sm:w-20rem border-round" style={{ backgroundColor: 'transparent', color: 'white' }}>
        <div className="text-center mb-4">
          <i className="pi pi-user text-4xl text-white mb-2"></i>
          <h2 className="text-xl font-bold text-white mb-1">Espace Vendeur</h2>
          <p className="text-white text-sm opacity-80">Connectez-vous avec vos identifiants vendeur</p>
        </div>

        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="field mb-3">
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">
              Nom d&rsquo;utilisateur
            </label>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ex: jean.dupont"
              required
              disabled={loading}
              className="w-full"
              style={{ backgroundColor: 'transparent', color: 'white', borderColor: 'white' }}
            />
          </div>

          <div className="field mb-3">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">
              Mot de passe
            </label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              toggleMask
              placeholder="Votre mot de passe"
              inputClassName="w-full"
              required
              disabled={loading}
              inputStyle={{ backgroundColor: 'transparent', color: 'white', borderColor: 'white' }}
              style={{ width: '100%' }}
            />
          </div>

          {error && (
            <small className="text-red-300 block mb-3">{error}</small>
          )}

          <Button
            label={loading ? 'Connexion...' : 'Se connecter'}
            type="submit"
            className="mt-2 w-full"
            loading={loading}
            disabled={loading}
          />
        </form>

        <div className="text-center mt-3">
          <Button
            label="← Retour à l&rsquo;accueil"
            className="p-button-text p-button-sm text-white"
            onClick={() => navigate('/login')}
            disabled={loading}
          />
        </div>

        <div className="mt-4 p-2 border-round text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <small className="text-white opacity-80">
            <i className="pi pi-info-circle mr-1"></i>
            Compte créé par un administrateur
          </small>
        </div>
      </div>
    </div>
  );
}

export default SellerLoginForm;
