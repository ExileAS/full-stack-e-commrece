import { Link } from "react-router-dom";
import imgSrc from "../components/6011.jpg";
import { useDispatch, useSelector } from "react-redux";
import { googleLogin } from "../features/userRegister/userSlice";
import {
  retrieveOrderedList,
  selectAllConfirmed,
} from "../features/shoppingCart/shoppingCartSlice";
import { getAllSelected } from "../features/products/productsSlice";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import useLogout from "../features/userRegister/useLogout";

const Navbar = () => {
  const logged = useSelector((state) => state.user.loggedIn);
  const user = useSelector((state) => state.user.userEmail);
  const selected = useSelector(getAllSelected);
  const dispatch = useDispatch();
  const confirmed = useSelector(selectAllConfirmed)?.length > 0;
  const handleLogout = useLogout();

  const handleGoogleLogin = async (response) => {
    try {
      const { sub, email_verified, email } = jwtDecode(response.credential);
      const res = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify({ sub, email_verified, email }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      dispatch(googleLogin(response.credential));
      if (data.user) {
        dispatch(retrieveOrderedList(email));
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav>
      <h1 className="page-title">
        <Link to={"/"} className="page-title">
          Simple Online Store
        </Link>
      </h1>
      <section>
        <div className="navContent">
          <div className="navLinks">
            <Link to="/products">products</Link>
            <Link to="/users">sellers</Link>
            <Link to="/shoppingCart">
              <img src={imgSrc} alt="" className="img" />
            </Link>
            {selected.length > 0 && (
              <Link to={"/products/selected"} className="Selected-Nav">
                Selected
              </Link>
            )}
            <Link to={"/products/ordered"}>Ordered</Link>
            {!logged ? (
              <>
                <Link to={"/signup"}>
                  <button className="signup">Sign Up</button>
                </Link>
                <Link to={"/login"}>
                  <button className="login">Log in</button>
                </Link>
              </>
            ) : (
              <>
                <h2 className="welcome">Welcome {user}</h2>
                <button className="add-button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
            {confirmed && logged && (
              <Link to={"/products/ordered/:id"}>Confirmed</Link>
            )}
          </div>
        </div>
      </section>
      {logged ? (
        <div></div>
      ) : (
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={(err) => console.log(err)}
        />
      )}
    </nav>
  );
};

export default Navbar;
