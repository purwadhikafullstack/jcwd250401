const express = require('express');
const router = express.Router();
const { getCartItems, getCartItemCount } = require('../controller/cartGetter');
const { addToCart, updateCartItemQuantity, deleteCartItem } = require('../controller/cartController');
const { validateToken } = require('../middleware/auth'); // Make sure to require the validateToken middleware

// Route to handle adding items to the cart
router.post('/', validateToken, addToCart); // Include validateToken middleware

// Route to get the count of items in the user's cart
router.get('/items/count', validateToken, getCartItemCount); // Include validateToken middleware

// Route to get the items in the user's cart
router.get('/items', validateToken, getCartItems); // Include validateToken middleware

// Route to update the quantity of a cart item
router.post('/items/:productId', validateToken, updateCartItemQuantity);

// Route to delete a product from the cart
router.delete('/items/:productId', validateToken, deleteCartItem);

module.exports = router;