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
  const currUser = useSelector((state) => state.user.userEmail);
  const dispatch = useDispatch();
  const { id } = useParams();
  console.log(confirmId);

  useEffect(() => {
    if (orderId === id) {
      dispatch(confirmPayment());
      dispatch(updateOrder(true));

      fetch("/api/confirmPayment", {
        method: "POST",
        body: JSON.stringify({ confirmId, currUser }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          dispatch(setOrderId(null));
          return res.json();
        })
        .then((res) => console.log("Confirmed"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <OrderedProductsList confirmed={true} />
      <h2 className="payment-confirm">Payment confirmed</h2>
      <b className="payment-confirm">Order Id: {confirmId}</b>
    </div>
  );
};

export default PaymentConfirmed;
