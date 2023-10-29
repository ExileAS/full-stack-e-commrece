import { useNavigate } from "react-router-dom";
import useRunOnce from "./useRunOnce";
import { fetchProducts } from "../products/productsSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";

const LandingPage = () => {
  const naviate = useNavigate();
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  useRunOnce({
    fn: async () => {
      await dispatch(fetchProducts()).unwrap();
      setLoaded(true);
      naviate("/products");
    },
    sessionKey: "1",
  });

  return (
    <div className="landing-page">
      {loaded ? (
        <h2 className="landing-title">
          Welcome to my online store <br />
          <b className="loading">Loading...</b>
        </h2>
      ) : (
        <h2 className="landing-title"> Welcome to my online store</h2>
      )}
    </div>
  );
};

export default LandingPage;
