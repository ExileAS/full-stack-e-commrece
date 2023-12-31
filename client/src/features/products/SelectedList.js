import { useDispatch, useSelector } from "react-redux";
import { getAllSelected } from "./productsSlice";
import { ProductDetails } from "./ProductDetails";
import { productUnSelected } from "./productsSlice";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  getCartLength,
  addToShoppingCart,
} from "../shoppingCart/shoppingCartSlice";

const SelectedList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartHasItems = useSelector(getCartLength) > 0;

  const selectedList = useSelector(getAllSelected);
  const content = selectedList.map((product) => (
    <div key={product.id} className="details-container">
      <ProductDetails productPropId={product.id} selectedDetails={true} />
      <button
        className="button-42"
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

  const handleAddAll = (selectedList) => {
    selectedList.forEach((product) => {
      dispatch(addToShoppingCart(product));
      dispatch(productUnSelected({ productId: product.id }));
    });
  };

  return selectedList.length > 0 ? (
    <div>
      {content}
      <div className="add-all-div">
        <button onClick={() => handleAddAll(selectedList)} className="add-all">
          <h3 className="button-87">add all &#128722;</h3>
        </button>
      </div>
    </div>
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
