import { useEffect, useState } from "react";
import OrderedProductsList from "./OrderedProductList";
import { useDispatch, useSelector } from "react-redux";
import { confirmPayment, setStartedAt, updateOrder } from "./shoppingCartSlice";
import { useParams } from "react-router-dom";
import { setOrderId } from "../userRegister/userSlice";

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
      confirmOrderPayment();
    }

    async function confirmOrderPayment() {
      console.log("SENDING");
      dispatch(setOrderId(null));
      dispatch(confirmPayment());
      try {
        await dispatch(updateOrder(true)).unwrap();
        const res = await fetch("/api/confirmPayment", {
          method: "POST",
          body: JSON.stringify({ confirmId, currUser }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        console.log(data);
        if (data.err)
          setConfirmErr(data.err || "unknown error try again later");
        if (data.startedAt) dispatch(setStartedAt(data.startedAt));
      } catch (err) {
        setConfirmErr(err.message);
      }
    }
  }, [currUser, confirmId, dispatch, id, orderId]);

  return (
    <div>
      <OrderedProductsList confirmed={true} />
      <h2 className="payment-confirm">Payment confirmed</h2>
      {!confirmErr && (
        <div className="payment-confirm">shipment started at {startedAt}</div>
      )}
      <b className="payment-confirm">Order Id: {confirmId}</b>
      <h3 className="error">{confirmErr}</h3>
    </div>
  );
};

export default PaymentConfirmed;
