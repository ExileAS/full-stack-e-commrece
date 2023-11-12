import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectAllProducts } from "./productsSlice";
import SearchBar from "../search/SearchBar";
import { fetchProducts } from "./productsSlice";
import React, { useContext, useEffect } from "react";
import { getAllSellers } from "../sellers/sellersSlice";
import "transition-style";
import bagSrc from "../../components/shoppingBag.jpg";
import { CategoriesContext } from "../../contexts/categories-context";
import Loader from "../../components/Loader";
import { fetchReviews, setStatus } from "../reviews/reviewSlice";
import ProductExcerpt from "./ProductExcerpt";

const ProductsList = () => {
  const { categories, category } = useContext(CategoriesContext);
  const dispatch = useDispatch();
  const status = useSelector((state) => state.products.status);
  const logged = useSelector((state) => state.user.loggedIn);
  const reviewStatus = useSelector((state) => state.review.status);
  useEffect(() => {
    if (status === "idle") {
      dispatch(setStatus());
      dispatch(fetchProducts());
      dispatch(getAllSellers());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (reviewStatus === "idle") {
      dispatch(fetchReviews());
    }
  }, [dispatch, reviewStatus]);

  const products = useSelector(selectAllProducts);
  const error = useSelector((state) => state.error);

  let content;
  if (status === "loading" || reviewStatus === "loading") content = <Loader />;
  if (status === "success") {
    const filtered = products.filter(
      (product) =>
        category.length === 0 ||
        (categories.includes(category) && category === product.category)
    );
    if (status === "failed")
      content = (
        <div>
          <h2>Error loading from server</h2>
        </div>
      );
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

      {logged && (
        <button className="button-63">
          <Link to="/products/addProduct" className="inner-link">
            Add Product
          </Link>
        </button>
      )}

      <div className="grid">{content}</div>
    </div>
  );
};

export default ProductsList;
