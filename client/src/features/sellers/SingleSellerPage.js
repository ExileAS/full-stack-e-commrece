import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllSellers, selectSellerById } from "./sellersSlice";
import { fetchProducts, selectProductsByUser } from "../products/productsSlice";
import { useEffect } from "react";
import { ProductExcerpt } from "../products/ProductList";
import { Spinner } from "../../components/Spinner";

export const SingleSellerPage = () => {
  const dispatch = useDispatch();
  const { sellerId } = useParams();
  const sellerStatus = useSelector((state) => state.sellers.status);
  const user = useSelector((state) => selectSellerById(state, sellerId));
  const userProducts = useSelector((state) =>
    selectProductsByUser(state, user)
  );
  const productStatus = useSelector((state) => state.products.status);

  useEffect(() => {
    if (sellerStatus === "idle") {
      dispatch(getAllSellers());
    }
    if (productStatus === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, sellerStatus, productStatus]);

  let content;
  if (sellerStatus === "loading") content = <Spinner text="Loading..." />;
  if (sellerStatus === "success") {
    content = userProducts.map((product) => (
      <ProductExcerpt product={product} key={product.id} />
    ));
  }

  if (sellerStatus === "failed") content = <div>[]</div>;

  return (
    <div>
      {user && (
        <h2 className="user-products">{user.name}'s products for selling:</h2>
      )}
      <br />
      {content}
    </div>
  );
};
