-- Table entreprise
CREATE TABLE company (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  logo TEXT,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  siren INTEGER,
  vat_number VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table vendeur
CREATE TABLE seller (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  company_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES company(id)
);

-- Table produits
CREATE TABLE product (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER,
  variety VARCHAR(255),
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES category(id)
);

-- Table produits par entreprise
CREATE TABLE company_product (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER,
  product_id INTEGER,
  weight INTEGER,
  stock INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES company(id),
  FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Table type de paiement
CREATE TABLE payment_type (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table catégorie
CREATE TABLE category (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table vente
CREATE TABLE sale (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  seller_id INTEGER,
  company_product_id INTEGER,
  price DECIMAL(10, 2) NOT NULL,
  payment_type_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES seller(id),
  FOREIGN KEY (company_product_id) REFERENCES company_product(id),
  FOREIGN KEY (payment_type_id) REFERENCES payment_type(id)
);
