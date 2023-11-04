import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { generateId, selectProductById } from "../products/productsSlice";
import { addNewSeller, generateIdSeller } from "../sellers/sellersSlice";

export const AddNewProduct = () => {
  const { productId } = useParams();
  const currProduct = useSelector((state) =>
    selectProductById(state, productId)
  );
  const [productName, setProductName] = useState(currProduct?.name || "");
  const [description, setdescription] = useState(
    currProduct?.description || ""
  );
  const [price, setPrice] = useState(currProduct?.price || "");
  const [amountToSell, setAmountToSell] = useState(currProduct?.onhand || "");
  const [img, setImage] = useState();
  const [category, setCategory] = useState(currProduct?.category || "others");
  const navigate = useNavigate();
  const id = useSelector((state) => generateId(state));
  const currUser = useSelector((state) => state.user.userEmail);
  const userName = currUser.substring(0, currUser.indexOf("@"));
  const handleChangeName = (e) => setProductName(e.target.value);
  const handlechangedescription = (e) => setdescription(e.target.value);
  const handleChangePrice = (e) => setPrice(e.target.value);
  const handleChangeAmount = (e) => setAmountToSell(e.target.value);
  let sellerEdit = false;
  if (currProduct) {
    sellerEdit = currProduct.seller === userName;
  }
  const canAdd =
    [productName, description, price, amountToSell, img, category].every(
      Boolean
    ) && price > 0;

  const [status, setStatus] = useState("idle");
  const dispatch = useDispatch();
  const sellerId = useSelector((state) => generateIdSeller(state));
  console.log(category);

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
            category,
            img: img,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "x-rapidapi-host": "file-upload8.p.rapidapi.com",
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

  const handleEdit = async () => {
    if (canAdd && sellerEdit) {
      try {
        const res = await axios.patch(
          "/api/editProduct",
          {
            name: productName,
            description,
            price,
            onhand: amountToSell,
            id: productId,
            seller: userName,
            category,
            img: img,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "x-rapidapi-host": "file-upload8.p.rapidapi.com",
            },
          }
        );
        const info = await res.json();
        console.log(info);
        setStatus("success");
      } catch (err) {
        console.log(err);
      }
      navigate("/products");
      window.location.reload(true);
    }
  };

  return (
    <div className="body-add-product">
      <div className="container-add-product">
        <div className="text-add-product">Add a product</div>
        <form
          className="add-product-form"
          encType="multipart/form-data"
          onSubmit={(e) => e.preventDefault()}
        >
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
          <div className="form-row">
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
            <div className="input-data">
              <label className="amount-input" htmlFor="imgform">
                Image:
              </label>
              <input
                type="file"
                name="img"
                accept="image/*"
                required={true}
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="input-data">
              <label className="amount-input">Category: </label>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="add-form-category"
                required={true}
              >
                <option value="devices" key="devices">
                  devices
                </option>
                <option value="clothes" key="clothes">
                  clothes
                </option>
                <option value="accessories" key="accessories">
                  accessories
                </option>
                <option value="others" key="others">
                  others
                </option>
              </select>
            </div>
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
                {!sellerEdit ? (
                  <button
                    className="button-64"
                    type="button"
                    onClick={handleProductAdded}
                    disabled={status !== "idle"}
                  >
                    Add Product
                  </button>
                ) : (
                  <button
                    className="button-64"
                    type="button"
                    onClick={handleEdit}
                    disabled={status !== "idle"}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
