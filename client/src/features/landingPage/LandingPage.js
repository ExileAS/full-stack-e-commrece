import { useNavigate } from "react-router-dom";
import useRunOnce from "./useRunOnce";
import { fetchProducts } from "../products/productsSlice";
import { useDispatch } from "react-redux";
import logo from "../../components/images/shoppingBag.jpg";
import Loader from "../../components/Loader";
import { getAllSellers } from "../sellers/sellersSlice";
import { fetchReviews } from "../reviews/reviewSlice";
import exponentialBackoff from "../utils/exponentialBackoff";

const LandingPage = () => {
  const naviate = useNavigate();
  const dispatch = useDispatch();

  useRunOnce({
    fn: () =>
      exponentialBackoff(async () => {
        try {
          const data = await Promise.all([
            dispatch(fetchProducts()).unwrap(),
            dispatch(getAllSellers()).unwrap(),
            dispatch(fetchReviews()).unwrap(),
          ]);
          naviate("/products");
          return data;
        } catch (err) {
          console.log(err);
        }
      }),
    sessionKey: "1",
  });

  return (
    <div className="container-landing">
      <div className="avatar">
        <img src={logo} alt="" className="landing-logo" loading="lazy" />
      </div>
      <div className="content-landing">
        <h1 className="title-landing">Welcome To Shopping Bag</h1>
        <Loader />
      </div>
    </div>
  );
};

export default LandingPage;
