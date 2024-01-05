import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { attatchReviews, selectAllProducts } from "./productsSlice";
import SearchBar from "../search/SearchBar";
import { fetchProducts } from "./productsSlice";
import React, { useContext, useEffect, useRef } from "react";
import { getAllSellers } from "../sellers/sellersSlice";
import "transition-style";
import bagSrc from "../../components/images/shoppingBag.jpg";
import { CategoriesContext } from "../../contexts/categoriesContext";
import Loader from "../../components/Loader";
import { fetchReviews, getAllReviews } from "../reviews/reviewSlice";
import ProductExcerpt from "./ProductExcerpt";

const ProductsList = () => {
  const { categories, category } = useContext(CategoriesContext);
  const dispatch = useDispatch();
  const status = useSelector((state) => state.products.status);
  const logged = useSelector((state) => state.user.loggedIn);
  const reviewStatus = useSelector((state) => state.review.status);
  const currIsSeller = useSelector((state) => state.user.currIsSeller);
  const reviews = useSelector(getAllReviews);
  const loadedRef = useRef(false);
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
      dispatch(getAllSellers());
    }
    if (reviewStatus === "idle") {
      dispatch(fetchReviews());
    }
    if (reviewStatus === "loading") loadedRef.current = true;
    if (loadedRef.current && reviewStatus === "success") {
      dispatch(attatchReviews(reviews));
    }
  }, [dispatch, status, reviewStatus, reviews]);

  const products = useSelector(selectAllProducts);
  const error = useSelector((state) => state.products.error);

  let content;
  if (status === "loading" || reviewStatus === "loading") content = <Loader />;
  if (status === "success" && reviewStatus === "success") {
    const filtered = products.filter(
      (product) =>
        category.length === 0 ||
        (categories.includes(category) && category === product.category)
    );
    content = filtered.length ? (
      filtered.map((product, ind) => (
        <ProductExcerpt
          productId={product.id}
          key={product.id}
          mainPage={true}
          ind={ind}
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

      {logged && currIsSeller && (
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
