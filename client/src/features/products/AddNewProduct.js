import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { generateId } from "./productsSlice";

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

  const handleProductAdded = async () => {
    if (canAdd) {
      setStatus("pending");
      try {
        await axios.post(
          "/api",
          {
            name: productName,
            description,
            price,
            onhand: amountToSell,
            id,
            userName,
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

  return (
    <form className="add-product-form" onSubmit={(e) => e.preventDefault()}>
      <label>Product title:</label>
      <br />
      <input
        type="text"
        value={productName}
        onChange={handleChangeName}
        className="name"
      />
      <br />
      <label>Price:</label>
      <br />
      <input
        type="number"
        value={price}
        onChange={handleChangePrice}
        className="price"
      />
      <br />
      <label>Product Description:</label>
      <br />
      <textarea
        className="description"
        name="description"
        value={description}
        onChange={handlechangedescription}
      ></textarea>
      <br />
      <label>Amount:</label>
      <br />
      <input
        type="number"
        value={amountToSell}
        onChange={handleChangeAmount}
        className="amount"
      />
      <br />
      <button
        className="button-64"
        type="button"
        onClick={handleProductAdded}
        disabled={status !== "idle"}
      >
        Add Product
      </button>
    </form>
  );
};
