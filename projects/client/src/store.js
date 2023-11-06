import { configureStore } from "@reduxjs/toolkit";
import authModalReducer from "./slices/authModalSlices";

const store = configureStore({
  reducer: {
    authModal: authModalReducer,
  },
});

export default store;

