import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "./userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErr, setEmailError] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
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
          navigate("/products");
        }
      } catch (err) {
        console.log(err);
      }
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
        <p>{emailErr}</p>
        <br />
        <label htmlFor="password">Password</label>
        <br />
        <input
          type="password"
          value={password}
          className="name"
          onChange={(e) => setPassword(e.target.value)}
        />
        <p>{passwordErr}</p>
        <br />
        <button className="add-button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
