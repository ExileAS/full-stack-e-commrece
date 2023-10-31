import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllSellers, selectSellerById } from "./sellersSlice";
import { fetchProducts, selectProductsByUser } from "../products/productsSlice";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export const SingleSellerPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllSellers());
    dispatch(fetchProducts());
    console.log("worked");
  }, [dispatch]);

  const { sellerId } = useParams();
  const user = useSelector((state) => selectSellerById(state, sellerId));
  const userProducts = useSelector((state) =>
    selectProductsByUser(state, user)
  );
  const content = userProducts.map((product) => (
    <section key={product.id} className="product-card">
      <Link to={"/products/" + product.id} className="item-link">
        <h3>{product.name}</h3>
      </Link>
      <p>{product.description.substring(0, 50)}</p>
      <b>{product.price}</b>
    </section>
  ));

  return (
    <div>
      {user && (
        <h2 className="user-products">{user.name}'s products for selling:</h2>
      )}
      {content}
    </div>
  );
};
