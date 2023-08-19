import { useSelector } from "react-redux"
import { selectAllSellers } from "./sellersSlice"
import { Link } from "react-router-dom";

export const SellerList = () => {
    const users = useSelector(selectAllSellers);
    
    const usersList = users.map(user => (
        <div key={user.id} className="users">
            <Link to={'/users/' + user.id} key={user.id}  className="user"><li key={user.id}>{user.name}</li></Link>
        </div>
    ))

    return usersList;



}