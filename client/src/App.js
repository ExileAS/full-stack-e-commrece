import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./app/Navbar";
import ProductsList from "./features/products/ProductList";
import { ProductDetails } from "./features/products/ProductDetails";
import { AddNewProduct } from "./features/products/AddNewProduct";
import { SellerList } from "./features/sellers/SellerList";
import { SingleSellerPage } from "./features/sellers/SingleSellerPage";
import ShoppingCartPage from "./features/shoppingCart/ShoppingCartPage";
import MoreLikeThis from "./features/products/MoreLikeThis";
import ConfirmOrderForm from "./features/shoppingCart/ConfirmOrderForm";
import OrderedProductsList from "./features/shoppingCart/OrderedProductList";
import LandingPage from "./features/landingPage/LandingPage";
import SignUp from "./features/userRegister/SignupForm";
import Login from "./features/userRegister/LoginForm";
import SelectedList from "./features/products/SelectedList";
import PaymentConfirmed from "./features/shoppingCart/PaymentConfirmed";
import { GoogleOAuthProvider } from "@react-oauth/google";
import CategoriesContextProvider from "./contexts/categories-context";
import Categories from "./features/search/Categories";

function App() {
  return (
    <GoogleOAuthProvider clientId="638833864743-4ph4ulasbrnnfq3r6u5l0nq833h6ajqi.apps.googleusercontent.com">
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route exact path="/" element={<LandingPage />} />
            <Route
              exact
              path="/products"
              element={
                <CategoriesContextProvider>
                  <Categories />
                  <ProductsList />
                </CategoriesContextProvider>
              }
            />
            <Route
              exact
              path="/products/:productId"
              element={<ProductDetails />}
            />
            <Route
              exact
              path="/products/addProduct"
              element={<AddNewProduct />}
            />
            <Route
              exact
              path="/products/addProduct/:productId"
              element={<AddNewProduct />}
            />
            <Route exact path="/sellers" element={<SellerList />} />
            <Route
              exact
              path="/sellers/:sellerId"
              element={<SingleSellerPage />}
            />
            <Route exact path="/shoppingCart" element={<ShoppingCartPage />} />
            <Route
              exact
              path="/moreProducts/:productId"
              element={<MoreLikeThis />}
            />
            <Route exact path="/confirm-order" element={<ConfirmOrderForm />} />
            <Route
              exact
              path="/products/ordered"
              element={<OrderedProductsList />}
            />
            <Route
              exact
              path="/products/ordered/:id"
              element={<PaymentConfirmed />}
            />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/products/selected" element={<SelectedList />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
