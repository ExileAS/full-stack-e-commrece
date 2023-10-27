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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, dispatch, order]);

  return (
    <div>
      <label htmlFor="sortOptions" className="sortby">
        SortBy:
      </label>
      <select
        name="sortOptins"
        id="sortoptions"
        className="sortopts"
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
        className="orderopts"
        onChange={(e) => setOrder(e.target.value)}
      >
        <option value="up">
          {sortBy === "price" ? <b> Ascending</b> : <b> newest</b>}
        </option>
        <option value="down">
          {sortBy === "price" ? <b> Descending</b> : <b> oldest</b>}
        </option>
      </select>
    </div>
  );
};

export default SortOptions;
