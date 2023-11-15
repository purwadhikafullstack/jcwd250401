
import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'products',
  initialState: {
    productList: []
  },
  reducers: {
    addProduct: (state, action) => {
      state.productList.push(action.payload);
    },
    removeProduct: (state, action) => {
      state.productList = state.productList.filter(product => product.id !== action.payload);
    }
  }
});

export const { addProduct, removeProduct } = productSlice.actions;

export default productSlice.reducer;
