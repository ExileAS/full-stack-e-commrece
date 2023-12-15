import { useState, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { csrfTokenContext } from "../../contexts/csrfTokenContext";
import { setRemainingAttempts } from "./userSlice";
import exponentialBackoff from "../utils/exponentialBackoff";
import {
  RESET_URL,
  RESET_CONFIRM_URL,
  VERIFY_RESET_OTP_URL,
} from "../utils/urlConstants";

const PasswordReset = () => {
  const token = useContext(csrfTokenContext);
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState();
  const [loading, setLoading] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const remainingAttempts = useSelector(
    (state) => state.user.resetAttemptsRemaining
  );
  const otpRef = useRef({});
  const { id } = useParams();

  const handleReset = async () => {
    if (!email || !email.includes("@") || !email.includes(".com")) {
      setErr("please type your email");
      return;
    }
    if (remainingAttempts <= 0) {
      setErr("too many attempts \n try again later");
      return;
    }

    const res = await fetch(RESET_URL, {
      method: "POST",
      body: JSON.stringify({ email: email, resetId: id }),
      headers: { "Content-Type": "application/json", "csrf-token": token },
    });
    const data = await res.json();
    console.log(data);
    if (data.user) {
      setInfo(`reset otp sent to ${email}`);
      setShowOtp(true);
      dispatch(setRemainingAttempts(data.remainingAttempts));
    }
    if (data.err) {
      setErr(data.err);
    }
  };

  const handleOTP = async () => {
    if (otpRef.current.value.length === 6) {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(VERIFY_RESET_OTP_URL, {
          method: "POST",
          body: JSON.stringify({ email: email, otp: otpRef.current?.value }),
          headers: { "Content-Type": "application/json", "csrf-token": token },
        });
        const data = await res.json();
        setLoading(false);
        if (data.success) {
          setOtpSuccess(true);
          setInfo(data.success);
          setShowOtp(false);
        }
        if (data.err) {
          setErr(data.err);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handlePasswordReset = () => {
    if (password !== passwordConfirm) {
      setPasswordErr("password confirmation incorrect");
      return;
    }
    exponentialBackoff(async () => {
      try {
        const res = await fetch(RESET_CONFIRM_URL, {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: { "Content-Type": "application/json", "csrf-token": token },
        });
        const data = await res.json();
        if (data.user) {
          setInfo("password reset success");
          navigate("/login");
          return data.user;
        }
        if (data.err) {
          setErr(data.err);
        }
      } catch (err) {
        console.log(err);
        return {
          err,
        };
      }
    });
  };

  return (
    <div className="bg-img">
      <div className="box">
        <span className="text-center">password reset</span>
        <br />
        <div className="input-container">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="email">Email</label>
        </div>
        {!loading && (
          <div>
            <h3 className="info">{info}</h3>
            {showOtp && (
              <div>
                <input
                  type="number"
                  placeholder="type your otp..."
                  className="input-otp"
                  maxLength="6"
                  ref={otpRef}
                  onChange={handleOTP}
                />
              </div>
            )}
            {!showOtp && !otpSuccess && (
              <div>
                <button className="button-7" onClick={handleReset}>
                  Send
                </button>
                <p className="error">{err}</p>
              </div>
            )}
          </div>
        )}
        <br />
        {!otpSuccess && (
          <b className="error">Remaining Attempts: {remainingAttempts}</b>
        )}
        <div>
          {otpSuccess && (
            <div className="input-container">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              <label htmlFor="password">Password</label>
              <p className="error">{passwordErr}</p>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              <br />
              <div className="confirm-reset">
                <button className="button-85" onClick={handlePasswordReset}>
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
