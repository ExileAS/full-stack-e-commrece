import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCustomerInfo } from "../shoppingCart/shoppingCartSlice";
import { clearUserInfo } from "./userSlice";
import { clearProducts } from "../products/productsSlice";
import { LOGOUT_URL } from "../utils/urlConstants";
import { persistor } from "../../app/store";
import { useCallback } from "react";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = useCallback(
    async (err) => {
      await fetch(LOGOUT_URL, { method: "GET", credentials: "include" });
      persistor.pause();
      await persistor.flush();
      persistor.purge();
      dispatch(clearUserInfo());
      dispatch(clearCustomerInfo());
      dispatch(clearProducts());
      navigate(`/login/${err}`);
    },
    [dispatch, navigate]
  );
  return handleLogout;
};

export default useLogout;
