import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use local storage for persistence
import authModalReducer from "./slices/authModalSlices";
import accountReducer from "./slices/accountSlices";
import addressReducer from "./slices/addressSlices";
import cartReducer from "./slices/cartSlices"; // Adjust the path to where your cartSlice is defined

const persistConfig = {
  key: "root", // The key to use for storing data in local storage
  storage,
};

const persistedRootReducer = persistReducer(
  persistConfig,
  combineReducers({
    authModal: authModalReducer,
    account: accountReducer,
    address: addressReducer,
    cart: cartReducer, // Add your cart reducer here
  })
);

const store = configureStore({
  reducer: persistedRootReducer,
});

const persistor = persistStore(store);

export { store, persistor };
