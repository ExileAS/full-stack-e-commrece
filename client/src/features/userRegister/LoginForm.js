import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkUser, login, setTempStatus } from "./userSlice";
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
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const otpRef = useRef({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currUser = useSelector((state) => state.user.tempEmail);

  useEffect(() => {
    if (currUser) {
      dispatch(checkUser());
    }
  }, [dispatch, currUser]);

  const userStatus = useSelector((state) => state.user.userStatus);

  useEffect(() => {
    if (userStatus === "unregistered" && currUser)
      dispatch(setTempStatus({ email: null }));
  }, [userStatus, currUser, dispatch]);

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
          if (currUser)
            dispatch(setTempStatus({ email: null, status: "logged" }));
          dispatch(login(data.user));
          navigate("/products");
          dispatch(retrieveOrderedList(data.user));
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleOTP = async (e) => {
    if (otpRef.current.value.length === 6) {
      setLoading(true);
      const res = await fetch("/api/verifyOTP", {
        method: "POST",
        body: JSON.stringify({ email: currUser, otp: otpRef.current?.value }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setLoading(false);
      if (data.status) {
        setResponse(data.status);
        if (
          data.status === "verified successfully!" ||
          data.status === "already verified"
        ) {
          dispatch(setTempStatus({ email: null, status: "logged" }));
        }
      }
      if (data.err) {
        setResponse(data.err);
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
        {currUser && (
          <div className="otp-container">
            {loading && <h2 className="sent">Loading...</h2>}
            {!loading && userStatus !== "logged" && (
              <input
                type="text"
                placeholder="type your otp..."
                className="input-price"
                maxLength="6"
                onChange={handleOTP}
                ref={otpRef}
              />
            )}
            <p className="error">{verifiedErr}</p>
            <div className="error">{response}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
