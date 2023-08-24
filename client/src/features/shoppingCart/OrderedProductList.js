import { useDispatch, useSelector } from "react-redux";
import {
  clearOrdered,
  decrementInOrdered,
  getTotalCostOrdered,
  removeOrder,
  selectAllOrdered,
  clearInDB,
  updateOrder,
} from "./shoppingCartSlice";
import { ProductExcerpt } from "../products/ProductList";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const OrderedProductsList = () => {
  const products = useSelector(selectAllOrdered);
  const totalCost = useSelector(getTotalCostOrdered);
  const customerInfo = useSelector((state) => state.shoppingCart.customerInfo);
  const confirmId = useSelector((state) => state.shoppingCart.confirmId);
  const [costAfterDiscount, setCostAfterDiscount] = useState(totalCost);
  const [shippingFee, setShippingFee] = useState(12);
  const [discountRatio, setDiscountRatio] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  }, [totalCost, products]);

  const content =
    products &&
    products.map((product) => (
      <div key={product.id}>
        <ProductExcerpt
          product={product}
          count={product.count}
          orderedList={true}
        />
        <button
          onClick={() => {
            dispatch(decrementInOrdered(product.id));
            dispatch(updateOrder());
          }}
        >
          -
        </button>
        <button
          className="cancel-order"
          onClick={() => {
            dispatch(removeOrder(product.id));
            dispatch(updateOrder());
          }}
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
          <button
            className="cancel-shipment"
            onClick={() => {
              dispatch(clearOrdered());
              dispatch(clearInDB(confirmId));
              navigate("/products");
              window.location.reload(true);
            }}
          >
            <h3 className="cancel-text">Cancel Shipment</h3>
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderedProductsList;
