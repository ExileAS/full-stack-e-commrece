import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./app/Navbar";
import { ProductsList } from "./features/products/ProductList";
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

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/products" element={<ProductsList />} />
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
          <Route exact path="/users" element={<SellerList />} />
          <Route exact path="/users/:userId" element={<SingleSellerPage />} />
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
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
