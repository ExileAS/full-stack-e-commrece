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
  const dispatch = useDispatch();
  useEffect(() => {
    if (ordered.length && !confirmed.length) {
      dispatch(confirmPayment());
    }
  }, [dispatch, ordered, confirmed]);

  return (
    <div>
      <OrderedProductsList confirmed={true} />
      <h2 className="confirmed">Payment confirmed</h2>
    </div>
  );
};

export default PaymentConfirmed;
