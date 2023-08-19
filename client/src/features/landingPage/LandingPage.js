import { useNavigate } from "react-router-dom";
import useRunOnce from "./useRunOnce";

const LandingPage = () => {
const naviate = useNavigate()

useRunOnce({
    fn : () => setTimeout(() => {
        naviate('products');
    }, 3000),
    sessionKey: '1'
})

   return ( 
       <div className="landing-page">
           <h2 className="landing-title">Welcome to my online store<b>👋</b></h2>
       </div>
   )
}
 
export default LandingPage;