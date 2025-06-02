import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

// formulaire de login admin

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        navigate('/landing-page');
        window.location.reload()
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Incorrect');
      }
    } catch {
      setError('Backend pas lancé!');
    }
  };

  return (
    <div className="flex justify-content-center align-items-center h-screen" style={{ backgroundColor: 'transparent' }}>
      <div className="p-4 border-round w-full sm:w-20rem" style={{ backgroundColor: 'transparent' }}>
        <h2 className="text-center mb-4">Connexion</h2>
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="field mb-3">
            <label htmlFor="username" className="block mb-2">Pseudo</label>
            <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Pseudo" required/>
          </div>
          <div className="field mb-3">
            <label htmlFor="password" className="block mb-2">Mot de passe</label>
            <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} toggleMask placeholder="Mot de passe" required />
          </div>
          {error && <small className="text-red-500 block mb-2">{error}</small>}
          <Button label="Se connecter" type="submit" className="mt-2" />
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
