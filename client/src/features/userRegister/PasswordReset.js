import { useState, useRef, useContext } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { csrfTokenContext } from "../../contexts/csrfTokenContext";

const PasswordReset = () => {
  const token = useContext(csrfTokenContext);
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [err, setErr] = useState("");
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

    const res = await fetch("/api/resetUserPass", {
      method: "POST",
      body: JSON.stringify({ email: email, resetId: id }),
      headers: { "Content-Type": "application/json", "csrf-token": token },
    });
    const data = await res.json();
    console.log(data);
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
        {showOtp && (
          <div>
            <input
              type="text"
              placeholder="type your otp..."
              className="input-price"
              maxLength="6"
              ref={otpRef}
            />
            <b>Remaining Attempts: {remainingAttempts}</b>
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
    </div>
  );
};

export default PasswordReset;
