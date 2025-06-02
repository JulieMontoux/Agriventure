import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import App from './App';
import './index.css';

import { CartProvider } from './contexts/CartContext'; 

// point d'entrée de notre code

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <CartProvider> 
        <App />
      </CartProvider>
    </PrimeReactProvider>
  </React.StrictMode>
);
