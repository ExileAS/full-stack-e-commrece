import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllConfirmed } from "../features/shoppingCart/shoppingCartSlice";
import { getAllSelected } from "../features/products/productsSlice";
import useLogout from "../features/userRegister/useLogout";

const Navbar = () => {
  const logged = useSelector((state) => state.user.loggedIn);
  const user = useSelector((state) => state.user.userName);
  const selected = useSelector(getAllSelected);
  const confirmed = useSelector(selectAllConfirmed)?.length > 0;
  const handleLogout = useLogout();

  return (
    <div>
      <nav>
        <section>
          <div className="navContent">
            <div className="navLinks">
              <Link to="/products">products</Link>
              <Link to="/shoppingCart">shopping cart</Link>
              {selected.length > 0 && (
                <Link to={"/products/selected"} className="Selected-Nav">
                  Selected
                </Link>
              )}
              <Link to={"/products/ordered/checkout"}>Ordered</Link>
              {confirmed && logged && (
                <Link to={"/products/ordered/confirmed/id"}>Confirmed</Link>
              )}
              {!logged ? (
                <>
                  <Link to={"/signup"}>
                    <button className="button-33">Signup</button>
                  </Link>
                  <Link to={"/login"}>
                    <button className="button-33">Login</button>
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="logged-as">Logged as {user}</h2>
                  <button
                    className="button-81"
                    onClick={() => handleLogout("")}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      </nav>
    </div>
  );
};

export default Navbar;
