import { ProductExcerpt } from "../products/ProductList";
const useChange = (
  others,
  setSearchCategory,
  setCategoryResults,
  data,
  categories
) => {
  const handleChangeCategory = (e) => {
    const category = e.target.value;
    if (category === "all") setSearchCategory("");
    else setSearchCategory(category);
    const result = data.filter(
      (item) => categories[category] && categories[category].includes(item.type)
    );
    const content = result.map((item) => (
      <ProductExcerpt product={item} key={item.id} />
    ));
    const otherContent = others.map((item) => (
      <ProductExcerpt product={item} key={item.id} />
    ));
    setCategoryResults((prev) =>
      category === "others" ? otherContent : content
    );
  };
  return handleChangeCategory;
};

export default useChange;
