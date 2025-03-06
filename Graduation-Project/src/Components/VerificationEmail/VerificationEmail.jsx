import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { userContext } from '../../Context/User.context';
import { Check } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const VerificationEmail = ({children}) => {
    const navigate=useNavigate();
    let {verification,setVerification}=useContext(userContext);
    let [seconds,setSeconds]=useState(30);
    // const date= new Date();
    // date.toISOString
    let intervalID=setInterval(witeTime,1000);
    function witeTime(){
        
        if(seconds>=1){
            seconds=seconds-1;
            setSeconds(seconds);
        }else{
            setSeconds(0);
            clearInterval(intervalID)
        }
    } 
    
    
    async function ResendVerificationEmail(){
        const loadingId =toast.loading("Waiting...",{position:"top-left"});
        try{
            
            const option={
                url:"https://agrivision.tryasp.net/auth/resend-confirmation-email",
                method:"POST",
                data:{
                    "email":children
                },
            }
            let {data}= await axios(option);
            
        }catch(error){
            console.log(error)
            toast.error(error,{position:"top-left"});
        }
        finally{
            toast.dismiss(loadingId);
        }
    }
    useEffect(()=>{
        ResendVerificationEmail();
    },[])
   // useEffect(()=>{witeTime()},[date.toLocaleTimeString()])
    return (
        <section className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70  font-manrope backdrop-blur-md" onClick={(e)=>{
            if(e.target===e.currentTarget){
                setVerification(false);
            }}}>
                
                <div className=" w-[540px]  border-2 rounded-2xl bg-white flex  flex-col items-center">
                <div className="w-[90%] mt-5 text-[22px]  flex justify-end hover:text-black transition-all duration-150">
                    <i className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300 " onClick={()=>{
                        setVerification(false);
                    }} ></i>
                </div>
                <div className="flex justify-center items-center mt-8 mb-5">
                <div className="w-[60px] h-[60px] bg-[#1e693029] rounded-full flex justify-center items-center">
                <i className="fa-regular fa-envelope text-2xl text-mainColor"></i>
                </div>
                </div>
                <h1 className="text-[20px]  font-bold my-5">Check your email</h1>
                <h2 className="w-[350px] text-[16px] text-center font-medium text-[#6b6a6a] ">We've sent a verification link to:</h2>
                <p className="text-[18px]  font-semibold my-5">{children}</p>
                <h2 className="text-[16px] text-center font-medium text-[#6b6a6a] ">Click the link in the email to verify your address.</h2>
                {seconds==0?<>
                <button className=" px-9  py-4 rounded-full  bg-mainColor text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium  mt-9" onClick={()=>{
                    ResendVerificationEmail();
                    setSeconds(30)
                    intervalID=setInterval(witeTime,1000);
                }}>Resend verification email</button>
                </>
                :<>
                <p className="bg-[#F3F4F6] px-9  py-5 rounded-full text-[#9CA1A4]  font-medium  mt-9">Resend in {seconds} S</p>
                </> }
                
                    
                <p className="text-[12px] text-center font-medium text-[#6b6a6a] my-5">Can't find the email? Check your spam folder.</p>
                </div>
            </section>
    );
}

export default VerificationEmail;
