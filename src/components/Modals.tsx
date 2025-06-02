import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import React, { useEffect, useState } from 'react';

// Modal d'ajout au panier

type ModalProps = {
  visible: boolean;
  onHide: () => void;
  title: string;
  imageUrl: string;
  stock?: number;
  price: number;
  unitWeight: number;
  onConfirm: (quantity: number) => void;
};

const Modal: React.FC<ModalProps> = ({
  visible, onHide, title, imageUrl, stock, price, onConfirm, unitWeight
}) => {
  const [unitQty, setUnitQty] = useState<number>(1);
  const maxStock = stock ?? Infinity;

  const totalKg = unitQty * unitWeight;
  const totalPrice = totalKg * price;

  useEffect(() => {
    if (visible) setUnitQty(1);
  }, [visible]);

  const handleQtyChange = (value: number | null) => {
    if (typeof value === 'number') {
      const validated = Math.min(maxStock, Math.max(1, Math.round(value)));
      setUnitQty(validated);
    }
  };

  const handleKgChange = (value: number | null) => {
    if (typeof value === 'number') {
      const estimatedUnits = Math.ceil(value / unitWeight);
      handleQtyChange(estimatedUnits);
    }
  };

  const handleConfirm = () => {
    onConfirm(unitQty);
    onHide();
  };

  return (
    <Dialog
      header="Ajouter au panier"
      visible={visible}
      style={{ width: '500px' }}
      onHide={onHide}
      modal
    >
      <div className="flex flex-column align-items-center gap-3 p-2">
        <img
          src={imageUrl}
          alt={title}
          style={{ width: '120px', height: '120px', objectFit: 'contain' }}
        />
        <h3 className="m-0 text-center">{title}</h3>

        <div className="text-sm text-center">
          <p className="my-1">Prix au kg : <strong>{price.toFixed(2)} €</strong></p>
          <p className="my-1">Poids unitaire : <strong>{unitWeight.toFixed(2)} kg</strong></p>
          {stock !== undefined && (
            <p className="my-1">Stock disponible : <strong>{stock} unité(s)</strong></p>
          )}
        </div>

        <div className="w-full mt-2">
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Choisir par unité(s)</label>
            <InputNumber
              value={unitQty}
              onValueChange={(e) => handleQtyChange(e.value)}
              showButtons
              min={1}
              max={maxStock}
              inputStyle={{ width: '4rem', textAlign: 'center' }}
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Ou saisir le poids total (kg)</label>
            <InputNumber
              value={parseFloat((unitQty * unitWeight).toFixed(2))}
              onValueChange={(e) => handleKgChange(e.value)}
              min={unitWeight}
              max={unitWeight * maxStock}
              step={0.1}
              inputStyle={{ width: '6rem', textAlign: 'center' }}
            />
          </div>
        </div>

        <div className="text-center text-sm my-2">
          <p className="my-1">Poids total : <strong>{totalKg.toFixed(2)} kg</strong></p>
          <p className="my-1">Prix total : <strong>{totalPrice.toFixed(2)} €</strong></p>
        </div>

        <Button
          label="Confirmer"
          icon="pi pi-check"
          onClick={handleConfirm}
          className="p-button-sm"
        />
      </div>
    </Dialog>
  );
};

export default Modal;
