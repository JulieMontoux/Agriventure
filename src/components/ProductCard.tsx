import { Button } from 'primereact/button';

// composant card des produits page acceuil

type ProductCardProps = {
  type: string;
  title: string;
  imageUrl: string;
  kgPrice: number;
  unitPrice: number;
  unitWeight: number;
  stock?: number;
  onAddClick: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
  type,
  title,
  imageUrl,
  kgPrice,
  unitPrice,
  unitWeight,
  stock,
  onAddClick
}) => {
  return (
    <div className="relative p-3 border-round-lg shadow-2" style={{ backgroundColor: '#2B2E3D', color: 'white' }}>
      <div className="absolute top-0 right-0 m-2">
        <Button icon="pi pi-plus" className="p-button-rounded p-button-text p-button-sm" onClick={onAddClick} />
      </div>

      <div className="flex justify-content-center align-items-center mb-3" style={{ height: '180px' }}>
        <img
          src={imageUrl}
          alt={title}
          style={{ objectFit: 'contain', width: '150px', height: '150px' }}
        />
      </div>

      <div className="text-center text-sm">
        <h4 className="m-0 text-white font-bold">{type}</h4>
        <p className="m-0 text-gray-300">{title}</p>

        <p className="m-0 mt-2 text-green-400 font-semibold">{kgPrice.toFixed(2)} € / kg</p>
        <p className="m-0 text-blue-300">{unitPrice.toFixed(2)} € / unité</p>
        <p className="m-0 text-gray-300">Poids unitaire : {unitWeight.toFixed(2)} kg</p>

        {stock !== undefined && (
          <p className="m-0 text-yellow-400">{stock} en stock</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
