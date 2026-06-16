const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth'); // ✅ use your existing middleware file
const adminMiddleware = require('../middleware/admin');

// GET all orders for a user (protected)
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const orders = await Order.find({ userId: req.params.userId }).populate('products.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all orders (admin only)
router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'username email').populate('products.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new order (protected)
router.post('/:userId', authMiddleware, async (req, res) => {
  const { products, totalPrice } = req.body;
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const order = new Order({ userId: req.params.userId, products, totalPrice });
    const saved = await order.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH update order status (admin only)
router.patch('/:orderId', authMiddleware, adminMiddleware, async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
