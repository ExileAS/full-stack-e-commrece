import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { clearCustomerInfo } from "../shoppingCart/shoppingCartSlice";
import GoogleReg from "./GoogleReg";
import { useLocation, useNavigate } from "react-router-dom";
import { setTempEmail } from "./userSlice";
import { csrfTokenContext } from "../../contexts/csrfTokenContext";
import { PhoneNumberInput } from "../../components/PhoneInput";
import { isPossiblePhoneNumber } from "react-phone-number-input";

const SignUp = ({ err }) => {
  const tokenError = typeof err === "string" ? err : "";
  const token = useContext(csrfTokenContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [phoneNumberErr, setPhoneNumberErr] = useState("");
  const location = useLocation();
  const isSeller = location.pathname === "/signupSeller";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (isSeller && (!phoneNumber || !isPossiblePhoneNumber)) {
      setPhoneNumberErr("please enter a valid number");
      return;
    }
    if (password !== passwordConfirm) {
      setPasswordErr("password confirmation incorrect");
      return;
    }
    dispatch(clearCustomerInfo());
    setEmailErr("");
    setPasswordErr("");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, isSeller }),
        headers: { "Content-Type": "application/json", "csrf-token": token },
      });
      const data = await res.json();
      console.log(data);
      if (data.errors) {
        setEmailErr(data.errors.email);
        setPasswordErr(data.errors.password);
      }
      if (data.user) {
        dispatch(setTempEmail(email));
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-img">
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
            <p className="error">{passwordErr}</p>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>
          {isSeller && (
            <div>
              <PhoneNumberInput
                number={phoneNumber}
                setNumber={setPhoneNumber}
              />
              <p className="error">{phoneNumberErr}</p>
            </div>
          )}
          <button className="button-17" onClick={handleSignup}>
            Signup
          </button>
          <br />
          {!isSeller && <GoogleReg />}
        </form>
        <br />
        {tokenError && (
          <div>
            <h3 className="error">{tokenError}</h3>
            <h3 className="error">please login again</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
