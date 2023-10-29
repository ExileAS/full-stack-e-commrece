import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store, { persistor } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";

import { checkUser } from "./features/userRegister/userSlice";
import { checkUserCart } from "./features/shoppingCart/shoppingCartSlice";

const root = ReactDOM.createRoot(document.getElementById("root"));

store.dispatch(checkUser());
store.dispatch(checkUserCart());
console.log("hello");

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
