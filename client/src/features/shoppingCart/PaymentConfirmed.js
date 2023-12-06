import { useEffect, useState } from "react";
import OrderedProductsList from "./OrderedProductList";
import { useDispatch, useSelector } from "react-redux";
import { confirmPayment, setPayedId, updateOrder } from "./shoppingCartSlice";
import { useParams } from "react-router-dom";
import { setOrderId } from "../userRegister/userSlice";

const PaymentConfirmed = () => {
  const confirmId = useSelector(
    (state) => state.shoppingCart.payedId || state.shoppingCart.confirmId
  );
  const test = useSelector((state) => state.shoppingCart.confirmId);
  const test2 = useSelector((state) => state.shoppingCart.payedId);
  console.log(test, test2);
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
        const data = res.json();
        if (data.err) setConfirmErr(data.err);
        if (data.confirmId) setPayedId(data.confirmId);
      } catch (err) {
        setConfirmErr(err);
      }
    }
  }, [currUser, confirmId, dispatch, id, orderId]);

  return (
    <div>
      <OrderedProductsList confirmed={true} />
      <h2 className="payment-confirm">Payment confirmed</h2>
      {!confirmErr && <div>shipment started at</div>}
      <b className="payment-confirm">Order Id: {confirmId}</b>
      <h3>{confirmErr}</h3>
    </div>
  );
};

export default PaymentConfirmed;
