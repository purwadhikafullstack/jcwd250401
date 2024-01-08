import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Change the initial state to an array
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
    addToCartItems: (state, action) => {
      state.items.push(action.payload); // Assuming action.payload is a cart item
    },
    deleteAllCartItem: (state, action) => {
      state.items = [];
    },
  },
});

export const { setCartItems, addToCartItems, deleteAllCartItem } = cartSlice.actions;

export default cartSlice.reducer;