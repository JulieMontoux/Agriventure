import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { ScrollTop } from 'primereact/scrolltop';

import SidebarTest from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import ProfileImageButton from '../components/ProfileImageButton';
import CategoryTabs from '../components/CategoryTabs';
import Cart from '../components/Cart';
import Modal from '../components/Modals';
import { useCart } from '../contexts/CartContext';

import { isAuthenticated, getUsername } from '../utils/auth';
import axios from 'axios';

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

// page accueil

interface Product {
  id: number;
  type: string;
  varieties: string;
  kg_price: number;
  euro_price: number;
  img_path: string | null;
  quantity: number;
  unit_weight: number;
  category: string;
}

function LandingPage() {
  const toast = useRef<Toast | null>(null);
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      setUsername(getUsername());
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<Product[]>("http://localhost:8000/productsTest/");
        setProducts(res.data);
      } catch (error) {
        console.error("Erreur chargement produits :", error);
      }
    };
    fetchProducts();
  }, []);

  const openModal = (product: Product) => {
    setModalProduct(product);
    setModalVisible(true);
  };

  const handleConfirmQuantity = (quantity: number) => {
    if (!modalProduct) return;

    addToCart({
      id: modalProduct.id,
      title: modalProduct.varieties,
      price: modalProduct.kg_price,
      imageUrl: modalProduct.img_path ? `/${modalProduct.img_path.replace(/^src\//, '')}` : '/default.png',
      unitWeight: modalProduct.unit_weight,
    }, quantity);

    toast.current?.show({
      severity: 'success',
      summary: 'Ajouté au panier',
      detail: `${modalProduct.varieties} x${quantity} ajouté(s) au panier`,
      life: 2000,
    });

    setModalVisible(false);
  };

  const filteredProducts = products
    .filter(p => p.quantity > 0) // 
    .filter((p) => {
      const matchesSearch =
        p.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.varieties.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        selectedFilter === 'all' ||
        p.category.toLowerCase() === selectedFilter.toLowerCase() ||
        p.type.toLowerCase() === selectedFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });

  return (
    <div>
      <ScrollTop />
      <Cart />

      <div className="flex align-items-center justify-content-between px-3 py-2">
        <SidebarTest />
        <div className="flex justify-content-center flex-1" />
        <div className="flex align-items-center gap-2">
          {username && (
            <span className="text-white font-medium mr-2">
              Connecté en tant que {username}
            </span>
          )}
          <ProfileImageButton
            imageUrl="https://i.pravatar.cc/300"
            onClick={() => console.log('METTRE REDIRECTION ICI')}
          />
        </div>
      </div>

      {/* Filtres  */}
      <div className="flex flex-column md:flex-row px-3">
        {/* Categories */}
        <div className="">
          <CategoryTabs
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            allProducts={products}
            showOnlyCategory
          />
          {/* Les types */}
          <CategoryTabs
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
              allProducts={products}
              showOnlyType
          />
        </div>

        

      </div>
          
          {/* barre de recherche */}
          <div className="flex-1">
          <div className="flex flex-column align-items-center gap-3 mt-3">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-inputtext-sm p-inputtext w-full sm:w-20rem text-center"
              style={{ maxWidth: '300px' }}
            />


          </div>
        </div>

      <Toast ref={toast} />

      <Modal
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
        title={modalProduct?.varieties ?? ''}
        imageUrl={modalProduct?.img_path ? `/${modalProduct.img_path.replace(/^src\//, '')}` : '/default.png'}
        stock={modalProduct?.quantity}
        price={modalProduct?.kg_price || modalProduct?.euro_price || 0}
        unitWeight={modalProduct?.unit_weight ?? 1}
        onConfirm={handleConfirmQuantity}
      />

      <div className="flex">
        <div className="flex-1">
          <div className="p-4">
            <div className="grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="col-12 sm:col-6 md:col-4 lg:col-3 p-2">
                  <ProductCard
                    type={product.type}
                    title={product.varieties}
                    imageUrl={
                      product.img_path
                        ? `/${product.img_path.replace(/^src\//, '')}`
                        : '/default.png'
                    }
                    kgPrice={product.kg_price}
                    unitPrice={product.euro_price}
                    unitWeight={product.unit_weight}
                    stock={product.quantity}
                    onAddClick={() => openModal(product)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
