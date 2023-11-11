import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addressLists: [],
};

const addressSlices = createSlice({
  name: "address",
  initialState,
  reducers: {
    addAddress(state, action) {
      state.addressLists.push(action.payload);
    },
    removeAddress(state, action) {
      state.addressLists = state.addressLists.filter((address) => address.id !== action.payload);
    },
    updateAddress(state, action) {
      const { id, ...address } = action.payload;
      const addressIndex = state.addressLists.findIndex((address) => address.id === id);
      if (addressIndex >= 0) {
        state.addressLists[addressIndex] = { id, ...address };
      }
    },
  },
});

export const { addAddress, removeAddress, updateAddress } = addressSlices.actions;
export default addressSlices.reducer;
