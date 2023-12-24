import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllSellers, selectSellerById } from "./sellersSlice";
import {
  fetchProducts,
  selectProductsBySeller,
} from "../products/productsSlice";
import { useEffect } from "react";
import ProductExcerpt from "../products/ProductExcerpt";
import { Spinner } from "../../components/Spinner";

export const SingleSellerPage = () => {
  const dispatch = useDispatch();
  const { sellerId } = useParams();
  const sellerStatus = useSelector((state) => state.sellers.status);
  const productStatus = useSelector((state) => state.products.status);
  const seller = useSelector((state) => selectSellerById(state, sellerId));
  const sellerProducts = useSelector((state) =>
    selectProductsBySeller(state, seller)
  );

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
    content = sellerProducts.map((product) => (
      <ProductExcerpt productId={product.id} key={product.id} />
    ));
  }

  if (sellerStatus === "failed") content = <div>[]</div>;

  return (
    <div>
      {seller && <h2 className="title">Available by {seller.name}</h2>}
      <br />
      <div className="grid">{content}</div>
    </div>
  );
};
