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
  },
});

export const { setCartItems, addToCartItems } = cartSlice.actions;

export default cartSlice.reducer;