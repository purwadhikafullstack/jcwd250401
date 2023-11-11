import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use local storage for persistence
import authModalReducer from "./slices/authModalSlices";
import accountReducer from "./slices/accountSlices";
import addressReducer from "./slices/addressSlices";

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
  })
);

const store = configureStore({
  reducer: persistedRootReducer,
});

const persistor = persistStore(store);

export { store, persistor };
