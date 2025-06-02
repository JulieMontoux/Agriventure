from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch, cm
import datetime
import os
from sqlalchemy.orm import Session
from typing import List, Dict, Any

class DailyReportPDF:
    
    def __init__(self):
        self.report_dir = os.path.join(os.getcwd(), "reports")
        if not os.path.exists(self.report_dir):
            os.makedirs(self.report_dir)
            
        self.styles = getSampleStyleSheet()
        self.styles.add(ParagraphStyle(
            name='Center',
            parent=self.styles['Heading1'],
            alignment=1,
        ))
        
    def generate(self, db: Session, date: datetime.date = None) -> str:
        if date is None:
            date = datetime.date.today()
            
        filename = f"rapport_comptable_{date.strftime('%Y-%m-%d')}.pdf"
        pdf_path = os.path.join(self.report_dir, filename)
        
        doc = SimpleDocTemplate(
            pdf_path, 
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        elements = []
        
        self._add_header(elements, date)
    
        orders = self._get_orders_data(db, date)
        self._add_orders_section(elements, orders)
        
        products = self._get_products_data(db)
        self._add_products_section(elements, products)
        
        self._add_financial_summary(elements, orders)
    
        doc.build(elements)
        
        return pdf_path
    
    def _add_header(self, elements: List, date: datetime.date):

        title = Paragraph(f"Rapport Comptable", self.styles['Center'])
        elements.append(title)
        
        date_str = Paragraph(
            f"<i>Date: {date.strftime('%d/%m/%Y')}</i>", 
            self.styles['Normal']
        )
        elements.append(date_str)
        
        elements.append(Spacer(1, 0.5*cm))
    
    def _get_orders_data(self, db: Session, date: datetime.date) -> List[Dict[str, Any]]:

        orders = db.query(Orders).all()
        
        return [
            {
                "id": order.id,
                "products": order.products_ordered,
                "quantity": order.quantity,
                "type": order.order_type,
                "price": order.total_price,
                "client": order.ordered_by
            }
            for order in orders
        ]
    
    def _get_products_data(self, db: Session) -> List[Dict[str, Any]]:
        """Récupère les données des produits"""
        products = db.query(ProductTest).all()
        
        return [
            {
                "id": product.id,
                "type": product.type,
                "variety": product.varieties,
                "kg_price": product.kg_price,
                "euro_price": product.euro_price
            }
            for product in products
        ]
    
    def _add_orders_section(self, elements: List, orders: List[Dict[str, Any]]):
        """Ajoute la section des commandes au rapport"""
        elements.append(Paragraph("Commandes", self.styles['Heading2']))
        elements.append(Spacer(1, 0.3*cm))
        
        if not orders:
            elements.append(Paragraph("Aucune commande enregistrée.", self.styles['Normal']))
            return
        
        table_data = [
            ["ID", "Produits", "Quantité", "Type", "Prix (€)", "Client"]
        ]
        
        for order in orders:
            table_data.append([
                str(order["id"]),
                order["products"],
                str(order["quantity"]),
                order["type"],
                f"{order['price']:.2f}",
                order["client"]
            ])
        
        total_amount = sum(order["price"] for order in orders)
        table_data.append(
            ["Total", "", "", "", f"{total_amount:.2f}", ""]
        )
        
        table = Table(table_data, colWidths=[0.7*cm, 4*cm, 1.5*cm, 2*cm, 2*cm, 3*cm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        
            ('BACKGROUND', (0, 1), (-1, -2), colors.white),
            ('ALIGN', (0, 1), (0, -1), 'CENTER'), 
            ('ALIGN', (2, 1), (2, -1), 'CENTER'), 
            ('ALIGN', (4, 1), (4, -1), 'RIGHT'), 
            
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('LINEABOVE', (0, -1), (-1, -1), 1, colors.black),
            
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black)
        ]))
        
        elements.append(table)
        elements.append(Spacer(1, 0.5*cm))
    
    def _add_products_section(self, elements: List, products: List[Dict[str, Any]]):
        elements.append(Paragraph("Produits", self.styles['Heading2']))
        elements.append(Spacer(1, 0.3*cm))
        
        if not products:
            elements.append(Paragraph("Aucun produit enregistré.", self.styles['Normal']))
            return
        
        table_data = [
            ["ID", "Type", "Variété", "Prix/kg (€)", "Prix (€)"]
        ]
        
        for product in products:
            table_data.append([
                str(product["id"]),
                product["type"],
                product["variety"],
                f"{product['kg_price']:.2f}",
                f"{product['euro_price']:.2f}"
            ])
        
        table = Table(table_data, colWidths=[0.7*cm, 3*cm, 4*cm, 2.5*cm, 2.5*cm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            
            ('BACKGROUND', (0, 1), (-1, -1), colors.white),
            ('ALIGN', (0, 1), (0, -1), 'CENTER'),
            ('ALIGN', (3, 1), (4, -1), 'RIGHT'), 
            
            # Bordures
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black)
        ]))
        
        elements.append(table)
        elements.append(Spacer(1, 0.5*cm))
    
    def _add_financial_summary(self, elements: List, orders: List[Dict[str, Any]]):
        elements.append(Paragraph("Résumé Financier", self.styles['Heading2']))
        elements.append(Spacer(1, 0.3*cm))
        
        #calcul des totaux
        total_revenue = sum(order["price"] for order in orders)
        
        total_expenses = 0 
        
        #calcul du profit
        profit = total_revenue - total_expenses
        
        table_data = [
            ["Description", "Montant (€)"],
            ["Total des Ventes", f"{total_revenue:.2f}"],
            ["Total des Achats", f"{total_expenses:.2f}"],
            ["Profit", f"{profit:.2f}"]
        ]
        
        table = Table(table_data, colWidths=[8*cm, 4*cm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -2), colors.white),
            ('ALIGN', (1, 1), (1, -1), 'RIGHT'),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('LINEABOVE', (0, -1), (-1, -1), 1, colors.black),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black)
        ]))
        
        elements.append(table)