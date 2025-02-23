import { useContext } from "react";
import { userContext  } from "../../Context/User.context";
import { Navigate } from "react-router-dom";



const ProtectedRoute = ({children}) => {
    const {token}=useContext(userContext );
    if(token){
        console.log(token)
        return children;
    }else{
        return <Navigate to="/Login"/>;
    }
}

export default ProtectedRoute;
