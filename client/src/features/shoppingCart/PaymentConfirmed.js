import { useContext, useEffect, useState } from "react";
import OrderedProductsList from "./OrderedProductList";
import { useDispatch, useSelector } from "react-redux";
import { confirmPayment, setOrderInfo, updateOrder } from "./shoppingCartSlice";
import { useParams } from "react-router-dom";
import { setOrderId } from "../userRegister/userSlice";
import exponentialBackoff from "../utils/exponentialBackoff";
import {
  CONFIRM_PAYMENT_URL,
  UPDATE_USER_ORDERS_URL,
} from "../utils/urlConstants";
import { csrfTokenContext } from "../../contexts/csrfTokenContext";

const PaymentConfirmed = () => {
  const token = useContext(csrfTokenContext);
  const confirmId = useSelector(
    (state) => state.shoppingCart.payedId || state.shoppingCart.confirmId
  );
  const startedAt = useSelector(
    (state) => state.shoppingCart.shipmentStartedAt
  );
  const totalPayment = useSelector((state) => state.shoppingCart.totalPayment);
  const totalDiscount = useSelector((state) => state.user.totalDiscount);
  const orderId = useSelector((state) => state.user.userOrderId);
  const currUser = useSelector((state) => state.user.userEmail);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [confirmErr, setConfirmErr] = useState("");

  useEffect(() => {
    if (orderId === id && token) {
      exponentialBackoff(confirmOrderPayment, "Confirm payment")
        .then(updateUserOrders)
        .catch(setConfirmErr);
    }

    async function confirmOrderPayment() {
      dispatch(setOrderId(null));
      dispatch(confirmPayment());
      try {
        await dispatch(updateOrder({ isPaid: true, token })).unwrap();
        const res = await fetch(CONFIRM_PAYMENT_URL, {
          method: "POST",
          body: JSON.stringify({ confirmId, currUser }),
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.startedAt && data.totalPayment) {
          dispatch(setOrderInfo(data));
        }
        return data;
      } catch (err) {
        console.log(err);
      }
    }

    async function updateUserOrders(confirmResponse) {
      if (!confirmResponse) return;
      try {
        const res = await fetch(UPDATE_USER_ORDERS_URL, {
          method: "POST",
          body: JSON.stringify({
            confirmId,
            currUser,
            order: confirmResponse.order,
            totalPayment: confirmResponse.totalPayment,
          }),
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        return data;
      } catch (err) {
        console.log(err);
      }
    }
  }, [currUser, confirmId, dispatch, id, orderId, token]);

  return (
    <div>
      {!confirmErr && (
        <div className="payment-confirm">
          <OrderedProductsList confirmed={true} />
          <span>
            <h3>Payment confirmed </h3>
            <h3>total: {totalPayment / 100}$</h3>
            <h3>
              total after discount:{" "}
              {Math.floor((totalPayment * Number(totalDiscount)) / 100)}$
            </h3>
          </span>
          <h3>shipment started at {startedAt}</h3>
          <b className="payment-confirm">Order Id: {confirmId}</b>
        </div>
      )}
      <h3 className="error">{confirmErr}</h3>
    </div>
  );
};

export default PaymentConfirmed;
