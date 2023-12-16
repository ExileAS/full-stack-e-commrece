import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCustomerInfo } from "../shoppingCart/shoppingCartSlice";
import { logout } from "./userSlice";
import { getAllSelected, productUnSelected } from "../products/productsSlice";
import { LOGOUT_URL } from "../utils/urlConstants";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selected = useSelector(getAllSelected);
  const handleLogout = async (err) => {
    await fetch(LOGOUT_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    dispatch(logout());
    dispatch(clearCustomerInfo());
    selected.forEach((item) =>
      dispatch(productUnSelected({ productId: item.id }))
    );
    navigate(`/login/${err}`);
  };
  return handleLogout;
};

export default useLogout;
