import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "./userSlice";
import { Link } from "react-router-dom";
import { clearCustomerInfo } from "../shoppingCart/shoppingCartSlice";
import GoogleReg from "./GoogleReg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErr, setEmailError] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const dispatch = useDispatch();

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
        if (data.user) {
          dispatch(login(data.user));
          window.history.go(-1);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="signup-form">
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="email">Email</label>
        <br />
        <input
          type="text"
          value={email}
          className="name"
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="error">{emailErr}</p>

        <label htmlFor="password">Password</label>
        <br />
        <input
          type="password"
          value={password}
          className="name"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button className="button-17" onClick={handleLogin}>
          Login
        </button>
        <GoogleReg />
        <p className="error">{passwordErr}</p>
        <p className="or">
          or
          <Link to="/signup"> Signup</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
