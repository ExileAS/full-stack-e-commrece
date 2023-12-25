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
import useFetch from "../utils/useFetch";

const PasswordReset = () => {
  const token = useContext(csrfTokenContext);
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [info, setInfo] = useState();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [otpRemaining, setOtpRemaining] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const remainingAttempts = useSelector(
    (state) => state.user.resetAttemptsRemaining
  );
  const otpRef = useRef({});
  const { id } = useParams();
  const { resErr, setResErr, loading, fetchGetPost, successInfo } = useFetch();

  const handleReset = async () => {
    if (!email || !email.includes("@") || !email.includes(".com")) {
      setResErr("please type your email");
      return;
    }
    if (remainingAttempts <= 0) {
      setResErr("too many attempts \n try again later");
      return;
    }
    try {
      const data = await fetchGetPost(RESET_URL, {
        body: { email: email, resetId: id },
        token,
      });
      if (data.user) {
        setInfo(`reset otp sent to ${email}`);
        setShowOtp(true);
        dispatch(setRemainingAttempts(data.remainingAttempts));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleOTP = async () => {
    if (otpRef.current.value.length === 6) {
      try {
        const data = await fetchGetPost(VERIFY_RESET_OTP_URL, {
          body: { email: email, otp: otpRef.current?.value },
          token,
        });
        if (data.success) {
          setInfo(data.success);
          setShowOtp(false);
        }
        if (data.remainingAttempts) {
          setOtpRemaining(data.remainingAttempts);
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
        const data = await fetchGetPost(RESET_CONFIRM_URL, {
          body: { email, password },
          token,
        });
        if (data.user) {
          setInfo("password reset success");
          navigate("/login");
        }
        return data;
      } catch (err) {
        console.log(err);
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
        {successInfo && <h3 className="info">{info}</h3>}
        {typeof resErr === "string" && <p className="error">{resErr}</p>}
        {!loading && (
          <div>
            {showOtp && otpRemaining > 0 && (
              <div>
                <input
                  type="number"
                  placeholder="type your otp..."
                  className="input-otp"
                  maxLength="6"
                  ref={otpRef}
                  onChange={handleOTP}
                />
                <br />
                {otpRemaining && (
                  <p className="error">Remaining Attempts: {otpRemaining}</p>
                )}
              </div>
            )}
            {!successInfo && remainingAttempts > 0 && (
              <div>
                <button className="button-7" onClick={handleReset}>
                  Send
                </button>
              </div>
            )}
          </div>
        )}
        <br />
        {!successInfo && (
          <p className="error">
            Remaining Resend Attempts: {remainingAttempts}
          </p>
        )}
        <div>
          {successInfo && (
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
