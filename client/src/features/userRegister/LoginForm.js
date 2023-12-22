import React, { useCallback, useContext, useRef, useState } from "react";
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
  VERIFY_SELLER_EMAIL_OTP_URL,
} from "../utils/urlConstants";
import OtpField from "../../components/OtpField";
import ResendButton from "../../components/ResendButton";
import LoginInputs from "../../components/LoginInputs";
import Loader from "../../components/Loader";
import useFetch from "../utils/useFetch";

const Login = () => {
  const token = useContext(csrfTokenContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [timer, setTimer] = useState("15");
  const otpRef = useRef({});
  const { err } = useParams();
  const showErr = err === "timeout" || err === "token expired";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currUser = useSelector((state) => state.user.tempEmail);
  const location = useLocation();
  const isSeller = location.pathname === "/loginSeller";
  const { fetchGetPost, loading, setResErr, resErr, successInfo } = useFetch();

  const handleLogin = () => {
    if (!email.length || !password.length) {
      setResErr({
        email: !email.length && "please type your email",
        password: !password.length && "please type your password",
      });
      return;
    }
    dispatch(setTempEmail(null));
    const url = isSeller ? SELLER_LOGIN_URL : LOGIN_URL;
    exponentialBackoff(async () => {
      try {
        const data = await fetchGetPost(url, {
          body: { email, password },
          token,
        });
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

  const handleOTP = useCallback(async () => {
    if (otpRef.current.value.length !== 6) {
      return;
    }
    const url = isSeller ? VERIFY_SELLER_EMAIL_OTP_URL : VERIFY_OTP_URL;
    try {
      const data = await fetchGetPost(url, {
        body: { email: currUser, otp: otpRef.current?.value },
        token,
      });
      if (data.info || (resErr && resErr !== "wrong OTP")) {
        dispatch(setTempEmail(null));
      }
    } catch (err) {
      console.log(err);
    }
  }, [currUser, dispatch, fetchGetPost, isSeller, resErr, token]);

  const handleResend = async () => {
    setTimer("15");
    try {
      const data = await fetchGetPost(RESEND_URL, {
        body: { email: currUser },
        token,
      });
      if (data.err) {
        dispatch(setTempEmail(null));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleReset = async () => {
    if (!email) {
      setResErr({ ...resErr, email: "please type your email" });
      return;
    }
    try {
      const data = await fetchGetPost(REQUIRE_RESET_URL, {
        body: { email: email },
        token,
      });
      if (data.id && data.remainingAttempts) {
        dispatch(setRemainingAttempts(data.remainingAttempts));
        if (data.remainingAttempts > 0) {
          navigate(`/passowrd-reset/${data.id}`);
        }
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
            passwordErr={resErr.password}
            emailErr={resErr.email}
          />
          {resErr.password && (
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
          <div className="confirmed">{successInfo}</div>
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
        {typeof resErr === "string" && <b className="error">{resErr}</b>}
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
