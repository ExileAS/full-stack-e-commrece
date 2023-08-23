import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  postOrdered,
  productsOrdered,
  selectAllInCart,
  selectAllOrdered,
  updateOrder,
} from "./shoppingCartSlice";
import { countNewOnhand } from "../products/productsSlice";

const ConfirmOrderForm = () => {
  const info = useSelector((state) => state.shoppingCart.customerInfo);
  const orderedInCart = useSelector(selectAllInCart);
  const currentOrdered = useSelector(selectAllOrdered);
  const infoAvailable = JSON.stringify(info) !== JSON.stringify({});
  const { firstName, lastName, adress, phoneNumber } = infoAvailable && info;
  const userEmail = useSelector((state) => state.user.userEmail);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const emptyForm = {
    firstName: "",
    lastName: "",
    adress: "",
    phoneNumber: "",
  };

  const initialForm = infoAvailable
    ? {
        firstName,
        lastName,
        adress,
        phoneNumber,
      }
    : emptyForm;

  const [formState, setFormState] = useState(initialForm);

  const changeFirstName = (e) =>
    setFormState((prev) => ({ ...prev, firstName: e.target.value }));
  const changeLasttName = (e) =>
    setFormState((prev) => ({ ...prev, lastName: e.target.value }));
  const changeAdress = (e) =>
    setFormState((prev) => ({ ...prev, adress: e.target.value }));
  const changePhoneNumber = (e) =>
    setFormState((prev) => ({ ...prev, phoneNumber: e.target.value }));

  const canSumbit =
    [
      formState.firstName,
      formState.lastName,
      formState.adress,
      formState.phoneNumber,
      userEmail,
    ].every(Boolean) && Number(formState.phoneNumber);

  const handleSubmitInfo = async () => {
    if (canSumbit) {
      dispatch(
        productsOrdered({
          userInfo: { ...formState, userEmail },
          orderedInCart,
        })
      );
      if (currentOrdered.length === 0) {
        await dispatch(postOrdered()).unwrap();
      } else {
        dispatch(updateOrder());
      }
      dispatch(countNewOnhand(orderedInCart));
      navigate("/products/ordered");
    }
  };

  return (
    <form className="add-product-form" onSubmit={(e) => e.preventDefault()}>
      <label className="confirm-title">Customer info</label>
      <br />
      <input
        type="text"
        placeholder="first name"
        value={formState.firstName}
        onChange={changeFirstName}
        className="name"
      />
      <input
        type="text"
        placeholder="last name"
        value={formState.lastName}
        onChange={changeLasttName}
        className="name"
      />
      <br />
      <br />
      <input
        type="text"
        placeholder="adress"
        value={formState.adress}
        onChange={changeAdress}
        className="adress"
      />
      <br />
      <input
        type="text"
        placeholder="phone number"
        value={formState.phoneNumber}
        onChange={changePhoneNumber}
        className="number"
      />
      <br />
      <button onClick={handleSubmitInfo} className="add-button-main">
        Confirm order
      </button>
    </form>
  );
};

export default ConfirmOrderForm;
