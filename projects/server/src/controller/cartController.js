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