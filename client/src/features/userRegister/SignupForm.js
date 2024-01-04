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
  RESEND_URL,
  SELLER_SIGNUP_URL,
  SIGNUP_URL,
  VERIFY_SELLER_PHONE_URL,
} from "../utils/urlConstants";
import SignupInputs from "../../components/SignupInputs";
import OtpField from "../../components/OtpField";
import Loader from "../../components/Loader";
import ResendButton from "../../components/ResendButton";
import Timer from "../../components/Timer";
import useFetch from "../utils/useFetch";

const SignUp = ({ err }) => {
  const tokenError = typeof err === "string" ? err : "";
  const token = useContext(csrfTokenContext);
  console.log(token);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [phoneNumberErr, setPhoneNumberErr] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [timer, setTimer] = useState("15");
  const otpRef = useRef({});
  const currUser = useSelector((state) => state.user.tempEmail);
  const currIsSeller = useSelector((state) => state.user.currIsSeller);
  const currPhoneNum = useSelector((state) => state.user.phoneNumber);
  const location = useLocation();
  const isSeller = location.pathname === "/signupSeller";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fetchGetPost, loading, setResErr, resErr, successInfo } = useFetch();

  const canSubmitSeller = phoneNumber && isPossiblePhoneNumber(phoneNumber);

  const handleSignup = async () => {
    if (isSeller && !canSubmitSeller) {
      setPhoneNumberErr("please enter a valid phone number");
      return;
    }
    if (password !== passwordConfirm) {
      setResErr({ password: "password confirmation incorrect" });
      return;
    }
    dispatch(clearCustomerInfo());
    const url = isSeller ? SELLER_SIGNUP_URL : SIGNUP_URL;
    const options = isSeller
      ? { email, password, phoneNumber, companyName: companyName || "none" }
      : { email, password };
    try {
      const data = await fetchGetPost(url, {
        body: options,
        token,
      });
      if (data.user) {
        dispatch(setTempEmail(email));
        navigate("/login");
      }
      if (data.seller) {
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
    try {
      const data = await fetchGetPost(VERIFY_SELLER_PHONE_URL, {
        body: {
          email: currUser,
          otp: otpRef.current?.value,
        },
        token,
      });
      if (data.info) {
        await fetchGetPost(RESEND_URL, {
          body: { email: currUser, isSeller },
          token,
        });
        navigate("/loginSeller");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleOtpResend = async () => {
    setTimer("15");
    try {
      const data = await fetchGetPost(RESEND_OTP_SELLER_URL, {
        body: { email: currUser },
        token,
      });
      if (data.err) {
        setResErr(data.err);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-img">
      <div className="box">
        <form onSubmit={(e) => e.preventDefault()}>
          <span className="text-center">
            Signup {isSeller && "As a Seller"}
          </span>
          <SignupInputs
            email={email}
            setEmail={setEmail}
            emailErr={resErr.email}
            password={password}
            setPassword={setPassword}
            passwordErr={resErr.password}
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
          {!loading && (
            <button className="button-17" onClick={handleSignup}>
              Signup
            </button>
          )}
          <br />
          {!isSeller && <GoogleReg />}
          <div className="otp-container">
            {currIsSeller && (
              <>
                {loading ? (
                  <Loader />
                ) : (
                  <OtpField handleOTP={handlePhoneOTP} otpRef={otpRef} />
                )}
              </>
            )}
            <div className="confirmed">{successInfo}</div>
            {typeof resErr === "string" && <p className="error">{resErr}</p>}
          </div>
        </form>
        <br />
        {isSeller && (
          <div>
            {currUser && (
              <div>
                <br />
                {currPhoneNum && (
                  <>
                    <h2 className="timer-title">verification sent to </h2>
                    <p className="confirmed">
                      ******{currPhoneNum.substring(6)}
                    </p>
                  </>
                )}
                <br />
              </div>
            )}
            {currIsSeller && Number(timer) > 0 && (
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
