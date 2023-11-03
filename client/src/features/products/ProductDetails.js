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
import { getIdByName, getAllSellers } from "../sellers/sellersSlice";

export const ProductDetails = React.memo(({ productProp }) => {
  const [amount, setAmount] = useState(1);
  const [amountExceeded, setAmountExceeded] = useState(false);
  let { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutUser = useLogout();
  productId = productId || productProp.id;
  const added = useSelector((state) => checkAdded(state, productId));
  const logged = useSelector((state) => state.user.loggedIn);
  const productStatus = useSelector((state) => state.products.status);
  const sellerStatus = useSelector((state) => state.sellers.status);
  const currUser = useSelector((state) => state.user.userName);
  let product = useSelector((state) => selectProductById(state, productId));
  if (!product) product = localStorage.getItem(productId);
  const productsInCart = useSelector((state) => state.shoppingCart.cart);
  const productInCart = productsInCart.find(
    (product) => product.id === productId
  );

  const sellerId = useSelector((state) => getIdByName(state, product.seller));

  const count = productInCart === undefined ? 1 : productInCart.count;

  useEffect(() => {
    if (product) localStorage.setItem(productId, product);
  }, [product, productId]);

  useEffect(() => {
    if (productStatus === "idle") {
      dispatch(fetchProducts());
    }
    if (sellerStatus === "idle") {
      dispatch(getAllSellers());
    }
  }, [dispatch, productStatus, sellerStatus]);

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
    <div className="details-container">
      <section className="product-card">
        <h2 className="title-text">
          {product.name} {amount > 1 && <b>x{amount}</b>}
        </h2>
        <img src={product.img} alt="" className="laptop" />
        <br />
        <b className="price">{product.price / 100} $</b>
        <p className="description">{product.description}</p>

        <span className="addedby">
          added by{" "}
          {product.seller ? (
            <Link to={"/sellers/" + sellerId} className="seller-title">
              {product.seller}
            </Link>
          ) : (
            "unknown"
          )}
        </span>

        <br />
        <TimeAgo timestamp={product.date} />
        <br />
        {logged ? (
          <div>
            {product.selected ? (
              <div>
                <button
                  className="button-37"
                  onClick={() => navigate("/moreProducts/" + productId)}
                >
                  See Similar Products
                </button>
                <br />
                <div>
                  {!added ? (
                    <button
                      className="button-87"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <>
                      <button
                        className="button-3"
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
              <div>
                {!productInCart &&
                  product.onhand > 0 &&
                  currUser !== product.seller && (
                    <button
                      className="button-29"
                      onClick={() => dispatch(productSelected({ productId }))}
                    >
                      Select
                    </button>
                  )}
                <div>
                  {currUser === product.seller && (
                    <div className="description">
                      <Link to={"/products/addProduct/" + productId}>Edit</Link>
                    </div>
                  )}
                  {product.onhand <= 0 && <h2 className="soldout">Sold Out</h2>}
                </div>
              </div>
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
