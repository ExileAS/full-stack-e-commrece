import { useEffect, useState } from "react";
import OrderedProductsList from "./OrderedProductList";
import { useDispatch, useSelector } from "react-redux";
import { confirmPayment, setStartedAt, updateOrder } from "./shoppingCartSlice";
import { useParams } from "react-router-dom";
import { setOrderId } from "../userRegister/userSlice";
import exponentialBackoff from "../utils/exponentialBackoff";
import { CONFIRM_PAYMENT_URL } from "../utils/urlConstants";

const PaymentConfirmed = () => {
  const confirmId = useSelector(
    (state) => state.shoppingCart.payedId || state.shoppingCart.confirmId
  );
  const startedAt = useSelector(
    (state) => state.shoppingCart.shipmentStartedAt
  );
  const orderId = useSelector((state) => state.user.userOrderId);
  const currUser = useSelector((state) => state.user.userEmail);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [confirmErr, setConfirmErr] = useState("");

  useEffect(() => {
    if (orderId === id) {
      exponentialBackoff(confirmOrderPayment);
    }

    async function confirmOrderPayment() {
      console.log("SENDING");
      dispatch(setOrderId(null));
      dispatch(confirmPayment());
      try {
        await dispatch(updateOrder(true)).unwrap();
        const res = await fetch(CONFIRM_PAYMENT_URL, {
          method: "POST",
          body: JSON.stringify({ confirmId, currUser }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.startedAt) dispatch(setStartedAt(data.startedAt));
        return data;
      } catch (err) {
        setConfirmErr(err.message);
      }
    }
  }, [currUser, confirmId, dispatch, id, orderId]);

  return (
    <div>
      <OrderedProductsList confirmed={true} />
      <h2 className="payment-confirm">Payment confirmed</h2>
      <b className="payment-confirm">Order Id: {confirmId}</b>
      {!confirmErr && (
        <div className="payment-confirm">shipment started at {startedAt}</div>
      )}
      <h3 className="error">{confirmErr}</h3>
    </div>
  );
};

export default PaymentConfirmed;
