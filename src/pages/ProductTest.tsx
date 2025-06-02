import { useEffect, useState } from 'react';

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

// page non utilisée pour voir la liste des produits () (peut servir pour debug)

interface ProductTest {
  id: number;
  type: string;
  varieties: string;
  kg_price: number;
  euro_price: number;
}

function ProductTest() {
  const [products, setProducts] = useState<ProductTest[]>([]);
  const [newProduct, setNewProduct] = useState({
    id: '',
    type: '',
    varieties: '',
    kg_price: '',
    euro_price: '',
  });
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/productsTest');
      const data = await response.json();
      setProducts(data);
    } catch {
      console.error('Erreur serveur');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateProduct = async () => {
    setError('');
    try {
      const response = await fetch('http://localhost:8000/productsTest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: parseInt(newProduct.id),
          type: newProduct.type,
          varieties: newProduct.varieties,
          kg_price: parseFloat(newProduct.kg_price),
          euro_price: parseFloat(newProduct.euro_price),
        }),
      });

      if (response.ok) {
        await fetchProducts();
        setNewProduct({ id: '', type: '', varieties: '', kg_price: '', euro_price: '' });
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Erreur');
      }
    } catch {
      setError('Erreur serveur');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className='p-5'>
      <h2>Liste des produits (ProductTest)</h2>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <strong>{product.type}</strong> - {product.varieties} | {product.kg_price} €/kg | {product.euro_price} €
          </li>
        ))}
      </ul>

      <h3 className='mt-4'>Ajouter un produit</h3>
      <div className='p-fluid grid formgrid gap-2'>
        <input
          type="text"
          name="id"
          placeholder="ID"
          value={newProduct.id}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="type"
          placeholder="Type"
          value={newProduct.type}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="varieties"
          placeholder="Variétés"
          value={newProduct.varieties}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="kg_price"
          placeholder="Prix au kg"
          value={newProduct.kg_price}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="euro_price"
          placeholder="Prix en euro"
          value={newProduct.euro_price}
          onChange={handleInputChange}
        />
        <button onClick={handleCreateProduct}>Ajouter</button>
      </div>

      {error && (
        <div className="mt-3 text-red-600 font-semibold">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

export default ProductTest;
