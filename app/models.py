from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float
from sqlalchemy.orm import relationship
from sqlalchemy import DateTime, Date
from datetime import datetime

from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer,primary_key=True,index=True)
    username = Column(String(255),index=True)
    hashed_password = Column(String(255), nullable=False, index=True)
    role = Column(String(255), nullable=False, index=True)

class ProductTest(Base):
    __tablename__ = "productstest"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(255), nullable=False, index=True)
    varieties = Column(String(255), nullable=False, index=True)
    kg_price = Column(Integer, nullable=False, index=True)
    euro_price = Column(Integer, nullable=False, index=True)
    img_path = Column(String(255), nullable=True)
    quantity = Column(Integer, nullable=False, default=0, index=True)  
    category = Column(String(255), nullable=True, index=True)        
    unit_weight = Column(Float, nullable=False, default=1.0)  # poids d'une unité en kg
  

class Orders(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    products_ordered = Column(String(255), nullable=False, index=True)
    quantity = Column(Integer, nullable=False, index=True)
    order_type = Column(String(255), nullable=False, index=True)
    total_price = Column(Integer, nullable=False, index=True)
    total_weight = Column(Float, nullable=False, index=True)  
    ordered_by = Column(String(255), nullable=False, index=True)
    ordered_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)


class CompanySettings(Base):
    __tablename__ = "companysettings"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    address = Column(String(255), nullable=False, index=True)
    phone = Column(String(255), nullable=False, index=True)
    email = Column(String(255), nullable=False, index=True)
    logo_path = Column(String(255), nullable=True, index=True)

class InvoiceSettings(Base):
     __tablename__ = "invoicesettings"
     id = Column(Integer, primary_key=True, index=True)
     payment_terms = Column(String(255), nullable=False, index=True)
     delivery_time = Column(String(255), nullable=False, index=True)

class Expenses(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(String(255), nullable=False, index=True)
    supplier = Column(String(255), nullable=False, index=True)
    description = Column(String(255), nullable=False, index=True)
    amount = Column(Integer, nullable=False, index=True)
    category = Column(String(255), nullable=False, index=True)


class Seller(Base):
    __tablename__ = "sellers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    birth_date = Column(Date, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
   
    user = relationship("User", backref="seller_profile")