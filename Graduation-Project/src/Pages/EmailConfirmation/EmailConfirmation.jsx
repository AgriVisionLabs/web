import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, useSearchParams } from 'react-router-dom';
import EmailVerified from '../EmailVerified/EmailVerified';
import VerificationFailed from '../VerificationFailed/VerificationFailed';
import EmailAlreadyVerified from '../EmailAlreadyVerified/EmailAlreadyVerified';
import Loading from '../Loading/Loading';

const EmailConfirmation = () => {
    const [searchParams, setSearchParams] = useSearchParams(false)
    const token=useParams("token");
    console.log("token : ",token)
    let TokenConfirmation=searchParams.get("token");
    console.log(TokenConfirmation)
    // const [searchQuery, setSearchQuery] = useState(searchParams.get("token") || "");
    // let EmailConfirmation=searchParams.get("email");
    let [tokenVerification,setTokenVerification]=useState(false);
    let [loading,setLoading]=useState(true);
    let EmailFormat="";
    if(TokenConfirmation){
    const parts = TokenConfirmation.split('.');
    const decodedPayload = atob(parts[1]);
    const parsedPayload = JSON.parse(decodedPayload);
    EmailFormat=parsedPayload.email;
    }
    async function sendEmailConfirmation(){
        setLoading(false);
        const loadingId =toast.loading("Waiting...");
        try{
            const option={
                url:"https://agrivision.tryasp.net/auth/confirm-email",
                method:"POST",
                data:{
                    "token":TokenConfirmation,
                },
            }
            let {data}= await axios(option);
            
            toast.success("Email confirmed");
            
        }catch(error){
            if(error.response.data.errors[0].description=="The email is already confirmed."){
                setTokenVerification(true);
            }
            else{toast.error(error.response.data.errors[0].description);}
            
        }
        finally{
            toast.dismiss(loadingId);
        }
    }
    useEffect(()=>{
        sendEmailConfirmation()
    },[])
    // setTimeout(() => {
    //     sendEmailConfirmation()
    // }, 5000);
    return (
        <>
            <div className="h-screen w-screen">
                {loading?<Loading/>:EmailFormat&&tokenVerification?<EmailVerified/>:(tokenVerification?<EmailAlreadyVerified/>:<VerificationFailed/>)}
                {/* {EmailFormat&&tokenVerification?<EmailVerified/>:(tokenVerification?<EmailAlreadyVerified/>:<VerificationFailed/>)} */}
            </div>
        </>
    );
}

export default EmailConfirmation;
