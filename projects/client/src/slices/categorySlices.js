import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryLists: [],
};

const categorySlices = createSlice({
  name: "category",
  initialState,
  reducers: {
    addCategory(state, action) {
      state.categoryLists.push(action.payload);
    },
    removeCategory(state, action) {
      state.categoryLists = state.categoryLists.filter((category) => category.id !== action.payload);
    },
  },
});

export const { addCategory, removeCategory } = categorySlices.actions;
export default categorySlices.reducer;
