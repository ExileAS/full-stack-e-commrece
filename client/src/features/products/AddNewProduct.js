import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAllSellers } from "../sellers/sellersSlice";
import axios from "axios";
import { generateId } from "./productsSlice";

export const AddNewProduct = () => {
  const [productName, setProductName] = useState("");
  const [description, setdescription] = useState("");
  const [seller, setSeller] = useState("");
  const [price, setPrice] = useState("");
  const [amountToSell, setAmountToSell] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();
  const users = useSelector(selectAllSellers);
  const id = useSelector((state) => generateId(state));

  const handleChangeName = (e) => setProductName(e.target.value);
  const handlechangedescription = (e) => setdescription(e.target.value);
  const handleChangeSeller = (e) => setSeller(e.target.value);
  const handleChangePrice = (e) => setPrice(e.target.value);
  const handleChangeAmount = (e) => setAmountToSell(e.target.value);
  const handleChangeType = (e) => setType(e.target.value);

  const canAdd =
    [productName, description, seller, price, amountToSell].every(Boolean) &&
    price > 0;

  const userOptions = users.map((user) => (
    <option value={user.name} key={user.id} className="option">
      {user.name}
    </option>
  ));

  const [status, setStatus] = useState("idle");

  const handleProductAdded = async () => {
    if (canAdd) {
      setStatus("pending");
      try {
        await axios.post(
          `${process.env.REACT_APP_PROXY_HOST}/api`,
          {
            name: productName,
            description,
            price,
            onhand: amountToSell,
            seller,
            id,
            type,
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
      <label>Product name:</label>
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
      <label>Seller Name:</label>
      <br />
      <select onChange={handleChangeSeller} className="select-user">
        <option value=""></option>
        {userOptions}
      </select>
      <br />
      <label>Amount:</label>
      <input
        type="number"
        value={amountToSell}
        onChange={handleChangeAmount}
        className="amount"
      />
      <br />
      <label>type:</label>
      <input type="text" value={type} onChange={handleChangeType} />
      <br />
      <button
        className="add-button"
        type="button"
        onClick={handleProductAdded}
        disabled={status !== "idle"}
      >
        Add Product
      </button>
    </form>
  );
};
