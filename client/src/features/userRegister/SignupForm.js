import { useContext, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCustomerInfo } from "../shoppingCart/shoppingCartSlice";
import GoogleReg from "./GoogleReg";
import { useLocation, useNavigate } from "react-router-dom";
import { setSellerPhone, setTempEmail } from "./userSlice";
import { csrfTokenContext } from "../../contexts/csrfTokenContext";
import { PhoneNumberInput } from "../../components/PhoneInput";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import {
  RESEND_OTP_SELLER_URL,
  SELLER_SIGNUP_URL,
  SIGNUP_URL,
  VERIFY_OTP_URL,
} from "../utils/urlConstants";
import SignupInputs from "../../components/SignupInputs";
import OtpField from "../../components/OtpField";
import Loader from "../../components/Loader";
import ResendButton from "../../components/ResendButton";
import Timer from "../../components/Timer";

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
  const [companyName, setCompanyName] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyErr, setVerifyErr] = useState("");
  const [response, setResponse] = useState("");
  const [timer, setTimer] = useState("15");
  const otpRef = useRef({});
  const currUser = useSelector((state) => state.user.tempEmail);
  const currPhoneNum = useSelector((state) => state.user.phoneNumber);
  const location = useLocation();
  const isSeller = location.pathname === "/signupSeller";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const canSubmitSeller = phoneNumber && isPossiblePhoneNumber(phoneNumber);
  const handleSignup = async () => {
    if (isSeller && !canSubmitSeller) {
      setPhoneNumberErr("please enter a valid phone number");
      return;
    }
    if (password !== passwordConfirm) {
      setPasswordErr("password confirmation incorrect");
      return;
    }
    dispatch(clearCustomerInfo());
    setEmailErr("");
    setPasswordErr("");
    const url = isSeller ? SELLER_SIGNUP_URL : SIGNUP_URL;
    const options = isSeller
      ? { email, password, phoneNumber, companyName: companyName || "none" }
      : { email, password };
    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(options),
        headers: { "Content-Type": "application/json", "csrf-token": token },
      });
      const data = await res.json();
      console.log(data);
      if (data.errors) {
        setEmailErr(data.errors.email);
        setPasswordErr(data.errors.password);
        if (!data.errors["email"] && !data.errors["password"]) {
          setEmailErr(data.err);
        }
      }
      if (data.user) {
        dispatch(setTempEmail(email));
        navigate("/login");
      }
      if (data.seller) {
        setShowOtp(true);
        dispatch(setTempEmail(email));
        dispatch(setSellerPhone(phoneNumber));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePhoneOTP = async () => {
    if (otpRef.current.value.length !== 8) {
      return;
    }
    setLoading(true);
    setVerifyErr("");
    try {
      const res = await fetch(VERIFY_OTP_URL, {
        method: "POST",
        body: JSON.stringify({
          email: currUser,
          otp: otpRef.current?.value,
          isSeller,
        }),
        headers: { "Content-Type": "application/json", "csrf-token": token },
      });
      const data = await res.json();
      if (data.success) {
        setResponse(data.success);
        dispatch(setTempEmail(currUser));
        const res = await fetch(SIGNUP_URL, {
          method: "POST",
          body: JSON.stringify({ email: currUser, isSeller }),
          headers: { "Content-Type": "application/json", "csrf-token": token },
        });
        const info = await res.json();
        if (info.err) {
          setTempEmail(null);
        }
        navigate("/loginSeller");
      }
      if (data.err) {
        setVerifyErr(data.err);
        if (data.err !== "wrong otp") {
          dispatch(setTempEmail(null));
        }
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOtpResend = async () => {
    setTimer("15");
    try {
      const res = await fetch(RESEND_OTP_SELLER_URL, {
        method: "POST",
        body: JSON.stringify({ email: currUser }),
        headers: { "Content-Type": "application/json", "csrf-token": token },
      });
      const data = await res.json();
      if (data.err) {
        setVerifyErr(data.err);
      }
      if (data.success) {
        setResponse(data.success);
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
          <SignupInputs
            email={email}
            setEmail={setEmail}
            emailErr={emailErr}
            password={password}
            setPassword={setPassword}
            passwordErr={passwordErr}
            passwordConfirm={passwordConfirm}
            setPasswordConfirm={setPasswordConfirm}
          />
          {isSeller && (
            <div>
              <label className="phone">Phone Number</label>
              <PhoneNumberInput
                number={phoneNumber}
                setNumber={setPhoneNumber}
              />
              <p className="error">{phoneNumberErr}</p>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="company name"
              />
            </div>
          )}
          {!loading && !currUser && (
            <button className="button-17" onClick={handleSignup}>
              Signup
            </button>
          )}
          <br />
          {!isSeller && <GoogleReg />}
          <div className="otp-container">
            {currUser && isSeller && (
              <>
                {loading ? (
                  <Loader />
                ) : (
                  <OtpField handleOTP={handlePhoneOTP} otpRef={otpRef} />
                )}
              </>
            )}
            <div className="confirmed">{response}</div>
            <p className="error">{verifyErr}</p>
          </div>
        </form>
        <br />
        {isSeller && (
          <div>
            {currUser && (
              <div>
                <br />
                <h2 className="timer-title">verification sent to </h2>
                <p className="confirmed">******{currPhoneNum.substring(6)}</p>
                <br />
              </div>
            )}
            {showOtp && Number(timer) > 0 && (
              <Timer
                start={Boolean(currUser)}
                timer={timer}
                setTimer={setTimer}
              />
            )}
            {(timer === "00" || !timer) && (
              <ResendButton handleResend={handleOtpResend} />
            )}
          </div>
        )}
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
