import { useDispatch, useSelector } from "react-redux";
import { getAllSelected } from "./productsSlice";
import { ProductDetails } from "./ProductDetails";
import { productUnSelected } from "./productsSlice";
import { Link } from "react-router-dom";

const SelectedList = () => {
  const dispatch = useDispatch();

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
