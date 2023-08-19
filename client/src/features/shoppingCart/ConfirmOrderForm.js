import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { productsOrdered } from "./shoppingCartSlice";

const ConfirmOrderForm = () => {
    const info = useSelector(state => state.shoppingCart.customerInfo);
    const infoAvailable = JSON.stringify(info) !== JSON.stringify({});
    const {firstName, lastName, adress, phoneNumber, emailAdress} = infoAvailable && info;

    const emptyForm = {
        firstName : '',
        lastName: '',
        adress:'',
        phoneNumber: '',
        emailAdress: ''
    };

    const initialForm = infoAvailable ? {
        firstName,
        lastName,
        adress,
        phoneNumber,
        emailAdress
    } : emptyForm;


    const [formState, setFormState] = useState(initialForm);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeFirstName = (e) => setFormState(prev => ({...prev, firstName:e.target.value}));
    const changeLasttName = (e) => setFormState(prev => ({...prev, lastName:e.target.value}));
    const changeAdress = (e) => setFormState(prev => ({...prev, adress:e.target.value}));
    const changePhoneNumber = (e) => setFormState(prev => ({...prev, phoneNumber:e.target.value}));
    const changeEmailAdress = (e) => setFormState(prev => ({...prev, emailAdress:e.target.value}));
    
    
    const canSumbit = [
        formState.firstName, formState.lastName,
        formState.adress, formState.phoneNumber, formState.emailAdress
    ].every(Boolean) && Number(formState.phoneNumber);


    const handleSubmitInfo = () => {
       if(canSumbit) {
            dispatch(productsOrdered(formState));
            setTimeout(() => {
                navigate('/products/ordered');
            }, 500);
       }
    }


    return ( 
        <form className="add-product-form" onSubmit={(e) => e.preventDefault()}>
            <label className="confirm-title">Customer info</label>
            <br />
            <input type="text" placeholder="first name" value={formState.firstName} onChange={changeFirstName} className="name"/> 
            <input type="text" placeholder="last name" value={formState.lastName} onChange={changeLasttName} className="name"/>
            <br />
            <br />
            <input type="text" placeholder="adress" value={formState.adress} onChange={changeAdress} className="adress"/>
            <br />
            <input type="text" placeholder="phone number" value={formState.phoneNumber} onChange={changePhoneNumber} className="number"/>
            <br />
            <input type="text"  placeholder="email adress" value={formState.emailAdress} onChange={changeEmailAdress} className="email"/>
            <br />
            <button onClick={handleSubmitInfo} className="add-button-main">Confirm order</button>
        </form>
    );
}
 
export default ConfirmOrderForm;