const express = require('express');
const router = express.Router();
const { addToCart, getCartItemCount, getCartItems } = require('../controller/cartController');
const { validateToken } = require('../middleware/auth'); // Make sure to require the validateToken middleware

// Route to handle adding items to the cart
router.post('/', validateToken, addToCart); // Include validateToken middleware

// Route to get the count of items in the user's cart
router.get('/items/count', validateToken, getCartItemCount); // Include validateToken middleware

// Route to get the items in the user's cart
router.get('/items', validateToken, getCartItems); // Include validateToken middleware

module.exports = router;