const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/cart', require('./routes/cart.js'));
app.use('/api/orders', require('./routes/orders.js'));
app.use('/api/products', require('./routes/products.js'));
app.use('/api/users', require('./routes/users.js'));

// ✅ Serve frontend build (dist folder)
app.use(express.static(path.join(__dirname, 'dist')));

// ✅ Catch-all: send React index.html for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
