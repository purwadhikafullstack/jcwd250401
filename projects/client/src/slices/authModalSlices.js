import { createSlice } from "@reduxjs/toolkit";

const authModalSlices = createSlice({
  name: "authModal",
  initialState: {
    isOpen: false,
  },
  reducers: {
    showModal: (state) => {
      state.isOpen = true;
    },
    hideModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { showModal, hideModal } = authModalSlices.actions;

export default authModalSlices.reducer;