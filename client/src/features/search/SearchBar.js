import { useContext, useState } from "react";
import { ProductExcerpt } from "../products/ProductList";
import { useSelector } from "react-redux";
import { selectAllInCart } from "../shoppingCart/shoppingCartSlice";
import SortOptions from "../sortingList/SortOptions";
import { CategoriesContext } from "../../contexts/categories-context";
import sortByRelevance from "./sortBySearchTerm";

const SearchBar = ({ data }) => {
  const { category } = useContext(CategoriesContext);
  const [search, setSearch] = useState("");
  const productsInCart = useSelector(selectAllInCart);

  const dataInCategory = data.filter(
    (item) => category === "" || category === item.category
  );

  const filterdData = dataInCategory
    .filter(
      (item) =>
        search !== "" && item.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((product) => !productsInCart.includes(product))
    .sort(sortByRelevance(search))
    .map((item) => <ProductExcerpt productId={item.id} key={item.id} />);

  let searchResult = "";
  if (search.length > 0) {
    searchResult =
      filterdData.length === 0 ? (
        <h2 className="search-res">No Matching Results</h2>
      ) : (
        <div className="grid">{filterdData}</div>
      );
  }

  return (
    <div className="search-bar">
      <div className="search-input">
        <form
          className="nosubmit"
          onSubmit={(e) => e.preventDefault()}
          autoComplete="off"
        >
          <input
            name="search-bar"
            id="search-bar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search..."
            className="nosubmit"
            type="search"
          ></input>
        </form>
        <br />
      </div>
      <SortOptions products={data} />
      {search !== "" && searchResult.length > 0 && (
        <h2 className="search-res">Search Results:</h2>
      )}
      <div className="grid">{searchResult}</div>
    </div>
  );
};

export default SearchBar;
