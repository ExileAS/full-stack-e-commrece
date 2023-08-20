import { useDispatch, useSelector } from "react-redux";
import { productSelected, selectProductById } from "./productsSlice";
import { useNavigate, useParams } from "react-router-dom";
import TimeAgo from "./TimeAgo";
import {
  addToShoppingCart,
  checkAdded,
  incrementInCart,
} from "../shoppingCart/shoppingCartSlice";
import { useEffect, useState } from "react";

export const ProductDetails = () => {
  const { productId } = useParams();
  const product = useSelector((state) => selectProductById(state, productId));
  const added = useSelector((state) => checkAdded(state, productId));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productsInCart = useSelector((state) => state.shoppingCart.cart);
  const productInCart = productsInCart.find(
    (product) => product.id === productId
  );
  const count = productInCart === undefined ? 1 : productInCart.count;
  const [amount, setAmount] = useState(1);
  const [amountExceeded, setAmountExceeded] = useState(false);

  useEffect(() => {
    if (count > 1) setAmount(count);
  }, [productsInCart, count]);

  const toggleExceededError = () => {
    setAmountExceeded(true);
    setTimeout(() => {
      setAmountExceeded(false);
    }, 2800);
  };

  const handleAddToCart = async (product) => {
    try {
      const res = await fetch("/api/requireAuth", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        dispatch(addToShoppingCart(product));
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <section className="product-card">
        <h2>
          {product.name} <b>x{amount}</b>
        </h2>
        <b>Price: {product.price}</b>
        <p>{product.description}</p>
        <br />
        <span>added by {product.seller ? product.seller : "unknown"}</span>
        <br />
        <TimeAgo timestamp={product.date} />
        <br />
        {product.selected ? (
          <div>
            <b>ID: {productId}</b>
            <br />
            <button
              className="add-button-main"
              onClick={() => navigate("/moreProducts/" + productId)}
            >
              See Similar Products
            </button>
            <br />{" "}
            {!added ? (
              <button
                className="add-to-cart"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            ) : (
              <>
                <button
                  className="add-more-button"
                  onClick={() => {
                    count === product.onhand
                      ? toggleExceededError()
                      : dispatch(incrementInCart(product));
                  }}
                >
                  &#43;
                </button>
                <br />
                {amountExceeded && (
                  <div className="error">on hand quantity exceeded!</div>
                )}
              </>
            )}
          </div>
        ) : (
          <button
            className="add-button"
            onClick={() => dispatch(productSelected({ productId }))}
          >
            Select
          </button>
        )}
      </section>
    </div>
  );
};
