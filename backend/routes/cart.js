const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const authMiddleware = require('../middleware/auth');

// GET cart by userId (protected)
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    // Ensure the user is accessing their own cart
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add item to cart (protected)
router.post('/:userId', authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      cart = new Cart({ userId: req.params.userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(i => i.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE item from cart (protected)
router.delete('/:userId/:productId', authMiddleware, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(i => i.productId.toString() !== req.params.productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
