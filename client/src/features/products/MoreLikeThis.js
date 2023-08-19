import { useSelector } from "react-redux";
import { selectAllProducts } from "./productsSlice";
import { useParams } from "react-router-dom";
import { selectProductById } from "./productsSlice";
import TimeAgo from "./TimeAgo";
import { Link } from "react-router-dom";


const MoreLikeThis = () => {
    const {productId} = useParams();
    const productName = useSelector(state => selectProductById(state, productId).name);
    const simillarProducts = useSelector(selectAllProducts).filter(product => (
       product.id !== productId && (product.name.toLowerCase().includes(productName.toLowerCase()) ||
        productName.toLowerCase().includes(product.name.toLowerCase()))
    ));


    const content = simillarProducts.map(product => (
        <div>
            <h2><Link to={'/products/' + product.id}>{product.name}</Link></h2>
            <br />
            <b>Price: {product.price}</b>
            <br />
            <p>{product.description}</p>
            <br />
            <TimeAgo timestamp={product.date}/>
            <br />
            <b>added by {product.seller}</b>
            <br />
        </div>
    ))
    const exist = content.length > 0;
   
    return ( 
        <section className="product-card">
            {exist ? content : <div>Currently No Similar Products</div>}
        </section>
    );
}
 
export default MoreLikeThis;