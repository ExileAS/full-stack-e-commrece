import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "./userSlice";
import { Link } from "react-router-dom";
import { clearCustomerInfo } from "../shoppingCart/shoppingCartSlice";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErr, setEmailError] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const navigate = useNavigate();
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
        navigate("/products");
        window.location.reload(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
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
        <br />
        <label htmlFor="password">Password</label>
        <br />
        <input
          type="password"
          value={password}
          className="name"
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="error">{passwordErr}</p>
        <br />
        <button className="add-button" onClick={handleSignup}>
          Signup
        </button>
        <p>
          or
          <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
