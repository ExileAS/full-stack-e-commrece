import { useNavigate } from "react-router-dom";
import useRunOnce from "./useRunOnce";
import { fetchProducts } from "../products/productsSlice";
import { useDispatch } from "react-redux";
import logo from "../../components/images/shoppingBag.jpg";
import Loader from "../../components/Loader";
import { getAllSellers } from "../sellers/sellersSlice";
import { fetchReviews } from "../reviews/reviewSlice";
import exponentialBackoff from "../utils/exponentialBackoff";
import Footer from "../../components/Footer";
import { useState } from "react";

const LandingPage = () => {
  const naviate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useRunOnce({
    fn: async () => {
      setLoading(true);
      await exponentialBackoff(async () => {
        try {
          const data = await Promise.all([
            dispatch(fetchProducts()).unwrap(),
            dispatch(getAllSellers()).unwrap(),
            dispatch(fetchReviews()).unwrap(),
          ]);
          return data;
        } catch (err) {
          console.log(err);
        }
      }, "Initial load");
      setTimeout(() => {
        setLoading(false);
        naviate("/products");
      }, 1000);
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
        {loading && <Loader />}
      </div>
      <br />
      <Footer />
    </div>
  );
};

export default LandingPage;
