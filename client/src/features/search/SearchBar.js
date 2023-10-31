import { useState } from "react";
import { ProductExcerpt } from "../products/ProductList";
import { useSelector } from "react-redux";
import { selectAllInCart } from "../shoppingCart/shoppingCartSlice";
import searchImg from "../../components/icons8-google-web-search-50.png";
import Categories from "./Categories";
import useChange from "./useChange";

const SearchBar = ({ data }) => {
  const categories = {
    devices: ["PC", "phone", "camera", "hard drive"],
    clothes: ["t-shirt", "shirt", "troussers", "skirt", "dress"],
    accessories: [
      "keyboard",
      "mouse",
      "headphones",
      "cooling pad",
      "cooling paste",
      "usb hub",
      "mouse pad",
    ],
  };

  const [search, setSearch] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [categoryResults, setCategoryResults] = useState("");
  const productsInCart = useSelector(selectAllInCart);

  const others = data.filter((item) =>
    Object.keys(categories).every((key) => !categories[key].includes(item.type))
  );

  const dataInCategory =
    searchCategory !== "others"
      ? data.filter(
          (item) =>
            searchCategory === "" ||
            categories[searchCategory].includes(item.type)
        )
      : others;

  const filterdData = dataInCategory
    .filter(
      (item) =>
        search !== "" && item.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((product) => !productsInCart.includes(product))
    .map((item) => <ProductExcerpt product={item} key={item.id} />);

  let searchResult = "";
  if (search.length > 0) {
    searchResult =
      filterdData.length === 0 ? (
        <h2>No Matching Results</h2>
      ) : (
        <div>
          <h2>Search Results:</h2>
          {filterdData}
        </div>
      );
  }

  return (
    <div className="search-bar">
      <div className="search-input">
        <input
          name="search-bar"
          id="search-bar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="search..."
          className="search-input"
        ></input>
        <img
          src={searchImg}
          alt=""
          onClick={() => alert("hi")}
          className="search-img"
        />
      </div>
      <Categories
        changeCategory={useChange(
          others,
          setSearchCategory,
          setCategoryResults,
          data,
          categories
        )}
      />
      <div>{searchResult}</div>
      <div>
        {search.length === 0 && searchCategory.length > 0 && (
          <div>
            <h2 className="category-name">{searchCategory}:</h2>
            {categoryResults}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
