import { useEffect } from "react";
import OrderedProductsList from "./OrderedProductList";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmPayment,
  selectAllConfirmed,
  selectAllOrdered,
} from "./shoppingCartSlice";
const PaymentConfirmed = () => {
  const ordered = useSelector(selectAllOrdered);
  const confirmed = useSelector(selectAllConfirmed);
  const confirmId = useSelector((state) => state.shoppingCart.confirmId);
  const dispatch = useDispatch();
  useEffect(() => {
    if (ordered.length && !confirmed.length) {
      dispatch(confirmPayment());
      fetch("/api/confirmPayment", {
        method: "POST",
        body: JSON.stringify({ confirmId }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((res) => console.log(res));
    }
  }, [dispatch, ordered, confirmed, confirmId]);

  return (
    <div>
      <OrderedProductsList confirmed={true} />
      <h2 className="confirmed">Payment confirmed</h2>
    </div>
  );
};

export default PaymentConfirmed;
