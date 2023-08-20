import { useNavigate } from "react-router-dom";
import useRunOnce from "./useRunOnce";
import { fetchProducts } from "../products/productsSlice";
import { useDispatch } from "react-redux";

const LandingPage = () => {
  const naviate = useNavigate();
  const dispatch = useDispatch();

  useRunOnce({
    fn: async () => {
      await dispatch(fetchProducts()).unwrap();
      naviate("/products");
    },
    sessionKey: "1",
  });

  return (
    <div className="landing-page">
      <h2 className="landing-title">
        Welcome to my online store<b>👋</b>
      </h2>
    </div>
  );
};

export default LandingPage;
