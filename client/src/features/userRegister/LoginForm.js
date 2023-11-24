import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkUser, login } from "./userSlice";
import {
  clearCustomerInfo,
  retrieveOrderedList,
} from "../shoppingCart/shoppingCartSlice";
import GoogleReg from "./GoogleReg";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErr, setEmailError] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const [verifiedErr, setVerifiedErr] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userStatus = useSelector((state) => state.user.userStatus);

  useEffect(() => {
    dispatch(checkUser());
  }, [dispatch]);

  const handleLogin = async () => {
    dispatch(clearCustomerInfo());
    setEmailError("");
    setPasswordErr("");
    if (email.length > 0 && password.length > 0) {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        if (data.errors) {
          setEmailError(data.errors.email);
          setPasswordErr(data.errors.password);
        }
        if (data.unverified) {
          setVerifiedErr("please verify your account");
        }
        if (data.user) {
          dispatch(login(data.user));
          navigate("/products");
          dispatch(retrieveOrderedList(data.user));
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="bg-img">
      <div className="box">
        <form onSubmit={(e) => e.preventDefault()}>
          <span className="text-center">Login</span>
          <div className="input-container">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">Email</label>
            <p className="error">{emailErr}</p>
          </div>
          <div className="input-container">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password">Password</label>
          </div>
          <button className="button-17" onClick={handleLogin}>
            Login
          </button>
          <GoogleReg />
          <p className="error">{passwordErr}</p>
        </form>
        <br />
        <div>
          {userStatus === "verifying" && (
            <div className="otp-container">
              <label htmlFor="" className="title">
                OTP:
              </label>
              <br />
              <input type="number" maxLength={6} className="input-price" />
            </div>
          )}
          <br />
          <h3 className="error">{verifiedErr}</h3>
        </div>
      </div>
    </div>
  );
};

export default Login;
