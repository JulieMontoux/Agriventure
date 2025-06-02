from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from typing import List
import os
from fastapi import UploadFile, File, Form, Body, Path
import shutil
import os


from . import models
from . import schemas
from . database import SessionLocal, engine
from . import pdf_generator
from .pdf_generator import DailyReportPDF

# ========== CONFIGURATION ==========

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

models.Base.metadata.create_all(bind=engine)

app = FastAPI(swagger_ui_parameters={"syntaxHighlight": False})

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try : 
        yield db
    finally:
        db.close()
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    """Fonction pour récupérer l'utilisateur connecté à partir du token JWT"""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Token invalide")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide")
    
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")
    return user

# ========== ROUTES UTILISATEURS ==========

@app.post("/users/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Nom d'utilisateur déjà pris")

    hashed_pw = get_password_hash(user.password)

    db_user = models.User(
        username=user.username,
        hashed_password=hashed_pw,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users", response_model=List[schemas.UserOut])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

# ========== ROUTES AUTHENTIFICATION ==========

@app.post("/auth/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()

    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Identifiants invalides")

    access_token = create_access_token(data={"sub": db_user.username, "role": db_user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@app.post("/auth/seller-login")
def seller_login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    """Connexion spécifique pour les vendeurs avec validation du rôle"""
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Identifiants invalides")
    
    if db_user.role != "vendor":
        raise HTTPException(status_code=403, detail="Accès réservé aux vendeurs")
    
    seller_profile = db.query(models.Seller).filter(models.Seller.user_id == db_user.id).first()
    if not seller_profile:
        raise HTTPException(status_code=403, detail="Profil vendeur incomplet")
    
    access_token = create_access_token(data={
        "sub": db_user.username, 
        "role": db_user.role,
        "seller_id": seller_profile.id,
        "seller_name": seller_profile.name
    })
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_info": {
            "username": db_user.username,
            "role": db_user.role,
            "seller_name": seller_profile.name
        }
    }


# ========== ROUTES PRODUITS ==========

@app.post("/productsTest/", response_model=schemas.ProductTestOut)
def create_product_test(producttest: schemas.ProductTestCreate, db: Session = Depends(get_db)):
    db_producttest = models.ProductTest(
        type=producttest.type,
        varieties=producttest.varieties,
        kg_price=producttest.kg_price,
        euro_price=producttest.euro_price,
        quantity=producttest.quantity,
        category=producttest.category,
        unit_weight=producttest.unit_weight,  
        img_path=producttest.img_path
    )
    db.add(db_producttest)
    db.commit()
    db.refresh(db_producttest)
    return db_producttest


@app.get("/productsTest/", response_model=List[schemas.ProductTestOut])
def read_products(db: Session = Depends(get_db)):
    return db.query(models.ProductTest).all()


@app.put("/productsTest/{product_id}/quantity")
def update_product_quantity(product_id: int, quantity: int = Body(...), db: Session = Depends(get_db)):
    product = db.query(models.ProductTest).filter(models.ProductTest.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    if quantity < 0:
        raise HTTPException(status_code=400, detail="La quantité ne peut pas être négative")
    
    product.quantity = quantity
    db.commit()
    db.refresh(product)
    return product

@app.put("/productsTest/{product_id}", response_model=schemas.ProductTestOut)
def update_product(product_id: int, product: schemas.ProductTestCreate, db: Session = Depends(get_db)):
    db_product = db.query(models.ProductTest).filter(models.ProductTest.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")

    for key, value in product.dict().items():
        setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)
    return db_product

@app.delete("/productsTest/{product_id}")
def delete_product(product_id: int = Path(...), db: Session = Depends(get_db)):
    product = db.query(models.ProductTest).filter(models.ProductTest.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")

    db.delete(product)
    db.commit()
    return {"message": f"Produit #{product_id} supprimé avec succès"}

@app.post("/productsTest/upload-image/")
async def upload_product_image(product_id: int = Form(...), file: UploadFile = File(...)):
    if not file.filename.endswith(".png"):
        raise HTTPException(status_code=400, detail="Only PNG files are allowed")

    image_folder = "public/assets/images/products/"
    os.makedirs(image_folder, exist_ok=True)
    image_filename = f"{product_id}.png"
    image_path = os.path.join(image_folder, image_filename)

    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    db = SessionLocal()
    product = db.query(models.ProductTest).filter(models.ProductTest.id == product_id).first()
    if product:
        product.img_path = f"assets/images/products/{image_filename}"
        db.commit()

    return {"message": "Image uploaded and product updated"}


# ========== ROUTES COMMANDES ==========

@app.post("/orders/", response_model=schemas.OrdersOut)
def create_orders_test(orders: schemas.OrdersCreate, db: Session = Depends(get_db)):
    db_orders = models.Orders(
        products_ordered=orders.products_ordered,
        quantity=orders.quantity,
        order_type=orders.order_type,
        total_price=orders.total_price,
        total_weight=orders.total_weight,
        ordered_by=orders.ordered_by
    )
    db.add(db_orders)
    db.commit()
    db.refresh(db_orders)
    return db_orders


@app.get("/orders/", response_model=List[schemas.OrdersOut])
def read_orders(db: Session = Depends(get_db)):
    return db.query(models.Orders).all()

# ajouts

# ========== ROUTES PARAMÈTRES ==========

@app.post("/company-settings/", response_model=schemas.CompanySettingsOut)
def create_company_settings(settings: schemas.CompanySettingsCreate, db: Session = Depends(get_db)):
    db_settings = models.CompanySettings(**settings.dict())
    db.add(db_settings)
    db.commit()
    db.refresh(db_settings)
    return db_settings

@app.get("/company-settings/", response_model=schemas.CompanySettingsOut)
def get_company_settings(db: Session = Depends(get_db)):
    settings = db.query(models.CompanySettings).first()
    if not settings:
        default_settings = schemas.CompanySettingsCreate(
            name="EARL Villemur",
            address="123 Rue des Fruits, 31340 Villemur-sur-Tarn",
            phone="05 61 XX XX XX",
            email="contact@earlvillemur.fr"
        )
        return create_company_settings(default_settings, db)
    return settings

@app.put("/company-settings/{settings_id}", response_model=schemas.CompanySettingsOut)
def update_company_settings(settings_id: int, settings: schemas.CompanySettingsCreate, db: Session = Depends(get_db)):
    db_settings = db.query(models.CompanySettings).filter(models.CompanySettings.id == settings_id).first()
    if not db_settings:
        raise HTTPException(status_code=404, detail="Paramètres introuvables")
    
    for key, value in settings.dict().items():
        setattr(db_settings, key, value)
    
    db.commit()
    db.refresh(db_settings)
    return db_settings

@app.post("/invoice-settings/", response_model=schemas.InvoiceSettingsOut)
def create_invoice_settings(settings: schemas.InvoiceSettingsCreate, db: Session = Depends(get_db)):
    db_settings = models.InvoiceSettings(**settings.dict())
    db.add(db_settings)
    db.commit()
    db.refresh(db_settings)
    return db_settings

@app.get("/invoice-settings/", response_model=schemas.InvoiceSettingsOut)
def get_invoice_settings(db: Session = Depends(get_db)):
    settings = db.query(models.InvoiceSettings).first()
    if not settings:
        default_settings = schemas.InvoiceSettingsCreate(
            payment_terms="Paiement à la livraison",
            delivery_time="2 jours ouvrés"
        )
        return create_invoice_settings(default_settings, db)
    return settings

@app.put("/invoice-settings/{settings_id}", response_model=schemas.InvoiceSettingsOut)
def update_invoice_settings(settings_id: int, settings: schemas.InvoiceSettingsCreate, db: Session = Depends(get_db)):
    db_settings = db.query(models.InvoiceSettings).filter(models.InvoiceSettings.id == settings_id).first()
    if not db_settings:
        raise HTTPException(status_code=404, detail="Paramètres introuvables")
    
    for key, value in settings.dict().items():
        setattr(db_settings, key, value)
    
    db.commit()
    db.refresh(db_settings)
    return db_settings

@app.put("/users/{user_id}/change-password")
def change_password(user_id: int, password_data: schemas.PasswordChange, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    
    if not verify_password(password_data.old_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Ancien mot de passe incorrect")
    
    user.hashed_password = get_password_hash(password_data.new_password)
    db.commit()
    
    return {"message": "Mot de passe modifié avec succès"}

# ========== ROUTES VENDEURS ==========

@app.post("/sellers/", response_model=schemas.UserOut)
def create_seller(seller: schemas.SellerCreate, db: Session = Depends(get_db)):
    username = f"{seller.name.lower().replace(' ', '.')}"
    existing_user = db.query(models.User).filter(models.User.username == username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Ce nom d'utilisateur existe déjà")
    
    db_user = models.User(
        username=username,
        hashed_password=get_password_hash(seller.password),
        role="vendor"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    try:
        birth_date_obj = datetime.strptime(seller.birth_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Format de date invalide. Utilisez YYYY-MM-DD")
        
    db_seller = models.Seller(
        name=seller.name,
        birth_date=birth_date_obj,
        user_id=db_user.id
    )
    db.add(db_seller)
    db.commit()
        
    return db_user

@app.get("/sellers/profile", response_model=schemas.SellerOut)
async def get_seller_profile(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Récupère le profil du vendeur connecté"""
    if current_user.role != "vendor":
        raise HTTPException(status_code=403, detail="Accès réservé aux vendeurs")
    
    seller = db.query(models.Seller).filter(models.Seller.user_id == current_user.id).first()
    if not seller:
        raise HTTPException(status_code=404, detail="Profil vendeur introuvable")
    
    return seller

@app.get("/sellers/check-permissions")
async def check_seller_permissions(current_user: models.User = Depends(get_current_user)):
    """Vérifie les permissions du vendeur connecté"""
    if current_user.role != "vendor":
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    permissions = {
        "can_access_pos": True,
        "can_view_products": True,
        "can_create_orders": True,
        "can_view_daily_sales": True,
        "can_access_dashboard": False,
        "can_create_sellers": False,
        "can_manage_products": False,
        "can_view_all_orders": False,
        "can_manage_settings": False,
        "can_view_reports": False,
        "can_manage_expenses": False
    }
    
    return {
        "user": current_user.username,
        "role": current_user.role,
        "permissions": permissions
    }
# ========== ROUTES RAPPORTS ==========

@app.get("/generate-report")
def generate_report(date: str = None, db: Session = Depends(get_db)):
    pdf_generator = DailyReportPDF()
    
    report_date = None
    if date:
        try:
            report_date = datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(
                status_code=400, 
                detail="Format de date invalide. Utilisez YYYY-MM-DD"
            )
    
    try:
        pdf_path = pdf_generator.generate(db, report_date)
        
        return FileResponse(
            path=pdf_path,
            filename=os.path.basename(pdf_path),
            media_type="application/pdf"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la génération du rapport: {str(e)}"
        )
    
@app.post("/expenses/", response_model=schemas.ExpenseOut)
def create_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = models.Expenses(
        date=expense.date,
        supplier=expense.supplier,
        description=expense.description,
        amount=expense.amount,
        category=expense.category
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@app.get("/expenses/", response_model=List[schemas.ExpenseOut])
def read_expenses(db: Session = Depends(get_db)):
    return db.query(models.Expenses).all()

@app.get("/expenses/{date}", response_model=List[schemas.ExpenseOut])
def read_expenses_by_date(date: str, db: Session = Depends(get_db)):
    """Récupère les dépenses pour une date spécifique"""
    return db.query(models.Expenses).filter(models.Expenses.date == date).all()

# ========== ROUTES MOTS DE PASSE ==========

@app.put("/auth/change-password")
def change_my_password(password_data: schemas.PasswordChange, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    print(f"Utilisateur: {current_user.username}")
    print(f"Ancien mot de passe fourni: {password_data.old_password}")
    
    if not verify_password(password_data.old_password, current_user.hashed_password):
        print("ERREUR: Ancien mot de passe incorrect")
        raise HTTPException(status_code=400, detail="Ancien mot de passe incorrect")
    
    print("Mot de passe vérifié avec succès")
    current_user.hashed_password = get_password_hash(password_data.new_password)
    db.commit()
    
    return {"message": "Mot de passe modifié avec succès"}