import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  productSelected,
  productUnSelected,
  selectProductById,
} from "./productsSlice";
import { useNavigate, useParams } from "react-router-dom";
import TimeAgo from "./TimeAgo";
import {
  addToShoppingCart,
  checkAdded,
  incrementInCart,
} from "../shoppingCart/shoppingCartSlice";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useLogout from "../userRegister/useLogout";

export const ProductDetails = React.memo(({ productProp }) => {
  let { productId } = useParams();
  productId = productId || productProp.id;
  const product =
    useSelector((state) => selectProductById(state, productId)) || {};
  const added = useSelector((state) => checkAdded(state, productId));
  const logged = useSelector((state) => state.user.loggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutUser = useLogout();
  const productsInCart = useSelector((state) => state.shoppingCart.cart);
  const productInCart = productsInCart.find(
    (product) => product.id === productId
  );
  const count = productInCart === undefined ? 1 : productInCart.count;
  const [amount, setAmount] = useState(1);
  const [amountExceeded, setAmountExceeded] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

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
        dispatch(productUnSelected({ productId: product.id }));
      } else {
        await logoutUser();
        navigate("/signup");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <section className="product-card">
        <h2 className="title-text">
          {product.name} {amount > 1 && <b>x{amount}</b>}
        </h2>
        <b className="price">Price: {product.price}</b>
        <p>{product.description}</p>
        <br />
        <span> added by {product.seller ? product.seller : "unknown"}</span>
        <br />
        <TimeAgo timestamp={product.date} />
        <br />
        {logged ? (
          <div>
            {product.selected ? (
              <div>
                <button
                  className="add-button-main"
                  onClick={() => navigate("/moreProducts/" + productId)}
                >
                  See Similar Products
                </button>
                <br />
                <div>
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
              </div>
            ) : (
              <button
                className="button-29"
                onClick={() => dispatch(productSelected({ productId }))}
              >
                Select
              </button>
            )}
          </div>
        ) : (
          <div>
            <h3>
              <Link to={"/signup"}>signup</Link> to select
            </h3>
          </div>
        )}
      </section>
    </div>
  );
});
