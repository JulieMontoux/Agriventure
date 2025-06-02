import React, { useEffect, useRef, useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { useCart } from '../contexts/CartContext';
import { getUsername } from '../utils/auth';


// composant pour le panier

interface Product {
  id: number;
  title: string;
  quantity: number;
  type: string;
  varieties: string;
}

export default function Cart() {
  const [visible, setVisible] = useState(false);
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const [paymentType, setPaymentType] = useState<'CB' | 'ESPECE' | 'CHEQUE' | null>(null);
  const [note, setNote] = useState('');
  const [sellerName, setSellerName] = useState<string>('');
  const toast = useRef<Toast>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const name = getUsername();
    if (name) setSellerName(name);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.unitWeight * item.quantity, 0);
  const totalWeight = cart.reduce((sum, item) => sum + item.unitWeight * item.quantity, 0);

  const handleOrder = async () => {
    try {
      const order = {
        products_ordered: cart.map(p => `${p.title} x${p.quantity}`).join(', '),
        quantity: cart.reduce((sum, item) => sum + item.quantity, 0),
        total_weight: totalWeight,
        order_type: paymentType,
        total_price: total,
        ordered_by: sellerName,
      };

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(order),
      });

      const data = await res.json();

      for (const item of cart) {
        const productRes = await fetch(`http://localhost:8000/productsTest/`);
        const products: Product[] = await productRes.json();
        const product = products.find((p) => p.id === item.id);

        if (!product) {
          console.warn(`Produit ${item.id} introuvable`);
          continue;
        }

        const newQuantity = product.quantity - item.quantity;
        if (newQuantity < 0) {
          console.warn(`Stock insuffisant pour le produit ${product.type} ${product.varieties}`);
          continue;
        }

        await fetch(`http://localhost:8000/productsTest/${item.id}/quantity`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newQuantity),
        });
      }

      clearCart();
      setNote('');
      setPaymentType(null);
      setVisible(false);

      audioRef.current?.play();

      toast.current?.show({
        severity: 'success',
        summary: 'Commande réussie',
        detail: `Commande #${data.id} effectuée avec succès`,
        life: 3000,
      });

    } catch (err) {
      console.error("Erreur lors de la commande :", err);
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: "Erreur lors de la commande.",
        life: 3000,
      });
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <audio ref={audioRef} src="/sounds/success.mp3" preload="auto" />
      <Button icon="pi pi-shopping-cart" className="p-button-rounded p-button-secondary shadow-2"
        style={{ position: 'fixed', bottom: '1rem', left: '1rem', zIndex: 1100 }}
        onClick={() => setVisible(true)} />

      <Sidebar visible={visible} position="right" onHide={() => setVisible(false)} style={{ width: '350px' }} className="p-sidebar-sm">
        <h3 className="mb-3 text-white">Mon panier</h3>
        <Divider />

        <div className="mb-3">
          <p className="text-white font-bold mb-2">Type de paiement :</p>
          {['CB', 'ESPECE', 'CHEQUE'].map(type => (
            <Button
              key={type}
              label={type}
              className={`mr-2 mb-2 ${paymentType === type ? 'p-button-success' : 'p-button-outlined p-button-secondary'}`}
              onClick={() => setPaymentType(type as 'CB' | 'ESPECE' | 'CHEQUE')}
            />
          ))}
        </div>

        <div className="mb-3">
          <p className="text-white font-bold mb-2">Vendeur :</p>
          <p className="text-white bg-gray-900 px-2 py-1 rounded">{sellerName}</p>
        </div>

        <div className="mb-3">
          <p className="text-white font-bold mb-2">Note :</p>
          <InputTextarea rows={3} className="w-full" value={note} onChange={e => setNote(e.target.value)} placeholder="Ajouter une remarque..." />
        </div>

        <Divider />

        {cart.length === 0 ? (
          <p className="text-gray-400">Votre panier est vide</p>
        ) : (
          cart.map(item => {
            const totalKg = item.unitWeight * item.quantity;
            const totalPrice = item.price * totalKg;

            return (
              <div key={item.id} className="mb-3 text-white">
                <div className="flex justify-content-between align-items-center">
                  <div>
                    <strong>{item.title}</strong>
                    <p className="m-0 text-sm">
                      {item.quantity} unité(s) × {item.unitWeight.toFixed(2)} kg = {totalKg.toFixed(2)} kg
                    </p>
                    <p className="m-0 text-sm">
                      {item.price.toFixed(2)} €/kg → <strong>{totalPrice.toFixed(2)} €</strong>
                    </p>
                  </div>
                  <div className="flex gap-2 align-items-center">
                    <Button icon="pi pi-minus" className="p-button-rounded p-button-sm p-button-text" onClick={() => updateQuantity(item.id, -1)} />
                    <span>{item.quantity}</span>
                    <Button icon="pi pi-plus" className="p-button-rounded p-button-sm p-button-text" onClick={() => updateQuantity(item.id, 1)} />
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-sm p-button-danger p-button-text" onClick={() => removeFromCart(item.id)} />
                  </div>
                </div>
              </div>
            );
          })
        )}

        <Divider />
        <div className="flex justify-content-between align-items-center mt-3 text-white">
          <span className="font-bold">Total :</span>
          <span>{total.toFixed(2)} €</span>
        </div>

        <Button
          label="Commander"
          className="mt-4 w-full"
          icon="pi pi-check"
          disabled={cart.length === 0 || !paymentType}
          onClick={handleOrder}
        />

        <Button label="Vider" className="mt-2 w-full p-button-secondary" icon="pi pi-trash" onClick={clearCart} disabled={cart.length === 0} />
      </Sidebar>
    </>
  );
}
