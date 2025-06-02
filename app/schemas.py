from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

class UserCreate(BaseModel):
    username: str
    password: str
    role: str  # "admin" ou "vendor"

class UserOut(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    username: str
    password: str


class ProductTestCreate(BaseModel):
    type: str
    varieties: str
    kg_price: int
    euro_price: int
    img_path: Optional[str] = None
    quantity: Optional[int] = 0              
    category: Optional[str] = None           
    unit_weight: float = 1.0

class ProductTestOut(BaseModel):
    id: int
    type: str
    varieties: str
    kg_price: int
    euro_price: int
    img_path: Optional[str] = None
    quantity: int                            
    category: Optional[str] = None    
    unit_weight: float = 1.0       

    class Config:
        orm_mode = True


class OrdersCreate(BaseModel):
    products_ordered: str
    quantity: int
    order_type: str
    total_price: int
    total_weight: float 
    ordered_by: str

class OrdersOut(BaseModel):
    id: int
    products_ordered: str
    quantity: int
    order_type: str
    total_price: int
    total_weight: float  
    ordered_by: str
    ordered_at: datetime

    class Config:
        orm_mode = True

class CompanySettingsCreate(BaseModel):
    name: str
    address: str
    phone: str
    email: str
    logo_path: str = "src/assets/images/agriventure-logo.png"

class CompanySettingsOut(BaseModel):
    id: int
    name: str
    address: str
    phone: str
    email: str
    logo_path: str

    class Config:
        orm_mode = True

class InvoiceSettingsCreate(BaseModel):
    payment_terms: str
    delivery_time: str

class InvoiceSettingsOut(BaseModel):
    id: int
    payment_terms: str
    delivery_time: str

    class Config:
        orm_mode = True

class SellerCreate(BaseModel):
    name: str
    birth_date: str
    password: str

class SellerOut(BaseModel):
    id: int
    name: str
    birth_date: str
    user_id: int

    class Config:
        orm_mode = True

class PasswordChange(BaseModel):
    old_password: str
    new_password: str

class ExpenseCreate(BaseModel):
    date: str
    supplier: str
    description: str
    amount: int
    category: str

class ExpenseOut(BaseModel):
    id: int
    date: str
    supplier: str
    description: str
    amount: int
    category: str

    class Config:
        orm_mode = True

class SellerOut(BaseModel):
    id: int
    name: str
    birth_date: date
    user_id: int
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class SellerLoginResponse(BaseModel):
    access_token: str
    token_type: str
    user_info: dict

class SellerPermissions(BaseModel):
    user: str
    role: str
    permissions: dict