const express = require('express');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const companyRoutes = require('./routes/companyRoutes');
const productRoutes = require('./routes/productRoutes');
const saleRoutes = require('./routes/saleRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const companyProductRoutes = require('./routes/companyProductRoutes');
const paymentTypeRoutes = require('./routes/paymentTypeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

app.use('/companies', companyRoutes);
app.use('/products', productRoutes);
app.use('/sales', saleRoutes);
app.use('/sellers', sellerRoutes);
app.use('/company-products', companyProductRoutes);
app.use('/payment-types', paymentTypeRoutes);
app.use('/categories', categoryRoutes);

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database & tables updated!');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
