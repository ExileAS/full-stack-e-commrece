import { useState, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { csrfTokenContext } from "../../contexts/csrfTokenContext";
import { setRemainingAttempts } from "./userSlice";

const PasswordReset = () => {
  const token = useContext(csrfTokenContext);
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
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

    const res = await fetch("/api/resetUserPass", {
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
      const res = await fetch("/api/otp-passwordReset", {
        method: "POST",
        body: JSON.stringify({ email: email, otp: otpRef.current?.value }),
        headers: { "Content-Type": "application/json", "csrf-token": token },
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setInfo(data.success);
        setShowOtp(false);
      }
      if (data.err) {
        setErr(data.err);
      }
    }
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
            {showOtp && (
              <div>
                <h3 className="info">{info}</h3>
                <input
                  type="number"
                  placeholder="type your otp..."
                  className="input-price"
                  maxLength="6"
                  ref={otpRef}
                  onChange={handleOTP}
                />
              </div>
            )}
            {!showOtp && (
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
        <b className="error">Remaining Attempts: {remainingAttempts}</b>
      </div>
    </div>
  );
};

export default PasswordReset;
