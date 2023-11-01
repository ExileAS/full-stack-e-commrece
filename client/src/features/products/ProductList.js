import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  checkSelected,
  productSelected,
  productUnSelected,
  selectAllProducts,
} from "./productsSlice";
import TimeAgo from "./TimeAgo";
import SearchBar from "../search/SearchBar";
import { selectAllInCart } from "../shoppingCart/shoppingCartSlice";
import { fetchProducts } from "./productsSlice";
import React, { useEffect, useState } from "react";
import { Spinner } from "../../components/Spinner";
import { getAllSellers, getIdByName } from "../sellers/sellersSlice";
import "transition-style";
import bagSrc from "../../components/shoppingBag.jpg";

export const ProductExcerpt = React.memo(
  ({ product, count, orderedList, mainPage, confirmed }) => {
    const logged = useSelector((state) => state.user.userEmail);
    const dispatch = useDispatch();
    const productId = product.id;
    const sellerId = useSelector((state) => getIdByName(state, product.seller));
    const selected = useSelector((state) => checkSelected(state, productId));
    const [select, setSelect] = useState(selected);
    const productInCart = useSelector(selectAllInCart).find(
      (product) => productId === product.id
    );
    const productInMain = useSelector(selectAllProducts).find(
      (product) => productId === product.id
    );
    const availableInMain = productInMain?.onhand > 0;
    const available =
      productInCart === undefined ||
      productInCart.onhand > 0 ||
      availableInMain;
    return (
      available &&
      product && (
        <section className="item-product" key={product.id}>
          <Link to={"/products/" + product.id} className="product-name">
            <h2>
              {product.name} {count > 1 && <b>x{count}</b>}
            </h2>
          </Link>
          <p className="description">
            description: {product.description.substring(0, 10)}
          </p>
          <b className="description">Price: {product.price}</b>
          <br />
          <div>
            {" "}
            {!confirmed ? (
              <span className="addedby">
                added by{" "}
                {product.seller ? (
                  <Link to={"/sellers/" + sellerId} className="product-name">
                    {product.seller}
                  </Link>
                ) : (
                  "unknown"
                )}
              </span>
            ) : (
              <div>
                others by{" "}
                <Link to={"/sellers/" + sellerId}>{product.seller}</Link>
              </div>
            )}
          </div>
          <TimeAgo timestamp={product.date} />
          <br />{" "}
          {logged && !productInCart && !orderedList && !mainPage && (
            <div>
              {!select ? (
                <button
                  className="button-29"
                  onClick={() => {
                    dispatch(productSelected({ productId: product.id }));
                    setSelect(true);
                  }}
                >
                  Select
                </button>
              ) : (
                <button
                  className="add-button"
                  onClick={() => {
                    dispatch(productUnSelected({ productId: product.id }));
                    setSelect(false);
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          )}
          <br />
          {!orderedList && (
            <div>
              {!productInCart ? (
                <div>
                  {" "}
                  {product.onhand > 0 ? (
                    <b className="description">
                      on hand quantity: {product.onhand}
                    </b>
                  ) : (
                    <div className="soldout">
                      <b className="sold">Sold out</b>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <b>on hand quantity: {productInCart.onhand}</b>
                  <h3>
                    you added this to your{" "}
                    <Link to={"/shoppingCart"}>shopping cart</Link>
                  </h3>
                </div>
              )}
            </div>
          )}
        </section>
      )
    );
  }
);

export const ProductsList = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.products.status);
  const logged = useSelector((state) => state.user.loggedIn);
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
      dispatch(getAllSellers());
    }
  }, [dispatch, status]);

  const products = useSelector(selectAllProducts);
  const error = useSelector((state) => state.error);

  let content;
  if (status === "loading") content = <Spinner text="Loading..." />;
  if (status === "success")
    content = products.map((product) => (
      <ProductExcerpt product={product} key={product.id} mainPage={true} />
    ));

  if (status === "failed") content = <div>{error}</div>;

  return (
    <div className="container">
      <Link to="/products/addProduct" className="add-link">
        {logged && <button className="button-63">Add Product</button>}
      </Link>
      <SearchBar data={products} />
      <img src={bagSrc} alt="store-logo" className="main-logo" />
      <br />
      <div className="grid">{content}</div>
    </div>
  );
};
