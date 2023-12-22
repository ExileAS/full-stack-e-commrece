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
import ProductExcerpt from "../products/ProductExcerpt";
import { useLayoutEffect, useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchProducts } from "../products/productsSlice";
import { setOrderId, setTotalDiscount } from "../userRegister/userSlice";
import { Spinner } from "../../components/Spinner";
import { csrfTokenContext } from "../../contexts/csrfTokenContext";
import exponentialBackoff from "../utils/exponentialBackoff";
import { PAYMENT_URL } from "../utils/urlConstants";

const OrderedProductsList = ({ confirmed }) => {
  const token = useContext(csrfTokenContext);
  const productsUnconfirmed = useSelector(selectAllOrdered);
  const productsConfirmed = useSelector(selectAllConfirmed);
  const products = confirmed ? productsConfirmed : productsUnconfirmed;
  const totalCost = useSelector(getTotalCostOrdered);
  const status = useSelector((state) => state.products.status);
  const customerInfo = useSelector((state) => state.shoppingCart.customerInfo);
  const confirmId = useSelector((state) => state.shoppingCart.confirmId);
  const verifiedUser = useSelector((state) => state.user.verifiedUser);
  const startedAt = useSelector(
    (state) => state.shoppingCart.shipmentStartedAt
  );
  const [costAfterDiscount, setCostAfterDiscount] = useState(totalCost);
  const [shippingFee, setShippingFee] = useState(120);
  const [discountRatio, setDiscountRatio] = useState(0);
  const [disableCheckout, setDisableCheckout] = useState(false);
  const totalAfterDiscount = (costAfterDiscount + shippingFee) / 100;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { paymentMethod } = useParams();

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
                dispatch(updateOrder(false));
              }}
            >
              -
            </button>
            <button
              className="button-24"
              onClick={() => {
                dispatch(removeOrder(product.id));
                dispatch(updateOrder(false));
              }}
            >
              Cancel Order
            </button>
          </div>
        )}
      </div>
    ));

  const handleCheckout = () =>
    exponentialBackoff(async () => {
      setDisableCheckout(true);
      try {
        const res = await fetch(PAYMENT_URL, {
          method: "POST",
          body: JSON.stringify({
            confirmId: confirmId,
            totalAfterDiscount,
          }),
          headers: { "Content-Type": "application/json", "csrf-token": token },
        });
        const data = await res.json();
        if (data.url) {
          dispatch(setOrderId(data.id));
          dispatch(setTotalDiscount(discountRatio));
          window.location.assign(`${data.url}`);
        }
        return data;
      } catch (err) {
        console.log(err);
      }
    });

  return (
    <div className="ordered-content" transition-style="in:square:center">
      {productsUnconfirmed?.length > 0 && (
        <div className="title">
          {" "}
          {confirmId && totalCost > 0 && !confirmed && (
            <b className="info">Order ID: {confirmId}</b>
          )}
          {paymentMethod === "checkout" && (
            <div>
              <h3>proceed to checkout to confirm</h3>
            </div>
          )}
          {paymentMethod === "onReceiving" && verifiedUser && (
            <div>
              <h3>shipment started at {startedAt}</h3>
            </div>
          )}
        </div>
      )}
      {content}
      <div>
        {totalCost > 0 ? (
          <div>
            {status === "success" ? (
              <div>
                <b className="cost">total cost: {totalCost / 100} $</b>
                <br />
                <b className="fee">shipping Fee: {shippingFee / 100} $</b>
                <br />
                <b className="discount">discount% : {discountRatio}%</b>
                <br />
                <b className="total-with-discount">
                  total after discount:{totalAfterDiscount}$
                </b>
              </div>
            ) : (
              <div>
                {status === "loading" ? (
                  <Spinner />
                ) : (
                  <h2 className="error">error</h2>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
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
