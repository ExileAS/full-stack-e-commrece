import { useEffect, useState } from "react";
import useSortBy from "./useSortBy";
import { useDispatch } from "react-redux";
import { setProductState } from "../products/productsSlice";

const SortOptions = ({ products }) => {
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("up");
  const dispatch = useDispatch();
  const sorted = useSortBy(products, sortBy, order);

  useEffect(() => {
    dispatch(setProductState(sorted));
  }, [sortBy, dispatch, order]);

  return (
    <div>
      <label htmlFor="sortOptions">SortBy</label>
      <select
        name="sortOptins"
        id="sortoptions"
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option disabled={sortBy.length > 0} value="">
          none
        </option>
        <option value="date">Date</option>
        <option value="price">Price</option>
      </select>
      <select
        name="order"
        id="order"
        onChange={(e) => setOrder(e.target.value)}
      >
        <option value="up">↓ Ascending</option>
        <option value="down">↓ Descending</option>
      </select>
    </div>
  );
};

export default SortOptions;
