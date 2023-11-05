import { useNavigate } from "react-router-dom";
import useRunOnce from "./useRunOnce";
import { fetchProducts } from "../products/productsSlice";
import { useDispatch } from "react-redux";
import logo from "../../components/shoppingBag.jpg";

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
    <div className="container-landing">
      <div className="avatar">
        <img src={logo} alt="" className="landing-logo" />
      </div>
      <div className="content-landing">
        <h1 className="title-landing">Welcome To Shopping Bag</h1>
        <div className="loader-container">
          <span className="loader__element"></span>
          <span className="loader__element"></span>
          <span className="loader__element"></span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
