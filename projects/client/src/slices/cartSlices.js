import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
    addToCartItems: (state, action) => {
      state.items = state.items + action.payload;
    },
  },
});

export const { setCartItems, addToCartItems } = cartSlice.actions;

export default cartSlice.reducer;
