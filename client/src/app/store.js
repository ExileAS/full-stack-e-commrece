import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/products/productsSlice";
import sellersReducer from "../features/sellers/sellersSlice";
import shoppingCartReducer from "../features/shoppingCart/shoppingCartSlice";
import userReducer from "../features/userRegister/userSlice";

export default configureStore({
  reducer: {
    products: productsReducer,
    sellers: sellersReducer,
    shoppingCart: shoppingCartReducer,
    user: userReducer,
  },
});
