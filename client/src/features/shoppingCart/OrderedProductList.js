import { useDispatch, useSelector } from "react-redux";
import {
  decrementInOrdered,
  getTotalCostOrdered,
  removeOrder,
  selectAllOrdered,
} from "./shoppingCartSlice";
import { ProductExcerpt } from "../products/ProductList";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const OrderedProductsList = () => {
  const products = useSelector(selectAllOrdered);
  const totalCost = useSelector(getTotalCostOrdered);
  const customerInfo = useSelector((state) => state.shoppingCart.customerInfo);
  const confirmId = useSelector((state) => state.shoppingCart.confirmId);
  const [costAfterDiscount, setCostAfterDiscount] = useState(totalCost);
  const [shippingFee, setShippingFee] = useState(12);
  const [discountRatio, setDiscountRatio] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (totalCost > 0) {
      const discountMultiplier = Math.floor(totalCost / 1000);
      const discountValue =
        totalCost - totalCost * (1 - 0.0009 * discountMultiplier);
      const discount = discountValue >= 3000 ? 3000 : Math.round(discountValue);
      const currDiscountRatio = (discount / totalCost) * 100;
      const ratioDisplayed = `${currDiscountRatio}`.substring(0, 4);
      setDiscountRatio(ratioDisplayed);
      setShippingFee(0);
      setCostAfterDiscount(totalCost - discount);
    }
  }, [totalCost]);

  const content =
    products &&
    products.map((product) => (
      <div key={product.id}>
        <ProductExcerpt
          product={product}
          key={product.id}
          count={product.count}
          selected={true}
        />
        <button onClick={() => dispatch(decrementInOrdered(product.id))}>
          -
        </button>
        <button
          className="cancel-order"
          onClick={() => dispatch(removeOrder(product.id))}
        >
          Cancel Order
        </button>
      </div>
    ));

  return (
    <div className="ordered-content">
      {confirmId && totalCost > 0 && <b>Order ID: {confirmId}</b>}
      {content}
      <div>
        {totalCost > 0 ? (
          <div>
            <b>total cost: {totalCost}</b>
            <br />
            <b>shipping Fee: {shippingFee}</b>
            <br />
            <b>discount% : {discountRatio}%</b>
            <br />
            <b>total after discount {costAfterDiscount + shippingFee}</b>
          </div>
        ) : (
          <h2 className="nothing-ordered">Nothing ordered yet</h2>
        )}
      </div>
      {totalCost > 0 && (
        <div className="order-info">
          <h3>
            ordered by {customerInfo.firstName} {customerInfo.lastName}.
            shipping to <Link to="/confirm-order">{customerInfo.adress}</Link>
          </h3>
        </div>
      )}
    </div>
  );
};

export default OrderedProductsList;
