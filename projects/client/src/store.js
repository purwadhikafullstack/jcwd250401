import { configureStore } from "@reduxjs/toolkit";
import authModalReducer from "./slices/authModalSlices";
import accountReducer from "./slices/accountSlices";

const store = configureStore({
  reducer: {
    authModal: authModalReducer,
    account: accountReducer,
  },
});

export default store;

