import { useDispatch, useSelector } from "react-redux";
import { getAllSelected } from "./productsSlice";
import { ProductDetails } from "./ProductDetails";
import { productUnSelected } from "./productsSlice";

const SelectedList = () => {
  const dispatch = useDispatch();

  const selectedList = useSelector(getAllSelected);
  const content = selectedList.map((product) => (
    <div>
      <ProductDetails productProp={product} key={product.id} />
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

  return <div>{content}</div>;
};

export default SelectedList;
