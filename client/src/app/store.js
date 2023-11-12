import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/products/productsSlice";
import sellersReducer from "../features/sellers/sellersSlice";
import shoppingCartReducer from "../features/shoppingCart/shoppingCartSlice";
import userReducer from "../features/userRegister/userSlice";
import reviewReducer from "../features/reviews/reviewSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

const cartPersistConfig = {
  key: "shoppingCart",
  storage,
};

const userPersistConfig = {
  key: "user",
  storage,
};

const reviewPersistConfig = {
  key: "review",
  storage,
};

const persistedReducerCart = persistReducer(
  cartPersistConfig,
  shoppingCartReducer
);

const persistedReducerUser = persistReducer(userPersistConfig, userReducer);

const persistedReducerreview = persistReducer(
  reviewPersistConfig,
  reviewReducer
);

const store = configureStore({
  reducer: {
    products: productsReducer,
    sellers: sellersReducer,
    shoppingCart: persistedReducerCart,
    user: persistedReducerUser,
    review: persistedReducerreview,
  },
  middleware: [thunk],
});
export default store;
export const persistor = persistStore(store);
