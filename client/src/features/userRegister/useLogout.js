import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearCustomerInfo,
  clearOrdered,
  clearShoppingCart,
} from "../shoppingCart/shoppingCartSlice";
import { logout } from "./userSlice";
import { getAllSelected, productUnSelected } from "../products/productsSlice";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selected = useSelector(getAllSelected);
  const handleLogout = async (err) => {
    await fetch("/api/logout", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    dispatch(clearOrdered());
    dispatch(logout());
    dispatch(clearShoppingCart());
    dispatch(clearCustomerInfo());
    selected.forEach((item) =>
      dispatch(productUnSelected({ productId: item.id }))
    );
    navigate(`/login/${err}`);
  };
  return handleLogout;
};

export default useLogout;
