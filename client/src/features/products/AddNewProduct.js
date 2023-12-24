import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  fetchProducts,
  generateId,
  selectProductById,
} from "../products/productsSlice";
import { csrfTokenContext } from "../../contexts/csrfTokenContext";
import Loader from "../../components/Loader";
import { ADD_PRODUCT_URL, EDIT_PRODUCT_URL } from "../utils/urlConstants";

export const AddNewProduct = () => {
  const token = useContext(csrfTokenContext);
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currProduct = useSelector((state) =>
    selectProductById(state, productId)
  );
  const id = useSelector((state) => generateId(state));
  const currUser = useSelector((state) => state.user.userEmail);
  const currIsSeller = useSelector((state) => state.user.currIsSeller);
  const userName = currUser?.substring(0, currUser.indexOf("@"));

  const [img, setImage] = useState(null);
  const [formState, setFormState] = useState({
    productName: currProduct?.name || "",
    description: currProduct?.description || "",
    price: currProduct?.price || "",
    amountToSell: currProduct?.onhand || "",
    category: currProduct?.category || "others",
  });
  const handleChangeForm = (e) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.valueAsNumber || e.target.value,
    }));
  };

  let sellerEdit = false;
  if (currProduct) {
    sellerEdit = currProduct.seller === userName;
  }
  const canAdd = [
    currUser,
    currIsSeller,
    formState.productName,
    formState.description,
    formState.price,
    formState.amountToSell,
    img,
    formState.category,
    formState.price >= 100,
    Number.isInteger(formState.amountToSell),
    formState.amountToSell > 0,
  ].every(Boolean);

  const [status, setStatus] = useState("idle");
  const [err, setErr] = useState("");
  const handleProductAdded = async () => {
    if (!canAdd) {
      setErr("Please Fill out The Details Form");
      return;
    }
    setErr("");
    setStatus("pending");
    try {
      const res = await axios.post(
        ADD_PRODUCT_URL,
        {
          name: formState.productName,
          description: formState.description,
          price: formState.price,
          onhand: formState.amountToSell,
          id,
          seller: userName,
          category: formState.category,
          img: img,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-rapidapi-host": "file-upload8.p.rapidapi.com",
            "csrf-token": token,
          },
        }
      );
      if (res.data) {
        setStatus("success");
        setFormState({});
        // dispatch(addNewProduct(res.data.product));
        await dispatch(fetchProducts()).unwrap();
        navigate("/products");
        return;
      }
      setErr(res.err);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async () => {
    if (!canAdd || !sellerEdit) {
      setErr("Please Fill out The Details Form");
      return;
    }
    setErr("");
    try {
      const res = await axios.patch(
        EDIT_PRODUCT_URL,
        {
          name: formState.productName,
          description: formState.description,
          price: formState.price,
          onhand: formState.amountToSell,
          id: productId,
          seller: userName,
          category: formState.category,
          img: img,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-rapidapi-host": "file-upload8.p.rapidapi.com",
            "csrf-token": token,
          },
        }
      );
      if (res.data) {
        setStatus("success");
        setFormState({});
        // dispatch(editExisting(res.data.product));
        await dispatch(fetchProducts()).unwrap();
        navigate("/products");
        return;
      }
      setErr(res.err);
    } catch (err) {
      console.log(err);
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
              <label className="add-form-titles">title:</label>
              <input
                type="text"
                name="productName"
                value={formState.productName}
                onChange={handleChangeForm}
                autoComplete="off"
              />
              <div className="underline"></div>
            </div>
            <div className="input-data">
              <label className="add-form-titles">Price in cents:</label>
              <input
                type="number"
                name="price"
                value={formState.price}
                onChange={handleChangeForm}
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
                name="amountToSell"
                value={formState.amountToSell}
                onChange={handleChangeForm}
                className="input-amount"
              />
              <div className="underline"></div>
            </div>
            <div className="input-data">
              <label className="amount-input">Image:</label>
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
                onChange={handleChangeForm}
                className="add-form-category"
                value={formState.category}
                required={true}
                name="category"
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
              <label className="add-form-titles">Description:</label>
              <textarea
                name="description"
                onChange={handleChangeForm}
                value={formState.description}
              ></textarea>
              <div className="underline"></div>
            </div>
          </div>
          <div>
            <div className="form-row">
              <div className="input-data">
                <div className="inner"></div>
                {!sellerEdit ? (
                  <div>
                    {status !== "pending" ? (
                      <button
                        className="button-64"
                        type="button"
                        onClick={handleProductAdded}
                      >
                        Add Product
                      </button>
                    ) : (
                      <Loader />
                    )}
                  </div>
                ) : (
                  <div>
                    {status !== "pending" ? (
                      <button
                        className="button-64"
                        type="button"
                        onClick={handleEdit}
                      >
                        Edit
                      </button>
                    ) : (
                      <Loader />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <b className="error">{err}</b>
        </form>
      </div>
    </div>
  );
};
