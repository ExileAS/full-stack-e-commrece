import { Link, useNavigate } from "react-router-dom";
import imgSrc from "../components/6011.jpg";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/userRegister/userSlice";
import {
  clearCustomerInfo,
  clearOrdered,
  clearShoppingCart,
  selectAllConfirmed,
} from "../features/shoppingCart/shoppingCartSlice";
import { getAllSelected } from "../features/products/productsSlice";

const Navbar = () => {
  const logged = useSelector((state) => state.user.loggedIn);
  const user = useSelector((state) => state.user.userEmail);
  const selected = useSelector(getAllSelected);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const confirmed = useSelector(selectAllConfirmed)?.length > 0;

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    dispatch(clearOrdered());
    dispatch(logout());
    dispatch(clearShoppingCart());
    dispatch(clearCustomerInfo());
    navigate("/products");
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
    </nav>
  );
};

export default Navbar;
