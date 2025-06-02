import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import axios from 'axios';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';


// PAGE (composant) POUR LA GENERATION DE PDF (Frontend)

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333333',
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555555',
    fontWeight: 'bold',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    borderTopStyle: 'solid',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#666666',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    borderBottomStyle: 'solid',
    alignItems: 'center',
  },
  tableRowHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    borderBottomStyle: 'solid',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  tableCol: {
    width: '20%',
    padding: 5,
  },
  tableColWide: {
    width: '30%',
    padding: 5,
  },
  tableColNarrow: {
    width: '10%',
    padding: 5,
  },
  tableCell: {
    fontSize: 10,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    borderTopWidth: 2,
    borderTopColor: '#333333',
    borderTopStyle: 'solid',
    padding: 5,
  },
  totalText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  summarySection: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 5,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
    width: '70%',
  },
  summaryValue: {
    fontSize: 12,
    width: '30%',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    textAlign: 'center',
    color: '#999999',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    borderTopStyle: 'solid',
    paddingTop: 10,
  },
});

interface Order {
  id: number;
  products_ordered: string;
  quantity: number;
  order_type: string;
  total_price: number;
  ordered_by: string;
  ordered_at: string;
  displayId?: string;
}

interface Product {
  id: number;
  type: string;
  varieties: string;
  kg_price: number;
  euro_price: number;
  unit_weight: number;
}

