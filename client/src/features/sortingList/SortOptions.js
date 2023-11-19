import { useEffect, useMemo, useState } from "react";
import sortList from "./sortList";
import { useDispatch } from "react-redux";
import { setProductState } from "../products/productsSlice";

const SortOptions = ({ products }) => {
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("up");
  const dispatch = useDispatch();
  const sorted = useMemo(
    () => sortList(products, sortBy, order),
    [order, products, sortBy]
  );

  useEffect(() => {
    dispatch(setProductState(sorted));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, dispatch, order]);

  return (
    <div className="sort-container">
      <label htmlFor="sortOptions" className="sortby">
        SortBy:
      </label>
      <select
        name="sortOptins"
        id="sortoptions"
        onChange={(e) => setSortBy(e.target.value)}
        className="date-price"
      >
        <option disabled={sortBy.length > 0} value="">
          Default
        </option>
        <option value="date" className="sort">
          Date
        </option>
        <option value="price" className="sort">
          Price
        </option>
        <option value="rating" className="sort">
          rating
        </option>
      </select>
      <select
        name="order"
        id="order"
        className="orderopts"
        onChange={(e) => setOrder(e.target.value)}
      >
        <option value="up" className="sort">
          {sortBy === "price" || sortBy === "rating" ? "lowest" : " newest"}
        </option>
        <option value="down" className="sort">
          {sortBy === "price" || sortBy === "rating" ? "highest" : "oldest"}
        </option>
      </select>
    </div>
  );
};

export default SortOptions;
