import { useDispatch, useSelector } from "react-redux";
import { getAllSellers, selectAllSellers } from "./sellersSlice";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Spinner } from "../../components/Spinner";
import { fetchProducts, selectAllProducts } from "../products/productsSlice";

export const SellerList = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.sellers.status);
  const productStatus = useSelector((state) => state.products.status);
  useEffect(() => {
    if (status === "idle") {
      dispatch(getAllSellers());
    }
    if (productStatus === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch, productStatus]);

  let map = {};
  const sellers = useSelector(selectAllSellers);
  const products = useSelector(selectAllProducts);
  sellers.forEach(({ name }) => {
    map[name] = products.filter((product) => product.seller === name);
  });

  let sellerList;

  if (status === "loading") {
    sellerList = <Spinner text="loading" />;
  }
  if (status === "success") {
    sellerList = sellers.map((seller) => (
      <div key={seller.id} className="sellers">
        <Link to={"/sellers/" + seller.id} key={seller.id} className="user">
          <li key={seller.id}>{seller.name}</li>
        </Link>
        <div key="seller">
          {map[seller.name].map((item) => (
            <h2 className="description" key={item.id}>
              <li className="description">
                <Link to={"/products/" + item.id} className="description">
                  {item.name}
                </Link>
              </li>
            </h2>
          ))}
        </div>
      </div>
    ));
  }

  return <div>{sellerList}</div>;
};
