import { useContext, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, setRemainingAttempts, setTempEmail } from "./userSlice";
import { retrieveOrderedList } from "../shoppingCart/shoppingCartSlice";
import GoogleReg from "./GoogleReg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { csrfTokenContext } from "../../contexts/csrfTokenContext";
import Timer from "../../components/Timer";
import exponentialBackoff from "../utils/exponentialBackoff";
import {
  LOGIN_URL,
  RESEND_URL,
  VERIFY_OTP_URL,
  REQUIRE_RESET_URL,
  SELLER_LOGIN_URL,
} from "../utils/urlConstants";
import OtpField from "../../components/OtpField";
import ResendButton from "../../components/ResendButton";
import LoginInputs from "../../components/LoginInputs";
import Loader from "../../components/Loader";

const Login = () => {
  const token = useContext(csrfTokenContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErr, setEmailError] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [verifyErr, setVerifyErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotOption, setForgotOption] = useState(false);
  const [response, setResponse] = useState("");
  const [timer, setTimer] = useState("15");
  const otpRef = useRef({});
  const { err } = useParams();
  const showErr = err === "timeout" || err === "token expired";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currUser = useSelector((state) => state.user.tempEmail);
  const location = useLocation();
  const isSeller = location.pathname === "/loginSeller";

  const handleLogin = () => {
    if (email.length === 0 || password.length === 0) {
      return;
    }
    setEmailError("");
    setPasswordErr("");
    dispatch(setTempEmail(null));
    const url = isSeller ? SELLER_LOGIN_URL : LOGIN_URL;
    exponentialBackoff(async () => {
      try {
        const res = await fetch(url, {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: {
            "Content-Type": "application/json",
            "csrf-token": token,
          },
        });
        const data = await res.json();

        if (data.errors) {
          setEmailError(data.errors.email);
          setPasswordErr(data.errors.password);
          if (data.errors.password) setForgotOption(true);
        }
        if (data.unverifiedEmail) {
          setVerifyErr("please verify your account");
          dispatch(setTempEmail(data.unverifiedEmail));
        }
        if (data.user) {
          dispatch(login(data));
          navigate("/products");
          dispatch(retrieveOrderedList(data.user));
        }
        return data;
      } catch (err) {
        console.log(err);
      }
    });
  };

  const handleOTP = async () => {
    if (otpRef.current.value.length !== 6) {
      return;
    }
    setLoading(true);
    setVerifyErr("");
    try {
      const res = await fetch(VERIFY_OTP_URL, {
        method: "POST",
        body: JSON.stringify({ email: currUser, otp: otpRef.current?.value }),
        headers: { "Content-Type": "application/json", "csrf-token": token },
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setResponse(data.success);
        dispatch(setTempEmail(null));
      }
      if (data.err) {
        setVerifyErr(data.err);
        if (data.err !== "wrong otp") {
          dispatch(setTempEmail(null));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleResend = async () => {
    setTimer("15");
    try {
      const res = await fetch(RESEND_URL, {
        method: "POST",
        body: JSON.stringify({ email: currUser }),
        headers: { "Content-Type": "application/json", "csrf-token": token },
      });
      const data = await res.json();
      if (data.err) {
        setVerifyErr(data.err);
        dispatch(setTempEmail(null));
      }
      if (data.success) {
        setResponse(data.success);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleReset = async () => {
    if (!email) {
      setEmailError("please type your email");
      return;
    }
    try {
      const res = await fetch(REQUIRE_RESET_URL, {
        method: "POST",
        body: JSON.stringify({ email: email }),
        headers: { "Content-Type": "application/json", "csrf-token": token },
      });
      const data = await res.json();
      if (res.status === 301) {
        if (data.id && data.remainingAttempts) {
          dispatch(setRemainingAttempts(data.remainingAttempts));
          if (data.remainingAttempts > 0) {
            navigate(`/passowrd-reset/${data.id}`);
          }
        }
      }
      if (data.err) {
        setVerifyErr(data.err);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-img">
      <div className="box">
        <form onSubmit={(e) => e.preventDefault()}>
          <span className="text-center">Login</span>
          <LoginInputs
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            passwordErr={passwordErr}
            emailErr={emailErr}
          />
          {forgotOption && !verifyErr.length && (
            <div className="forgot" onClick={handleReset}>
              <b>Forgot Password</b>
            </div>
          )}
          <button className="button-17" onClick={handleLogin}>
            Login
          </button>
          {!isSeller && <GoogleReg />}
        </form>
        <br />
        <div className="otp-container">
          {currUser && (
            <>
              {loading ? (
                <Loader />
              ) : (
                <OtpField handleOTP={handleOTP} otpRef={otpRef} />
              )}
            </>
          )}
          <div className="confirmed">{response}</div>
          <p className="error">{verifyErr}</p>
        </div>
        {currUser && (
          <div>
            <br />
            <h2 className="timer-title">verification sent to </h2>
            <p className="confirmed">
              ******{currUser.substring(currUser.indexOf("@") - 3)}
            </p>
            <br />
            {currUser && Number(timer) > 0 && (
              <Timer
                start={Boolean(currUser)}
                timer={timer}
                setTimer={setTimer}
              />
            )}
            {(timer === "00" || !timer) && (
              <ResendButton handleResend={handleResend} />
            )}
          </div>
        )}
        {showErr && (
          <div>
            <h2 className="error">{err}</h2>
            <h2 className="error">please login again</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
