import { useDispatch, useSelector } from "react-redux";
import {
  getTotalCost,
  incrementInCart,
  selectAllInCart,
  decrementInCart,
  clearShoppingCart,
} from "./shoppingCartSlice";
import TimeAgo from "../../components/TimeAgo";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const ShoppingCartPage = () => {
  const { err } = useParams();
  let errors;
  if (err?.length) errors = err.split(",");
  const productsInCart = useSelector(selectAllInCart);
  const totalCost = useSelector(getTotalCost);
  const [totalPrice, setTotalPrice] = useState(totalCost);
  const [unavailbleErr, setUnavailableErr] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [amountExceeded, setAmountExceeded] = useState(false);

  useEffect(() => {
    if (errors?.length) {
      setUnavailableErr("this product is out of stock!");
    }
  }, [errors]);

  const handleIncrement = (product) => {
    dispatch(incrementInCart(product));
    if (product.count < product.onhand)
      setTotalPrice((prev) => prev + product.price);
    else {
      setAmountExceeded(true);
      setTimeout(() => {
        setAmountExceeded(false);
      }, 2800);
    }
  };

  const products = productsInCart.map((product) => {
    return (
      <div className="product-card" key={product.id}>
        <Link to={"/products/" + product.id}>
          <h2>
            {product.name} x{product.count}
          </h2>
        </Link>
        <img src={product.img} alt="" className="laptop" loading="lazy" />
        <br />
        <b value={product.price} className="description">
          {product.price / 100} $
        </b>
        <br />
        <b className="description">{product.description}</b>
        <p className="description">by: {product.seller ?? "unknown"}</p>
        <TimeAgo timestamp={product.date} />
        <br />
        <button className="button-25" onClick={() => handleIncrement(product)}>
          +
        </button>
        <button
          className="button-24"
          onClick={() => {
            dispatch(decrementInCart(product.id));
            if (totalPrice > 0) setTotalPrice((prev) => prev - product.price);
          }}
        >
          -
        </button>
        {errors?.includes(product.id) && (
          <div className="soldout">
            <b>{unavailbleErr}</b>
          </div>
        )}
      </div>
    );
  });

  return (
    <section transition-style="in:circle:top-left">
      <span className="cart-title">
        <h2 className="nothing-incart">items in your Shopping Cart</h2>
      </span>
      {errors && errors[0] === "no token" && (
        <p className="error">Please login to confirm!</p>
      )}
      <br />
      {products}
      {totalPrice > 0 && (
        <b className="cost">Total Cost: {totalPrice / 100} $</b>
      )}
      <br />
      {productsInCart.length > 0 && (
        <button
          className="button-100"
          onClick={() => navigate("/confirm-order")}
        >
          Confirm Order
        </button>
      )}
      <br />
      {amountExceeded && (
        <div className="error">on hand quantity exceeded!</div>
      )}
      {productsInCart.length > 0 && (
        <button
          onClick={() => {
            setTotalPrice(0);
            dispatch(clearShoppingCart());
          }}
          className="button-45"
        >
          Clear Shopping Cart &#128465;
        </button>
      )}
    </section>
  );
};

export default ShoppingCartPage;
