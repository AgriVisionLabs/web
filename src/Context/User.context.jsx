import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const userContext =createContext("");
export default function UserProvider(items){
    let children=items.children
    const [token,setToken]=useState(localStorage.getItem("token"));
    const [verification,setVerification]=useState(false);
    const [refreshToken,setRefreshToken]=useState(null);
    const [expiresIn,setExpiresIn]=useState(null)
    function logOut(){
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.setItem("index",0);
    }
    async function RefreshToken(){
        console.log("RefreshToken : ")
            const loadingId =toast.loading("Waiting...")
            try {
                const options={
                    url:"https://api.agrivisionlabs.tech/Auth/refresh",
                    method:"POST",
                    data:{
                        token:token,
                        refreshToken:refreshToken,
                    },
                }
                let {data}=await axios(options);
                    setToken(data.token);
                    localStorage.setItem("token",data.token);
                    setRefreshToken(data.refreshToken);
                    console.log("RefreshToken : end :"+token)
                    
                }
                catch(error){
                toast.error("Incorrect email or password ("+error+")");
                console.log(error)
                
            }finally{
                toast.dismiss(loadingId);
            }
        }
        useEffect(()=>{
            let intervalId;
            if(token&&refreshToken){
                intervalId=setInterval(() => {RefreshToken()}
                ,(expiresIn*1000*6-3))
            }
            clearInterval(intervalId)
        }
        ,[token,refreshToken])
    return <userContext.Provider value={{token,setToken,logOut,verification,setVerification,refreshToken,setRefreshToken,expiresIn,setExpiresIn}}>
        {children}
    </userContext.Provider>
}