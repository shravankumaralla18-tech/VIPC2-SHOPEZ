const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const { items, shippingAddress, totalAmount } = req.body;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Verify stock availability
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }
    }

    // Create Order (Simulated instant payment)
    const order = new Order({
      user: req.user._id,
      items: items.map(x => ({
        product: x.product,
        name: x.name,
        quantity: x.quantity,
        price: x.price,
        discount: x.discount || 0
      })),
      shippingAddress,
      totalAmount,
      paymentStatus: 'paid',
      paidAt: Date.now()
    });

    const createdOrder = await order.save();

    // Deduct Stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Empty User's Cart in Database
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );

    return res.status(201).json(createdOrder);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }
      return res.json(order);
    } else {
      return res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get user cart
// @route   GET /api/orders/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Save user cart
// @route   POST /api/orders/cart
// @access  Private
const saveCart = async (req, res) => {
  const { items } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id });
    }
    cart.items = items.map(x => ({
      product: x.product,
      quantity: x.quantity
    }));
    await cart.save();
    
    const populatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    return res.json(populatedCart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getCart,
  saveCart
};
