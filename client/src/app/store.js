import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/products/productsSlice";
import sellersReducer from "../features/sellers/sellersSlice";
import shoppingCartReducer from "../features/shoppingCart/shoppingCartSlice";
import userReducer from "../features/userRegister/userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

const cartPersistConfig = {
  key: "shoppingCart",
  storage,
};

const userPersistConfig = {
  key: "users",
  storage,
  blacklist: ["userOrderId"],
};

const persistedReducerCart = persistReducer(
  cartPersistConfig,
  shoppingCartReducer
);

const persistedReducerUser = persistReducer(userPersistConfig, userReducer);

const store = configureStore({
  reducer: {
    products: productsReducer,
    sellers: sellersReducer,
    shoppingCart: persistedReducerCart,
    user: persistedReducerUser,
  },
  middleware: [thunk],
});
export default store;
export const persistor = persistStore(store);
