import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  postOrdered,
  productsOrdered,
  selectAllInCart,
  selectAllOrdered,
  setOrderInfo,
  updateOrder,
} from "./shoppingCartSlice";
import { countNewOnhand } from "../products/productsSlice";
import { csrfTokenContext } from "../../contexts/csrfTokenContext";
import ConutryPicker from "../../components/CountryPicker";
import { PhoneNumberInput } from "../../components/PhoneInput";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import Loader from "../../components/Loader";
import { CONFIRM_AVAILABLE_URL } from "../utils/urlConstants";

const ConfirmOrderForm = () => {
  const token = useContext(csrfTokenContext);
  const info = useSelector((state) => state.shoppingCart.customerInfo);
  const userPhoneNumer = useSelector((state) => state.user.phoneNumber);
  const orderedInCart = useSelector(selectAllInCart);
  const currentOrdered = useSelector(selectAllOrdered);
  const infoAvailable = info && JSON.stringify(info) !== JSON.stringify({});
  const { firstName, lastName, adress } = infoAvailable
    ? info
    : { firstName: "", lastName: "", adress: "" };
  const userEmail = useSelector((state) => state.user.userEmail);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialForm = {
    firstName,
    lastName,
    adress,
  };

  const [formState, setFormState] = useState(initialForm);
  const [countryState, setCountryState] = useState({ country: "", region: "" });
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [phoneNumberErr, setPhoneNumberErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const VIPUser = useSelector((state) => state.user.isVIP);

  const handleChangeForm = (e) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const canSumbit =
    [
      formState.firstName,
      formState.lastName,
      formState.adress,
      userEmail,
      phoneNumber,
      countryState.country,
      countryState.region,
      formState.paymentMethod,
    ].every(Boolean) &&
    Number(phoneNumber) &&
    isPossiblePhoneNumber(phoneNumber);

  const invalidPhoneNumber =
    formState.paymentMethod === "onReceiving" &&
    formState.phoneNumber !== userPhoneNumer;

  const handleSubmitInfo = async () => {
    if (invalidPhoneNumber) {
      setPhoneNumberErr("please use your verified phone number");
      return;
    }
    if (!canSumbit) {
      setErr("Please fill the order info form");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(CONFIRM_AVAILABLE_URL, {
        method: "POST",
        body: JSON.stringify(orderedInCart),
        credentials: "include",
        headers: { "Content-Type": "application/json", "csrf-token": token },
      });
      const info = await res.json();
      if (info.err) {
        navigate(`/shoppingCart/${info.err}`);
        return;
      }
      dispatch(
        productsOrdered({
          userInfo: { ...formState, userEmail, ...countryState, phoneNumber },
          orderedInCart,
        })
      );
      dispatch(countNewOnhand(orderedInCart));
      navigate(`/products/ordered/${formState.paymentMethod}`);
      if (currentOrdered.length === 0) {
        dispatch(postOrdered({ token, VIPUser }));
        if (VIPUser && formState.paymentMethod === "onReceiving") {
          dispatch(
            setOrderInfo({ startedAt: new Date(Date.now()).toUTCString() })
          );
        }
      } else {
        dispatch(updateOrder({ isPaid: false, token }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-img">
      <div className="box-confirm">
        <form className="add-product-form" onSubmit={(e) => e.preventDefault()}>
          <label className="info-title">Customer info</label>
          <div className="input-container">
            <br />
            <input
              type="text"
              placeholder="first name"
              name="firstName"
              onChange={handleChangeForm}
              className="name"
              value={formState.firstName}
            />
          </div>
          <div className="input-container">
            <input
              type="text"
              placeholder="last name"
              name="lastName"
              onChange={handleChangeForm}
              className="name"
              value={formState.lastName}
            />
          </div>
          <div className="input-container">
            <input
              type="text"
              placeholder="adress"
              name="adress"
              onChange={handleChangeForm}
              className="adress"
              value={formState.adress}
            />
          </div>
          <div className="input-container">
            <h5 className="info-title">Payment Method</h5>
            <select name="paymentMethod" onChange={handleChangeForm}>
              <option value="">--</option>
              <option disabled={!VIPUser} value="onReceiving">
                on Receiving ☆VIP
              </option>
              <option value="checkout">checkout</option>
            </select>
          </div>
          <div className="input-container">
            <PhoneNumberInput number={phoneNumber} setNumber={setPhoneNumber} />
            <div className="error">{phoneNumberErr}</div>
          </div>
          <div className="input-container">
            <ConutryPicker
              countryState={countryState}
              setCountryState={setCountryState}
            />
          </div>
          {!loading ? (
            <button
              onClick={handleSubmitInfo}
              className="button-85"
              disabled={loading}
            >
              Confirm order
            </button>
          ) : (
            <Loader />
          )}
        </form>
        <b className="error">{err}</b>
      </div>
    </div>
  );
};

export default ConfirmOrderForm;
