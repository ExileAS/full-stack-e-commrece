import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "./userSlice";
import { clearCustomerInfo } from "../shoppingCart/shoppingCartSlice";
import GoogleReg from "./GoogleReg";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErr, setEmailError] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const dispatch = useDispatch();

  const handleSignup = async () => {
    dispatch(clearCustomerInfo());
    setEmailError("");
    setPasswordErr("");
    try {
      const res = await fetch("/api/signup", {
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
  };

  return (
    <div className="box">
      <form onSubmit={(e) => e.preventDefault()}>
        <span className="text-center">Signup</span>
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
        <button className="button-17" onClick={handleSignup}>
          Signup
        </button>
        <GoogleReg />
        <p className="error">{passwordErr}</p>
      </form>
    </div>
  );
};

export default SignUp;
