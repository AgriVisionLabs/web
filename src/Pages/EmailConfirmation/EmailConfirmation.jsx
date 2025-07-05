import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, useSearchParams } from 'react-router-dom';
import EmailVerified from '../EmailVerified/EmailVerified';
import VerificationFailed from '../VerificationFailed/VerificationFailed';
import EmailAlreadyVerified from '../EmailAlreadyVerified/EmailAlreadyVerified';
import Loading from '../Loading/Loading';
import { AllContext } from '../../Context/All.context';

const EmailConfirmation = () => {
    let {baseUrl}=useContext(AllContext)
    const [searchParams, setSearchParams] = useSearchParams(false)
    // const token=useParams("token");
    // console.log("token : ",token)
    let TokenConfirmation=searchParams.get("token");
    // console.log(TokenConfirmation)
    // const [searchQuery, setSearchQuery] = useState(searchParams.get("token") || "");
    // let EmailConfirmation=searchParams.get("email");
    let [tokenVerification,setTokenVerification]=useState(false);
    let [emailVerification,setEmailVerification]=useState(false);
    let [emailConfirmed,setEmailConfirmed]=useState(false);
    let [loading,setLoading]=useState(true);
    let EmailFormat="user@example.com";
    if(TokenConfirmation){
        const parts = TokenConfirmation.split('.');
        const decodedPayload = atob(parts[1]);
        const parsedPayload = JSON.parse(decodedPayload);
        EmailFormat=parsedPayload.email;
        }
    async function sendEmailConfirmation(){
        const loadingId =toast.loading("Waiting...");
        try{
            const option={
                url:`${baseUrl}/auth/confirm-email`,
                method:"POST",
                data:{
                    "token":TokenConfirmation,
                },
            }
            let {data}= await axios(option);
            toast.success("Email confirmed");
            
            setTokenVerification(true);
            setEmailVerification(true);
            setEmailConfirmed(false);
        }catch(error){
            if(error.response.data.errors[0].description=="The email is already confirmed."){
                console.log(error.response.data.errors[0].description)
                setTokenVerification(true);
                setEmailVerification(true);
                setEmailConfirmed(true);
            }
            else{toast.error(error.response.data.errors[0].description);
                console.log(error.response.data.errors[0].description)
                setTokenVerification(true);
                setEmailVerification(false);
                setEmailConfirmed(false)
            }
            
        }
        finally{
            setLoading(false)
            toast.dismiss(loadingId);
        }
    }
    useEffect(()=>{
        sendEmailConfirmation()
    },[])
    return (
        <>
            <div className="h-screen w-screen">
                {
                loading?<Loading/>
                :emailVerification&&tokenVerification&&!emailConfirmed?<EmailVerified/>
                :emailVerification&&tokenVerification&&emailConfirmed?<EmailAlreadyVerified/>
                :<VerificationFailed children={EmailFormat}/>
                
                }
                {/* {EmailFormat&&tokenVerification?<EmailVerified/>:(tokenVerification?<EmailAlreadyVerified/>:<VerificationFailed/>)} */}
            </div>
        </>
    );
}

export default EmailConfirmation;
