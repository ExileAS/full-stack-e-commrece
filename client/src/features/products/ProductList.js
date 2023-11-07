import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  checkSelected,
  productSelected,
  selectAllProducts,
  selectProductById,
} from "./productsSlice";
import SearchBar from "../search/SearchBar";
import { selectAllInCart } from "../shoppingCart/shoppingCartSlice";
import { fetchProducts } from "./productsSlice";
import React, { useContext, useEffect, useState } from "react";
import { Spinner } from "../../components/Spinner";
import {
  getAllSellers,
  getIdByName,
  selectSellerById,
} from "../sellers/sellersSlice";
import "transition-style";
import bagSrc from "../../components/shoppingBag.jpg";
import { CategoriesContext } from "../../contexts/categories-context";

export const ProductExcerpt = React.memo(
  ({ productId, count, orderedList, mainPage, confirmed }) => {
    const logged = useSelector((state) => state.user.userEmail);
    const dispatch = useDispatch();
    const product = useSelector((state) => selectProductById(state, productId));
    let sellerId = useSelector((state) => getIdByName(state, product.seller));
    if (sellerId) localStorage.setItem(productId, sellerId);
    else sellerId = localStorage.getItem(productId);
    const selected = useSelector((state) => checkSelected(state, productId));
    const seller = useSelector((state) => selectSellerById(state, sellerId));
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
    const selectButton =
      logged &&
      !productInCart &&
      !orderedList &&
      !mainPage &&
      seller?.name !== product.seller;
    return (
      available &&
      product && (
        <section className="item-product" key={product.id}>
          <Link to={"/products/" + product.id} className="product-title">
            <h2>
              {product.name.substring(0, 15)} {count > 1 && <b>x{count}</b>}
            </h2>
            <div className="product-img">
              <img src={product.img} alt="" className="laptop" />
            </div>
          </Link>
          <p className="description">
            {product.description.length > 40
              ? `${product.description.substring(0, 40)}...`
              : `${product.description}`}
          </p>
          <b className="description">{product.price / 100} $</b>
          <br />
          <div>
            {" "}
            {confirmed && (
              <div>
                others by{" "}
                <Link to={"/sellers/" + sellerId}>{product.seller}</Link>
              </div>
            )}
          </div>
          {selectButton && (
            <div>
              {!select && product.onhand > 0 && (
                <button
                  className="button-29"
                  onClick={() => {
                    dispatch(productSelected({ productId: product.id }));
                    setSelect(true);
                  }}
                >
                  Select
                </button>
              )}
            </div>
          )}
          {!orderedList && (
            <div>
              {!productInCart ? (
                <div>
                  {" "}
                  {product.onhand > 0 ? (
                    <b className="description">quantity: {product.onhand}</b>
                  ) : (
                    <div className="soldout">
                      <b className="sold">Sold out</b>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <b className="description">
                    quantity: {productInCart.onhand}
                  </b>
                  <h3 className="description">
                    in <Link to={"/shoppingCart"}>your cart</Link>
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
  const { categories, category } = useContext(CategoriesContext);
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
  if (status === "success") {
    const filtered = products.filter(
      (product) =>
        category.length === 0 ||
        (categories.includes(category) && category === product.category)
    );
    if (status === "error") content = <div>Error Loading from server</div>;
    content = filtered.length ? (
      filtered.map((product) => (
        <ProductExcerpt
          productId={product.id}
          key={product.id}
          mainPage={true}
        />
      ))
    ) : (
      <div>
        <h2>No Matching Results</h2>
      </div>
    );
  }
  if (status === "failed") content = <div>{error}</div>;

  return (
    <div className="container">
      <SearchBar data={products} categories={categories} />
      <img src={bagSrc} alt="store-logo" className="main-logo" />
      <br />
      <Link to="/products/addProduct" className="add-link">
        {logged && <button className="button-63">Add Product</button>}
      </Link>
      <div className="grid">{content}</div>
    </div>
  );
};