const AccountingPDF = ({ orders, products, date }: { orders: Order[]; products: Product[]; date: Date }) => {
  const totalSales = orders.reduce((sum, order) => sum + order.total_price, 0);

  const formattedDate = date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const parseOrderedProducts = (order: Order) => {
    return order.products_ordered.split(',').map((item) => {
      const [name, qtyStr] = item.trim().split(' x');
      const quantity = parseInt(qtyStr || '1', 10);
      return { name: name.trim(), quantity };
    });
  };

  const groupedByType: {
    [type: string]: {
      totalWeight: number;
      totalSales: number;
      orders: {
        product: string;
        quantity: number;
        price: number;
        orderId: string;
      }[];
    };
  } = {};

  orders.forEach((order) => {
    const parsedProducts = parseOrderedProducts(order);
    parsedProducts.forEach(({ name, quantity }) => {
      const matchedProduct = products.find((p) => p.varieties.toLowerCase() === name.toLowerCase());
      if (matchedProduct) {
        const { type, unit_weight, euro_price } = matchedProduct;
        const typeGroup = groupedByType[type] || {
          totalWeight: 0,
          totalSales: 0,
          orders: [],
        };

        const weight = quantity * unit_weight;
        const sales = quantity * euro_price;

        typeGroup.totalWeight += weight;
        typeGroup.totalSales += sales;
        typeGroup.orders.push({
          product: name,
          quantity,
          price: euro_price,
          orderId: order.displayId || order.id.toString(),
        });

        groupedByType[type] = typeGroup;
      }
    });
  });
  

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Rapport journalier</Text>
        <Text style={styles.dateText}>Date: {formattedDate}</Text>

        {/* Commandes brutes */}
        <View style={styles.section}>
          <Text style={styles.subheader}>Commandes totales</Text>
          {orders.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.tableRowHeader}>
                <View style={styles.tableColNarrow}><Text style={styles.tableCellHeader}>ID</Text></View>
                <View style={styles.tableColWide}><Text style={styles.tableCellHeader}>Produits</Text></View>
                <View style={styles.tableColNarrow}><Text style={styles.tableCellHeader}>Qté</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Type</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Prix (€)</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Client</Text></View>
              </View>
              {orders.map((order) => (
                <View key={order.id} style={styles.tableRow}>
                  <View style={styles.tableColNarrow}><Text style={styles.tableCell}>{order.displayId || order.id}</Text></View>
                  <View style={styles.tableColWide}><Text style={styles.tableCell}>{order.products_ordered}</Text></View>
                  <View style={styles.tableColNarrow}><Text style={styles.tableCell}>{order.quantity}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{order.order_type}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{order.total_price.toFixed(2)}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{order.ordered_by}</Text></View>
                </View>
              ))}
              <View style={styles.totalRow}>
                <View style={styles.tableColNarrow} />
                <View style={styles.tableColWide}><Text style={styles.totalText}>Total</Text></View>
                <View style={styles.tableColNarrow} />
                <View style={styles.tableCol} />
                <View style={styles.tableCol}><Text style={styles.totalText}>{totalSales.toFixed(2)}</Text></View>
                <View style={styles.tableCol} />
              </View>
            </View>
          ) : (
            <Text style={styles.text}>Aucune commande enregistrée.</Text>
          )}
        </View>

        {/* Commandes par type */}
        <View style={styles.section}>
          <Text style={styles.subheader}>Commandes par type de produit</Text>
          {Object.entries(groupedByType).map(([type, data]) => (
            <View key={type} wrap={false} style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 12, marginBottom: 5 }}>Type de produit : <Text style={{ fontWeight: 'bold' }}>{type}</Text></Text>
              <View style={styles.table}>
                <View style={styles.tableRowHeader}>
                  <View style={styles.tableColNarrow}><Text style={styles.tableCellHeader}>Commande</Text></View>
                  <View style={styles.tableColWide}><Text style={styles.tableCellHeader}>Produit</Text></View>
                  <View style={styles.tableColNarrow}><Text style={styles.tableCellHeader}>Qté</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Prix (€)</Text></View>
                </View>
                {data.orders.map((entry, idx) => (
                  <View key={idx} style={styles.tableRow}>
                    <View style={styles.tableColNarrow}><Text style={styles.tableCell}>{entry.orderId}</Text></View>
                    <View style={styles.tableColWide}><Text style={styles.tableCell}>{entry.product}</Text></View>
                    <View style={styles.tableColNarrow}><Text style={styles.tableCell}>{entry.quantity}</Text></View>
                    <View style={styles.tableCol}><Text style={styles.tableCell}>{(entry.price * entry.quantity).toFixed(2)}</Text></View>
                  </View>
                ))}
                <View style={styles.totalRow}>
                  <Text style={styles.totalText}>
                    Total poids vendu: {data.totalWeight.toFixed(2)} kg — CA: {data.totalSales.toFixed(2)} €
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Produits */}
        <View style={styles.section}>
          <Text style={styles.subheader}>Produits</Text>
          {products.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.tableRowHeader}>
                <View style={styles.tableColNarrow}><Text style={styles.tableCellHeader}>ID</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Type</Text></View>
                <View style={styles.tableColWide}><Text style={styles.tableCellHeader}>Variété</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Prix/kg (€)</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Prix (€)</Text></View>
              </View>
              {products.map((product) => (
                <View key={product.id} style={styles.tableRow}>
                  <View style={styles.tableColNarrow}><Text style={styles.tableCell}>{product.id}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{product.type}</Text></View>
                  <View style={styles.tableColWide}><Text style={styles.tableCell}>{product.varieties}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{product.kg_price.toFixed(2)}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{product.euro_price.toFixed(2)}</Text></View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.text}>Aucun produit enregistré.</Text>
          )}
        </View>

        {/* Résumé Financier */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Résumé Financier</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total des ventes</Text>
            <Text style={styles.summaryValue}>{totalSales.toFixed(2)} €</Text>
          </View>
          {Object.entries(groupedByType).map(([type, data]) => (
            <View style={styles.summaryRow} key={type}>
              <Text style={styles.summaryLabel}>→ {type} : {data.totalWeight.toFixed(2)} kg</Text>
              <Text style={styles.summaryValue}>{data.totalSales.toFixed(2)} €</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>Rapport généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}</Text>
      </Page>
    </Document>

  );
};

const AccountingReport: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true);
  const [showPdfViewer, setShowPdfViewer] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await axios.get('http://localhost:8000/orders/');
        setOrders(ordersResponse.data);
        const productsResponse = await axios.get('http://localhost:8000/productsTest/');
        setProducts(productsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDate]);

  const togglePdfViewer = () => {
    setShowPdfViewer(!showPdfViewer);
  };

  const dayCode = `${String(selectedDate.getDate()).padStart(2, '0')}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
  const startOfDay = new Date(selectedDate); startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(selectedDate); endOfDay.setHours(23, 59, 59, 999);

  const filteredOrders = orders
    .filter((order) => {
      const orderDate = new Date(order.ordered_at);
      return orderDate >= startOfDay && orderDate <= endOfDay;
    })
    .sort((a, b) => new Date(a.ordered_at).getTime() - new Date(b.ordered_at).getTime())
    .map((order, index) => ({
      ...order,
      displayId: `#${dayCode}-${index}`,
    }));

  return (
    <div className="accounting-report">
      <Card title="Rapport Comptable" className="mb-4">
        <div className="p-fluid">
          <div className="p-field mb-3">
            <label htmlFor="date">Date du rapport</label>
            <Calendar
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.value as Date)}
              showIcon
              dateFormat="dd/mm/yy"
              className="mt-2"
            />
          </div>

          {loading ? (
            <div className="p-text-center">
              <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
              <p>Chargement des données...</p>
            </div>
          ) : (
            <div className="p-d-flex p-flex-column">
              <Button
                label={showPdfViewer ? "Masquer l'aperçu" : "Afficher l'aperçu"}
                icon={showPdfViewer ? "pi pi-eye-slash" : "pi pi-eye"}
                onClick={togglePdfViewer}
                className="mb-2"
              />

              <PDFDownloadLink
                document={<AccountingPDF orders={filteredOrders} products={products} date={selectedDate} />}
                fileName={`rapport_comptable_${selectedDate.toISOString().split('T')[0]}.pdf`}
                style={{ textDecoration: 'none' }}
              >
                {({ loading }) => (
                  <Button
                    label={loading ? "Génération en cours..." : "Télécharger le PDF"}
                    icon="pi pi-download"
                    className="p-button-success mt-2"
                    disabled={loading}
                  />
                )}
              </PDFDownloadLink>

              {showPdfViewer && (
                <div style={{ height: '500px', marginTop: '20px', border: '1px solid #ddd' }}>
                  <PDFViewer style={{ width: '100%', height: '100%' }}>
                    <AccountingPDF orders={filteredOrders} products={products} date={selectedDate} />
                  </PDFViewer>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AccountingReport;