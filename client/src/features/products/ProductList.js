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
import SortOptions from "../sortingList/SortOptions";
import "transition-style";

export const ProductExcerpt = React.memo(
  ({ product, count, orderedList, mainPage }) => {
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
        <section className="product-card" key={product.id}>
          <Link to={"/products/" + product.id} className="product-name">
            <h2>
              {product.name} {count > 1 && <b>x{count}</b>}
            </h2>
          </Link>
          <p>description: {product.description.substring(0, 40)}</p>
          <b>Price: {product.price}</b>
          <br />
          <span>
            added by{" "}
            {product.seller ? (
              <Link to={"/sellers/" + sellerId} className="seller-link">
                {product.seller}
              </Link>
            ) : (
              "unknown"
            )}
          </span>
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
                <b>on hand quantity: {product.onhand}</b>
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
      <h3 className="main-page-title">Products List</h3>
      <SearchBar data={products} />
      <br />
      <h2 className="all-products">All products:</h2>
      <SortOptions products={products} />
      {content}
    </div>
  );
};
