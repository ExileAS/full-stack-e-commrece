import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { generateId } from "../sellers/sellersSlice";
import { addNewSeller } from "../sellers/sellersSlice";

export const AddNewProduct = () => {
  const [productName, setProductName] = useState("");
  const [description, setdescription] = useState("");
  const [price, setPrice] = useState("");
  const [amountToSell, setAmountToSell] = useState("");
  const navigate = useNavigate();
  const id = useSelector((state) => generateId(state));
  const currUser = useSelector((state) => state.user.userEmail);
  const userName = currUser.substring(0, currUser.indexOf("@"));
  const handleChangeName = (e) => setProductName(e.target.value);
  const handlechangedescription = (e) => setdescription(e.target.value);
  const handleChangePrice = (e) => setPrice(e.target.value);
  const handleChangeAmount = (e) => setAmountToSell(e.target.value);

  const canAdd =
    [productName, description, price, amountToSell].every(Boolean) && price > 0;

  const [status, setStatus] = useState("idle");
  const dispatch = useDispatch();
  const sellerId = useSelector((state) => generateId(state));
  const handleProductAdded = async () => {
    if (canAdd) {
      setStatus("pending");
      dispatch(addNewSeller({ name: userName, id: sellerId }));
      try {
        await axios.post(
          "/api",
          {
            name: productName,
            description,
            price,
            onhand: amountToSell,
            id,
            seller: userName,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        setStatus("success");
      } catch (err) {
        console.log(err);
      }
      navigate("/products");
      window.location.reload(true);
    }
  };
  console.log(status);

  return (
    <div className="body-add-product">
      <div className="container-add-product">
        <div className="text-add-product">Add a product</div>
        <form className="add-product-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <div className="input-data">
              <label className="add-form-titles">Product title:</label>
              <input
                type="text"
                value={productName}
                onChange={handleChangeName}
              />
              <div className="underline"></div>
            </div>
            <div className="input-data">
              <label className="add-form-titles">Price:</label>
              <input
                type="number"
                value={price}
                onChange={handleChangePrice}
                className="input-price"
              />
              <div className="underline"></div>
            </div>
          </div>
          <div className="input-data">
            <label className="amount-input">Amount:</label>
            <input
              type="number"
              value={amountToSell}
              onChange={handleChangeAmount}
              className="input-amount"
            />
            <div className="underline"></div>
          </div>
          <br />
          <div>
            <div className="input-data textarea">
              <label className="add-form-titles">Product Description:</label>
              <textarea
                name="description"
                value={description}
                onChange={handlechangedescription}
              ></textarea>
              <div className="underline"></div>
            </div>
          </div>
          <div>
            <div className="form-row">
              <div className="input-data">
                <div className="inner"></div>
                <button
                  className="button-64"
                  type="button"
                  onClick={handleProductAdded}
                  disabled={status !== "idle"}
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
