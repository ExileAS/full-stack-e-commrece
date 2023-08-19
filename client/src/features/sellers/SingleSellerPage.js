import { useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { selectSellerById } from "./sellersSlice";
import { selectProductsByUser } from "../products/productsSlice";
import { Link } from "react-router-dom";

export const SingleSellerPage = () => {
    const {userId} = useParams();
    const user = useSelector(state => selectSellerById(state, userId))
    const userProducts = useSelector(state => selectProductsByUser(state, user));
    const content = userProducts.map(product => (
        <section key={product.id} className="product-card">
            <Link to={'/products/' + product.id}><h3>{product.name}</h3></Link>
            <p>{product.description.substring(0,50)}</p>
            <b>{product.price}</b>
        </section>
    ))
    
    return (
        <div>
            <h2 className="user-products">{user.name}'s products for selling:</h2>
            {content}
        </div>
    )
    
}