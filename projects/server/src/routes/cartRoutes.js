const express = require('express');
const router = express.Router();
const { addToCart, getCartItemCount } = require('../controller/cartController');

// Route to handle adding items to the cart
router.post('/', addToCart);

// Route to get the count of items in the user's cart
router.get('/items/count', getCartItemCount);

module.exports = router;
