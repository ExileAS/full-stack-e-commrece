import { useDispatch, useSelector } from "react-redux";
import { getAllSellers, selectAllSellers } from "./sellersSlice";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Spinner } from "../../components/Spinner";

export const SellerList = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.sellers.status);
  useEffect(() => {
    if (status === "idle") {
      dispatch(getAllSellers());
    }
  }, [status, dispatch]);
  const sellers = useSelector(selectAllSellers);

  let sellerList;

  if (status === "loading") {
    sellerList = <Spinner text="loding" />;
  }
  if (status === "success") {
    sellerList = sellers.map((user) => (
      <div key={user.id} className="sellers">
        <Link to={"/sellers/" + user.id} key={user.id} className="user">
          <li key={user.id}>{user.name}</li>
        </Link>
      </div>
    ));
  }

  return <div>{sellerList}</div>;
};
