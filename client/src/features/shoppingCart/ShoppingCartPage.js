import { useDispatch, useSelector } from "react-redux";
import { getTotalCost, incrementInCart, selectAllInCart, decrementInCart, clearShoppingCart } from "./shoppingCartSlice";
import TimeAgo from '../products/TimeAgo'
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const ShoppingCartPage = () => {
    const productsInCart = useSelector(selectAllInCart);
    const totalCost = useSelector(getTotalCost);
    const [totalPrice, setTotalPrice] = useState(totalCost);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [amountExceeded, setAmountExceeded] = useState(false);


    const handleIncrement = (product) => {
        dispatch(incrementInCart(product));
        if(product.count < product.onhand) setTotalPrice(prev => prev + product.price)
        else {
            setAmountExceeded(true);
            setTimeout(() => {
                setAmountExceeded(false);
            }, 2800);
        }
    };
    

    const products = productsInCart.map(product => {
        return (
            <div className="product-card" key={product.id}>
                <Link to={'/products/' + product.id}><h2>{product.name} x{product.count}</h2></Link>
                <b value={product.price}>Price: {product.price}</b>
                <br />
                <b>Description: {product.description}</b>
                <p>added by {product.seller ?? 'unknown'}</p>
                <TimeAgo timestamp={product.date}/>
                <br />
                <button className="add-more-button" onClick={() => handleIncrement(product)}>+</button>
                <button className="decrement-button" onClick={() => {
                    dispatch(decrementInCart(product.id))
                    if(totalPrice > 0) setTotalPrice(prev => prev - product.price);             
                }}>-</button>
            </div>
        )}
    )

    

    return ( 
        <section>
            <span className="cart-title"><h2>items in your Shopping Cart</h2></span>
            {products}
            <b>Total Cost: {totalPrice}</b>
            <br />
            { productsInCart.length > 0 &&
            <button className="place-order" onClick={() => navigate('/confirm-order')}>Place Order</button>
            }   
            <br />
            {amountExceeded && <div className="error">on hand quantity exceeded!</div>}
            { productsInCart.length > 0 &&
            <button onClick={() =>{
                    setTotalPrice(0);
                    dispatch(clearShoppingCart())
                }} className="clear-button">Clear Shopping Cart &#128465;</button>
            }   
        </section>
    );
}
 
export default ShoppingCartPage;