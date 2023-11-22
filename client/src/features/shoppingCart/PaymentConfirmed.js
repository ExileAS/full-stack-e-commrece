import { useEffect } from "react";
import OrderedProductsList from "./OrderedProductList";
import { useDispatch, useSelector } from "react-redux";
import { confirmPayment, updateOrder } from "./shoppingCartSlice";
import { useParams } from "react-router-dom";
import { setOrderId } from "../userRegister/userSlice";
const PaymentConfirmed = () => {
  const confirmId = useSelector(
    (state) => state.shoppingCart.payedId || state.shoppingCart.confirmId
  );
  const orderId = useSelector((state) => state.user.userOrderId);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (orderId === id) {
      dispatch(confirmPayment());
      console.log("PAYMENT CONFIRMED!!");
      dispatch(updateOrder(true));
      fetch("/api/confirmPayment", {
        method: "POST",
        body: JSON.stringify({ confirmId }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          dispatch(setOrderId(null));
          return res.json();
        })
        .then((res) => console.log("Confirmed"));
    }
  }, [dispatch, confirmId, id, orderId]);

  return (
    <div>
      <OrderedProductsList confirmed={true} />
      <h2 className="payment-confirm">Payment confirmed</h2>
      <b className="payment-confirm">Order Id: {confirmId}</b>
    </div>
  );
};

export default PaymentConfirmed;
