import { useContext, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, setRemainingAttempts, setTempEmail } from "./userSlice";
import {
  clearCustomerInfo,
  retrieveOrderedList,
} from "../shoppingCart/shoppingCartSlice";
import GoogleReg from "./GoogleReg";
import { useNavigate, useParams } from "react-router-dom";
import { csrfTokenContext } from "../../contexts/csrfTokenContext";
import Timer from "../../components/Timer";

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

  const handleLogin = async () => {
    dispatch(clearCustomerInfo());
    setEmailError("");
    setPasswordErr("");

    dispatch(setTempEmail(null));
    if (email.length > 0 && password.length > 0) {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: { "Content-Type": "application/json", "csrf-token": token },
        });
        const data = await res.json();

        if (data.errors) {
          setEmailError(data.errors.email);
          setPasswordErr(data.errors.password);
          console.log(data.errors);
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
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleOTP = async () => {
    if (otpRef.current.value.length === 6) {
      setLoading(true);
      setVerifyErr("");
      const res = await fetch("/api/verifyOTP", {
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
    }
  };
  const handleResend = async () => {
    setTimer("15");
    const res = await fetch("/api/resend", {
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
  };

  const handleReset = async () => {
    if (!email) {
      setEmailError("please type your email");
      return;
    }

    const res = await fetch("/api/api/requireReset", {
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
            <p className="error">{passwordErr}</p>
          </div>
          {forgotOption && !verifyErr.length && (
            <div className="forgot" onClick={handleReset}>
              <b>Forgot Password</b>
            </div>
          )}
          <button className="button-17" onClick={handleLogin}>
            Login
          </button>
          <GoogleReg />
        </form>
        <br />
        <div className="otp-container">
          {currUser && (
            <>
              {loading && <h2 className="sent">Loading...</h2>}
              {!loading && currUser && (
                <input
                  type="number"
                  placeholder="type your otp..."
                  className="input-otp"
                  maxLength="6"
                  onChange={handleOTP}
                  ref={otpRef}
                />
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
              <button
                style={{
                  textAlign: "center",
                  marginLeft: "24px",
                }}
                className="button-7"
                onClick={handleResend}
              >
                Resend
              </button>
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
