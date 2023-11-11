const { Order, OrderItem, Product } = require('../models');
const jwt = require('jsonwebtoken');

exports.getCartItems = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const userId = decoded.id; // Extract user's ID from the token's payload

  try {
    // Find the user's cart order
    const order = await Order.findOne({
      where: { userId, status: 'In Cart' }
    });

    if (!order) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Retrieve all cart items for the order, including product details
    const cartItems = await OrderItem.findAll({
      where: { orderId: order.id },
      include: [{ model: Product }] // Include the Product details
    });

    // Respond with the cart items
    res.status(200).json({
      message: 'Cart items retrieved successfully',
      cartItems
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      message: 'Error retrieving cart items',
      error: error.message
    });
  }
};

exports.getCartItemCount = async (req, res) => {
  const { id: userId } = req.user; // Updated to use userId from req.user

  try {
    // Find the user's cart order
    const order = await Order.findOne({
      where: { userId, status: 'In Cart' }
    });

    if (!order) {
      return res.json({ count: 0 });
    }

    // Sum the quantities of all items in the cart
    const items = await OrderItem.findAll({
      where: { orderId: order.id }
    });
    const count = items.reduce((acc, item) => acc + item.quantity, 0);

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};