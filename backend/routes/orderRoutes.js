const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getCart,
  saveCart
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addOrderItems);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/cart')
  .get(protect, getCart)
  .post(protect, saveCart);

router.route('/:id')
  .get(protect, getOrderById);

module.exports = router;
