import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/adminPanel.css';

// page dashboard administrateur

interface Order {
  id: number;
  products_ordered: string;
  quantity: number;
  order_type: string;
  total_price: number;
  ordered_by: string;
  ordered_at: string;
  total_weight: number; 
  displayId?: string;
}

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [receiptDialogVisible, setReceiptDialogVisible] = useState<boolean>(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0
  });
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [globalFilter, setGlobalFilter] = useState<string>('');

  const toast = useRef<Toast>(null);

  useEffect(() => {
    setDateFilter(new Date());
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [dateFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/orders/');
      if (!response.ok) throw new Error('Échec du fetch');

      const data: Order[] = await response.json();

      data.sort((a, b) => new Date(b.ordered_at).getTime() - new Date(a.ordered_at).getTime());

      const filtered = dateFilter
        ? data.filter(order => {
            const orderDate = new Date(order.ordered_at);
            return (
              orderDate.getFullYear() === dateFilter.getFullYear() &&
              orderDate.getMonth() === dateFilter.getMonth() &&
              orderDate.getDate() === dateFilter.getDate()
            );
          })
        : data;

      const dayCode = dateFilter
        ? `${String(dateFilter.getDate()).padStart(2, '0')}-${String(dateFilter.getMonth() + 1).padStart(2, '0')}`
        : '';

      const finalOrders = filtered
        .slice()
        .reverse()
        .map((order, index) => ({
          ...order,
          displayId: dateFilter ? `#${dayCode}-${index}` : `#${order.id}`
        }))
        .reverse();

      setOrders(finalOrders);
      setAllOrders(finalOrders);

      const total = finalOrders.reduce((sum, order) => sum + order.total_price, 0);
      setStats({
        totalSales: total,
        totalOrders: finalOrders.length,
        averageOrderValue: finalOrders.length ? total / finalOrders.length : 0
      });
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de charger les commandes'
      });
    } finally {
      setLoading(false);
    }
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilter(value);

    if (!value) {
      setOrders(allOrders);
    } else {
      const lower = value.toLowerCase();
      setOrders(
        allOrders.filter(o =>
          `${o.displayId} ${o.ordered_by} ${o.products_ordered} ${o.order_type}`
            .toLowerCase()
            .includes(lower)
        )
      );
    }
  };

  const redirectToReport = () => {
    navigate('/comptabilite');
  };

  const redirectToLanding = () => {
    navigate('/landing-page');
  };

  const viewReceipt = (order: Order) => {
    setSelectedOrder(order);
    setReceiptDialogVisible(true);
  };

  const actionTemplate = (rowData: Order) => (
    <div className="action-buttons">
      <Button
        icon="pi pi-eye"
        className="p-button-rounded p-button-text"
        onClick={() => viewReceipt(rowData)}
        tooltip="Voir le reçu"
      />
      <Button
        icon="pi pi-file-pdf"
        className="p-button-rounded p-button-text p-button-success"
        onClick={redirectToReport}
        tooltip="Voir rapport comptable"
      />
    </div>
  );

  const StatCard = ({ title, value, icon }: { title: string, value: string | number, icon: string }) => (
    <Card className="stat-card">
      <div className="stat-content">
        <div className="stat-icon">
          <i className={`pi ${icon}`}></i>
        </div>
        <div className="stat-info">
          <span className="stat-title">{title}</span>
          <span className="stat-value">{value}</span>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="admin-panel">
      <Toast ref={toast} />

      <div className="admin-header">
        <div>
          <Button
            label="Retour accueil"
            icon="pi pi-arrow-left"
            className="p-button-text mb-5"
            onClick={redirectToLanding}
          />
          <h1>Panel administrateur</h1>
        </div>
        <div className="user-profile">
          <Avatar label={user?.username?.charAt(0) || 'A'} shape="circle" />
        </div>
      </div>

      <div className="stats-container">
        <StatCard title="Ventes totales" value={`${stats.totalSales.toFixed(2)} €`} icon="pi-euro" />
        <StatCard title="Commandes" value={stats.totalOrders} icon="pi-shopping-cart" />
        <StatCard title="Panier moyen" value={`${stats.averageOrderValue.toFixed(2)} €`} icon="pi-chart-bar" />
      </div>

      <div className="orders-section">
        <div className="orders-header flex justify-content-between align-items-center mb-3">
          <h2>Vos commandes</h2>
          <Button icon="pi pi-refresh" className="p-button-text" onClick={fetchOrders} loading={loading} />
        </div>

        <div className="flex flex-wrap gap-3 mb-3">
          <span className="p-input-icon-left">
            <InputText
              placeholder="Rechercher..."
              value={globalFilter}
              onChange={onGlobalFilterChange}
              className="p-inputtext-sm"
            />
          </span>

          <span className="flex align-items-center gap-2">
            <label htmlFor="dateFilter" className="text-white font-semibold">Date :</label>
            <Calendar
              id="dateFilter"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.value as Date | null)}
              dateFormat="dd/mm/yy"
              placeholder="Toutes"
              showIcon
              className="p-inputtext-sm"
            />
            <Button
              label="Réinitialiser"
              icon="pi pi-times"
              className="p-button-text p-button-sm"
              onClick={() => setDateFilter(null)}
              disabled={!dateFilter}
            />
          </span>
        </div>

        <DataTable
          value={orders}
          paginator
          rows={10}
          loading={loading}
          emptyMessage="Aucune commande trouvée"
          className="orders-table"
          rowHover
          responsiveLayout="scroll"
          sortField="ordered_at"
          sortOrder={-1}
        >
          <Column field="displayId" header="ID commande" sortable />
          <Column field="ordered_by" header="Vendeur" sortable />
          <Column field="products_ordered" header="Produits" sortable />
          <Column field="quantity" header="Quantité" sortable />
          <Column
            field="total_weight"
            header="Poids total"
            body={(rowData) => `${rowData.total_weight.toFixed(2)} kg`}
            sortable
          />
          <Column
            field="total_price"
            header="Total"
            body={(rowData) => `${rowData.total_price.toFixed(2)} €`}
            sortable
          />
          <Column field="order_type" header="Paiement" sortable />
          <Column
            field="ordered_at"
            header="Date"
            body={(rowData) => new Date(rowData.ordered_at).toLocaleString('fr-FR')}
            sortable
          />
          <Column body={actionTemplate} header="Actions" style={{ width: '10rem' }} />
        </DataTable>
      </div>

      <Dialog
        header="Détail de la commande"
        visible={receiptDialogVisible}
        style={{ width: '50vw' }}
        onHide={() => setReceiptDialogVisible(false)}
        modal
        footer={
          <div>
            <Button label="Fermer" icon="pi pi-times" onClick={() => setReceiptDialogVisible(false)} className="p-button-text" />
            <Button label="Voir rapport" icon="pi pi-file-pdf" onClick={redirectToReport} className="p-button-success" />
          </div>
        }
      >
        {selectedOrder && (
          <div className="receipt-preview">
            <h3>Reçu de commande {selectedOrder.displayId}</h3>
            <p><strong>Vendeur:</strong> {selectedOrder.ordered_by}</p>
            <p><strong>Produits:</strong> {selectedOrder.products_ordered}</p>
            <p><strong>Quantité:</strong> {selectedOrder.quantity}</p>
            <p><strong>Poids total:</strong> {selectedOrder.total_weight.toFixed(2)} kg</p>
            <p><strong>Montant total:</strong> {selectedOrder.total_price.toFixed(2)} €</p>
            <p><strong>Paiement:</strong> {selectedOrder.order_type}</p>
            <p><strong>Date:</strong> {new Date(selectedOrder.ordered_at).toLocaleString('fr-FR')}</p>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default AdminPanel;
