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
      const discountMultiplier = Math.floor(totalCost / 10000);
      const discountValue =
        totalCost - totalCost * (1 - 0.0009 * discountMultiplier);
      const discount =
        discountValue >= 30000 ? 30000 : Math.round(discountValue);
      const currDiscountRatio = (discount / totalCost) * 100;
      const ratioDisplayed = `${currDiscountRatio}`.substring(0, 4);
      setDiscountRatio(ratioDisplayed);
      if (totalCost > 10000) setShippingFee(0);
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
        <div className="item-ordered">
          <ProductExcerpt
            productId={product.id}
            count={product.count}
            orderedList={true}
            confirmed={confirmed}
          />
        </div>
        {!confirmed && (
          <div>
            <button
              className="button-24"
              onClick={() => {
                dispatch(decrementInOrdered(product.id));
                dispatch(updateOrder());
              }}
            >
              -
            </button>
            <button
              className="button-24"
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
    <div className="ordered-content" transition-style="in:square:center">
      {confirmId && totalCost > 0 && !confirmed && <b>Order ID: {confirmId}</b>}
      {content}
      <div>
        {totalCost > 0 ? (
          <div>
            <b className="cost">total cost: {totalCost / 100} $</b>
            <br />
            <b className="fee">shipping Fee: {shippingFee / 100} $</b>
            <br />
            <b className="discount">discount% : {discountRatio}%</b>
            <br />
            <b className="total-with-discount">
              total after discount: {(costAfterDiscount + shippingFee) / 100} $
            </b>
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
          <h2 className="info">
            ordered by {customerInfo.firstName} {customerInfo.lastName}.
            shipping to{" "}
            {!confirmed ? (
              <Link to="/confirm-order">{customerInfo.adress}</Link>
            ) : (
              <b>{customerInfo.adress}</b>
            )}
          </h2>
          {!confirmed && (
            <div>
              <div>
                {!disableCheckout ? (
                  <button
                    onClick={handleCheckout}
                    className="button-77"
                    disabled={disableCheckout}
                  >
                    Checkout
                  </button>
                ) : (
                  <Spinner text="loading..." />
                )}
              </div>{" "}
              {!disableCheckout ? (
                <button
                  className="button-45"
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
              ) : (
                <div></div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderedProductsList;
