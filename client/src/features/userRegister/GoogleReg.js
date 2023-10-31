import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { googleLogin } from "../userRegister/userSlice";
import { jwtDecode } from "jwt-decode";
import { retrieveOrderedList } from "../shoppingCart/shoppingCartSlice";

const GoogleReg = () => {
  const dispatch = useDispatch();
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
        window.history.go(-1);
        dispatch(retrieveOrderedList(email));
      }
    } catch (err) {
      console.log(err);
    }
  };
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
