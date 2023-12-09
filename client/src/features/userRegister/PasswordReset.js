import { useState, useRef } from "react";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [err, setErr] = useState("");
  const otpRef = useRef({});

  const handleReset = () => {
    if (!email || !email.includes("@") || !email.includes(".com")) {
      setErr("please type your email");
      return;
    }
    setShowOtp(true);
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
          <input
            type="text"
            placeholder="type your otp..."
            className="input-price"
            maxLength="6"
            ref={otpRef}
          />
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
