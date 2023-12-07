import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  postOrdered,
  productsOrdered,
  selectAllInCart,
  selectAllOrdered,
  setStartedAt,
  updateOrder,
} from "./shoppingCartSlice";
import { countNewOnhand } from "../products/productsSlice";
import { csrfTokenContext } from "../../contexts/csrfTokenContext";
import ConutryPicker from "../../components/CountryPicker";
import { PhoneNumberInput } from "../../components/PhoneInput";
import { isPossiblePhoneNumber } from "react-phone-number-input";

const ConfirmOrderForm = () => {
  const token = useContext(csrfTokenContext);
  const info = useSelector((state) => state.shoppingCart.customerInfo);
  const orderedInCart = useSelector(selectAllInCart);
  const currentOrdered = useSelector(selectAllOrdered);
  const infoAvailable = JSON.stringify(info) !== JSON.stringify({});
  const { firstName, lastName, adress } = infoAvailable && info;
  const userEmail = useSelector((state) => state.user.userEmail);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emptyForm = {
    firstName: "",
    lastName: "",
    adress: "",
    paymentMethod: "",
  };

  const initialForm = infoAvailable
    ? {
        firstName,
        lastName,
        adress,
      }
    : emptyForm;

  const [formState, setFormState] = useState(initialForm);
  const [countryState, setCountryState] = useState({ country: "", region: "" });
  const [phoneNumber, setPhoneNumber] = useState(null);
  const verifiedUser = useSelector((state) => state.user.verifiedUser);

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

  const handleSubmitInfo = async () => {
    if (canSumbit) {
      const res = await fetch("/api/confirmAvailable", {
        method: "POST",
        body: JSON.stringify(orderedInCart),
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
        dispatch(postOrdered({ token, verifiedUser }));
        if (verifiedUser && formState.paymentMethod === "onReceiving") {
          dispatch(setStartedAt(new Date(Date.now()).toUTCString()));
        }
      } else {
        dispatch(updateOrder(false));
      }
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
              <option disabled={!verifiedUser} value="onReceiving">
                on Receiving ☆VIP
              </option>
              <option value="checkout">checkout</option>
            </select>
          </div>
          <div className="input-container">
            <PhoneNumberInput number={phoneNumber} setNumber={setPhoneNumber} />
          </div>
          <div className="input-container">
            <ConutryPicker
              countryState={countryState}
              setCountryState={setCountryState}
            />
          </div>
          <button onClick={handleSubmitInfo} className="button-85">
            Confirm order
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmOrderForm;
