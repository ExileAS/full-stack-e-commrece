import { useSelector } from "react-redux";
import { selectAllProducts } from "./productsSlice";
import { useParams } from "react-router-dom";
import { selectProductById } from "./productsSlice";

import { Link } from "react-router-dom";
import { useEffect } from "react";
import sortByRelevance from "../search/sortBySearchTerm";

const MoreLikeThis = () => {
  const { productId } = useParams();
  const currProduct = useSelector((state) =>
    selectProductById(state, productId)
  );
  const allProducts = useSelector(selectAllProducts);

  let simillarProducts = allProducts
    .filter(
      (product) =>
        product.id !== productId &&
        product.category === currProduct.category &&
        product.category !== "others"
    )
    .sort(sortByRelevance(currProduct?.name || ""));

  useEffect(() => {
    if (simillarProducts?.length > 0) {
      localStorage.setItem(
        `${productId}similarProducts`,
        JSON.stringify([...simillarProducts])
      );
    }
  }, [simillarProducts, productId]);

  if (!simillarProducts.length)
    simillarProducts = JSON.parse(
      localStorage.getItem(`${productId}similarProducts`)
    );

  const content = simillarProducts?.map((product) => (
    <div key={product.id} className="item-product">
      <Link to={"/products/" + product.id} className="product-title">
        <h2>{product.name}</h2>
      </Link>
      <img src={product.img} alt="" className="laptop" />
      <br />
      <b className="price">{product.price} $</b>
      <p className="description">
        {product.description.length > 40
          ? `${product.description.substring(0, 40)}...`
          : `${product.description}`}
      </p>
    </div>
  ));

  return (
    <>
      {content?.length > 0 ? (
        <section className="grid">{content}</section>
      ) : (
        <div className="title">
          <b>Currently No Simillar Products</b>
        </div>
      )}
    </>
  );
};

export default MoreLikeThis;
