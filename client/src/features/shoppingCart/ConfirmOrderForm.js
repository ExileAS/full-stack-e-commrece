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
      dispatch(countNewOnhand(orderedInCart));
      navigate("/products/ordered");
      if (currentOrdered.length === 0) {
        dispatch(postOrdered());
      } else {
        dispatch(updateOrder());
      }
    }
  };

  return (
    <div className="bg-img">
      <div className="box-confirm">
        <form className="add-product-form" onSubmit={(e) => e.preventDefault()}>
          <div className="input-container">
            <label>Customer info</label>
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
            <input
              type="text"
              placeholder="phone number"
              name="phoneNumber"
              onChange={handleChangeForm}
              className="number"
              value={formState.phoneNumber}
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
