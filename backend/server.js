const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

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








app.get('/', (req, res) => {
  res.send('Radiant Beauty Glam backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
