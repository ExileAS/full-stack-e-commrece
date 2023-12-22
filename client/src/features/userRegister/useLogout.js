import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCustomerInfo } from "../shoppingCart/shoppingCartSlice";
import { clearUserInfo } from "./userSlice";
import { clearProducts } from "../products/productsSlice";
import { LOGOUT_URL } from "../utils/urlConstants";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async (err) => {
    await fetch(LOGOUT_URL);
    dispatch(clearUserInfo());
    dispatch(clearCustomerInfo());
    dispatch(clearProducts());
    navigate(`/login/${err}`);
  };
  return handleLogout;
};

export default useLogout;
