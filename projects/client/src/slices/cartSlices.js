import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],  // Array of cart items
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
    addItemToCart: (state, action) => {
      state.items.push(action.payload);
    },
    removeItemFromCart: (state, action) => {
      // Use productId to filter out the item
      state.items = state.items.filter(item => item.productId !== action.payload.id);
    },
    updateCartItem: (state, action) => {
      // Find item index using productId
      const index = state.items.findIndex(item => item.productId === action.payload.id);
      if (index !== -1) {
        // Update the item at the found index
        state.items[index] = {...state.items[index], ...action.payload};
      }
    },
  },
});

export const { setCartItems, addItemToCart, removeItemFromCart, updateCartItem } = cartSlice.actions;
export default cartSlice.reducer;