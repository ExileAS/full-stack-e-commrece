import { useDispatch, useSelector } from "react-redux";
import { getAllSelected } from "./productsSlice";
import { ProductDetails } from "./ProductDetails";
import { productUnSelected } from "./productsSlice";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getCartLength } from "../shoppingCart/shoppingCartSlice";

const SelectedList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartHasItems = useSelector(getCartLength) > 0;

  const selectedList = useSelector(getAllSelected);
  const content = selectedList.map((product) => (
    <div key={product.id}>
      <ProductDetails productProp={product} />
      <button
        className="add-button"
        onClick={() => {
          dispatch(productUnSelected({ productId: product.id }));
        }}
      >
        Remove
      </button>
    </div>
  ));

  useEffect(() => {
    if (selectedList.length === 0) {
      if (cartHasItems) navigate("/shoppingCart");
      else navigate("/products");
    }
  }, [selectedList, cartHasItems, navigate]);

  return selectedList.length > 0 ? (
    <div>{content}</div>
  ) : (
    <div>
      <h3>
        <Link to={"/shoppingCart"}>See your shopping cart</Link>
      </h3>
      <h3>
        <Link to={"/products"}>Back to Product-List</Link>
      </h3>
    </div>
  );
};

export default SelectedList;
