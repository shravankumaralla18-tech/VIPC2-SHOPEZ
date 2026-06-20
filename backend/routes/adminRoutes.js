const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// All routes here require auth & admin
router.use(protect);
router.use(admin);

router.route('/dashboard')
  .get(getDashboardStats);

router.route('/users')
  .get(getAllUsers);

router.route('/orders')
  .get(getAllOrders);

router.route('/orders/:id/status')
  .put(updateOrderStatus);

module.exports = router;
