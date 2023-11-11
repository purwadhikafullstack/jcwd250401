const { Order, OrderItem, Product } = require('../models');
const jwt = require('jsonwebtoken');

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);  
  const userId = decoded.id;  // Extract user's ID from the token's payload

  try {
    // Check if the product exists and if there is enough stock
    const product = await Product.findOne({
      where: { id: productId }
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    // Find or create a cart order for the user
    const [order, created] = await Order.findOrCreate({
      where: { userId, status: 'In Cart' }, // Use the appropriate status for your cart
      defaults: { userId, status: 'In Cart', totalPrice: 0 } // Initialize totalPrice if needed
    });

    // Find the cart item or create a new one if it does not exist
    const [orderItem, itemCreated] = await OrderItem.findOrCreate({
      where: { orderId: order.id, productId },
      defaults: { quantity, price: product.price }
    });

    // If the item already exists in the cart, update the quantity
    if (!itemCreated) {
      orderItem.quantity += quantity;
      await orderItem.save();
    }

    // Update the order's total price by recalculating it
    const orderItems = await OrderItem.findAll({
      where: { orderId: order.id },
      include: [{ model: Product, attributes: ['price'] }]
    });

    let totalPrice = 0;
    orderItems.forEach(item => {
      totalPrice += item.quantity * item.Product.price;
    });

    order.totalPrice = totalPrice;
    await order.save();

    res.status(201).json({
      message: 'Item added to cart',
      orderItem
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding item to cart',
      error: error.message
    });
  }
};

exports.updateCartItemQuantity = async (req, res) => {
  const { productId } = req.params;
  const { newQuantity } = req.body;

  if (newQuantity < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1' });
  }

  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const userId = decoded.id;

  try {
    const order = await Order.findOne({
      where: { userId, status: 'In Cart' }
    });
    if (!order) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const orderItem = await OrderItem.findOne({
      where: { orderId: order.id, productId }
    });
    if (!orderItem) {
      return res.status(404).json({ message: 'Product not in cart' });
    }

    // Update the quantity
    orderItem.quantity = newQuantity;
    await orderItem.save();

    // Recalculate total price
    const orderItems = await OrderItem.findAll({
      where: { orderId: order.id },
      include: [{ model: Product, attributes: ['price'] }]
    });

    let totalPrice = 0;
    orderItems.forEach(item => {
      totalPrice += item.quantity * item.Product.price;
    });

    order.totalPrice = totalPrice;
    await order.save();

    res.status(200).json({
      message: 'Cart item quantity updated',
      orderItem
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating cart item quantity',
      error: error.message
    });
  }
};

exports.deleteCartItem = async (req, res) => {
  const { productId } = req.params;

  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const userId = decoded.id;

  try {
    const order = await Order.findOne({
      where: { userId, status: 'In Cart' }
    });
    if (!order) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const orderItem = await OrderItem.findOne({
      where: { orderId: order.id, productId }
    });
    if (!orderItem) {
      return res.status(404).json({ message: 'Product not in cart' });
    }

    // Delete the item from the cart
    await orderItem.destroy();

    // Recalculate total price
    const orderItems = await OrderItem.findAll({
      where: { orderId: order.id },
      include: [{ model: Product, attributes: ['price'] }]
    });

    let totalPrice = 0;
    orderItems.forEach(item => {
      totalPrice += item.quantity * item.Product.price;
    });

    order.totalPrice = totalPrice;
    await order.save();

    res.status(200).json({
      message: 'Product removed from cart'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error removing product from cart',
      error: error.message
    });
  }
};