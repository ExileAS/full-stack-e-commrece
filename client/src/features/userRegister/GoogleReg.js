import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { googleLogin } from "../userRegister/userSlice";
import { jwtDecode } from "jwt-decode";
import { retrieveOrderedList } from "../shoppingCart/shoppingCartSlice";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { csrfTokenContext } from "../../contexts/csrfTokenContext";
import exponentialBackoff from "../utils/exponentialBackoff";

const GoogleReg = () => {
  const token = useContext(csrfTokenContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleLogin = () =>
    exponentialBackoff(async (response) => {
      try {
        const { sub, email_verified, email } = jwtDecode(response.credential);
        const res = await fetch("/api/signup", {
          method: "POST",
          body: JSON.stringify({ sub, email_verified, email }),
          headers: { "Content-Type": "application/json", "csrf-token": token },
        });
        const data = await res.json();
        dispatch(googleLogin(response.credential));
        if (data.user) {
          navigate("/products");
          dispatch(retrieveOrderedList(email));
        }
        return data;
      } catch (err) {
        console.log(err);
        return {
          err: err.message,
        };
      }
    });
  return (
    <div className="google">
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={(err) => console.log(err)}
      />
    </div>
  );
};

export default GoogleReg;
