import { useDispatch, useSelector } from "react-redux";
import {
  clearOrdered,
  decrementInOrdered,
  getTotalCostOrdered,
  removeOrder,
  selectAllOrdered,
  clearInDB,
  updateOrder,
  selectAllConfirmed,
} from "./shoppingCartSlice";
import { ProductExcerpt } from "../products/ProductList";
import { useLayoutEffect, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchProducts } from "../products/productsSlice";
import { setOrderId } from "../userRegister/userSlice";
import { Spinner } from "../../components/Spinner";

const OrderedProductsList = ({ confirmed }) => {
  const productsUnconfirmed = useSelector(selectAllOrdered);
  const productsConfirmed = useSelector(selectAllConfirmed);
  const products = confirmed ? productsConfirmed : productsUnconfirmed;
  const totalCost = useSelector(getTotalCostOrdered);
  const status = useSelector((state) => state.products.status);
  const customerInfo = useSelector((state) => state.shoppingCart.customerInfo);
  const confirmId = useSelector((state) => state.shoppingCart.confirmId);
  const [costAfterDiscount, setCostAfterDiscount] = useState(totalCost);
  const [shippingFee, setShippingFee] = useState(120);
  const [discountRatio, setDiscountRatio] = useState(0);
  const [disableCheckout, setDisableCheckout] = useState(false);
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
      if (totalCost > 1000) setShippingFee(0);
      else setShippingFee(120);
      setCostAfterDiscount(totalCost - discount);
    }
  }, [totalCost, products]);

  useLayoutEffect(() => {
    if (status !== "success") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const content =
    products &&
    status === "success" &&
    products.map((product) => (
      <div key={product.id}>
        <ProductExcerpt
          product={product}
          count={product.count}
          orderedList={true}
        />
        {!confirmed && (
          <div>
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
        )}
      </div>
    ));

  const handleCheckout = async () => {
    setDisableCheckout(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        body: JSON.stringify({
          confirmId: confirmId,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.url) {
        dispatch(setOrderId(data.id));
        window.location.assign(`${data.url}`);
      }
      console.log(data.error);
    } catch (err) {
      console.log(err);
    }
  };

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
          <div>
            {" "}
            {!confirmed && (
              <h2 className="nothing-ordered">Nothing ordered yet</h2>
            )}
          </div>
        )}
      </div>
      {totalCost > 0 && (
        <div className="order-info">
          <h3>
            ordered by {customerInfo.firstName} {customerInfo.lastName}.
            shipping to{" "}
            {!confirmed ? (
              <Link to="/confirm-order">{customerInfo.adress}</Link>
            ) : (
              <b>{customerInfo.adress}</b>
            )}
          </h3>
          {!confirmed && (
            <div>
              <div>
                {!disableCheckout ? (
                  <button
                    onClick={handleCheckout}
                    className="checkout"
                    disabled={disableCheckout}
                  >
                    <b>Checkout</b>
                  </button>
                ) : (
                  <Spinner text="loading..." />
                )}
              </div>
              <button
                className="cancel-shipment"
                onClick={async () => {
                  dispatch(clearOrdered());
                  await dispatch(clearInDB(confirmId)).unwrap();
                  navigate("/products");
                  window.location.reload(true);
                }}
              >
                <b className="cancel-text" disabled={disableCheckout}>
                  Cancel Shipment &#128465;
                </b>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderedProductsList;
