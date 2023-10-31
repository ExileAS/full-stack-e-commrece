import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllConfirmed } from "../features/shoppingCart/shoppingCartSlice";
import { getAllSelected } from "../features/products/productsSlice";
import useLogout from "../features/userRegister/useLogout";

const Navbar = () => {
  const logged = useSelector((state) => state.user.loggedIn);
  const user = useSelector((state) => state.user.userEmail);
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
              <Link to="/sellers">sellers</Link>
              <Link to="/shoppingCart">shopping cart</Link>
              {selected.length > 0 && (
                <Link to={"/products/selected"} className="Selected-Nav">
                  Selected
                </Link>
              )}
              <Link to={"/products/ordered"}>Ordered</Link>
              {!logged ? (
                <>
                  <Link to={"/signup"}>
                    <button className="button-33">Sign Up</button>
                  </Link>
                  <Link to={"/login"}>
                    <button className="button-33">Log in</button>
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="welcome">Welcome {user}</h2>
                  <button className="button-81" onClick={handleLogout}>
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
    </div>
  );
};

export default Navbar;
