import { Routes, Route } from "react-router-dom";
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
import CategoriesContextProvider from "./contexts/categoriesContext";
import Categories from "./features/search/Categories";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import useLogout from "./features/userRegister/useLogout";
import useIdleTimeout from "./features/userRegister/useIdleTimeout";
import { CsrfContextLayout } from "./contexts/csrfTokenContext";
import PasswordReset from "./features/userRegister/PasswordReset";

function App() {
  const currEmail = useSelector((state) => state.user.userEmail);
  const logoutUser = useLogout();
  useIdleTimeout(() => logoutUser("timeout"));
  useEffect(() => {
    if (currEmail) {
      checkToken();
    }
    async function checkToken() {
      const res = await fetch("/api/checkToken", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.err);
        logoutUser("token expired");
      }
    }
  }, [currEmail, logoutUser]);

  return (
    <GoogleOAuthProvider clientId="638833864743-4ph4ulasbrnnfq3r6u5l0nq833h6ajqi.apps.googleusercontent.com">
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
          <Route exact path="/products/selected" element={<SelectedList />} />
          <Route
            exact
            path="/products/:productId"
            element={<ProductDetails />}
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
            path="/shoppingCart/:err"
            element={<ShoppingCartPage />}
          />
          <Route
            exact
            path="/moreProducts/:productId"
            element={<MoreLikeThis />}
          />
          <Route element={<CsrfContextLayout />}>
            <Route
              exact
              path="/passowrd-reset/:id"
              element={<PasswordReset />}
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
            <Route exact path="/confirm-order" element={<ConfirmOrderForm />} />
            <Route
              exact
              path="/products/ordered/:paymentMethod"
              element={<OrderedProductsList />}
            />
            <Route
              exact
              path="/products/ordered/confirmed/:id"
              element={<PaymentConfirmed />}
            />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/signupSeller" element={<SignUp />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/login/:err" element={<Login />} />
          </Route>
        </Routes>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
