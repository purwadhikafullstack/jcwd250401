const { Order, OrderItem, Product } = require('../models');

exports.addToCart = async (req, res) => {
  const { productId, quantity, userId } = req.body; // userId must be provided in the body

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
      defaults: { quantity }
    });

    // If the item already exists in the cart, increment the quantity
    if (!itemCreated) {
      orderItem.quantity += quantity;
      await orderItem.save();
    }

    // Update the stock of the product
    product.stock -= quantity;
    await product.save();

    // Recalculate the total price of the order
    order.totalPrice += (product.price * quantity); // Assuming price is per unit
    await order.save();

    res.status(201).json({ message: 'Product added to cart', orderItem });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.getCartItemCount = async (req, res) => {
  const { userId } = req.body; // userId must be provided in the body

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
