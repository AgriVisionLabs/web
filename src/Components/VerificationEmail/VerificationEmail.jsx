import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { userContext } from '../../Context/User.context';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AllContext } from '../../Context/All.context';

const VerificationEmail = ({ email }) => {
    const navigate=useNavigate();
    let {verification,setVerification}=useContext(userContext);
    let {baseUrl}=useContext(AllContext)
    let [seconds,setSeconds]=useState(30);
    let [errorMessage, setErrorMessage]=useState('');
    let [isEmailVerified, setIsEmailVerified]=useState(false);
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
        try{
            setErrorMessage(''); // Clear any previous error
            console.log(email)
            const option={
                url:`${baseUrl}/auth/resend-confirmation-email`,
                method:"POST",
                data:{
                    "email":email
                },
            }
            let {data}= await axios(option);
            console.log("Verification email sent successfully")
            
            // Show success message
            setErrorMessage(""); // Clear any errors
            // You could add a success state here if needed
            
        }catch(error){
            console.log("resend-confirmation-email error",error)
            
            // Handle different error cases
            if (error.response?.status === 400) {
                // Email is already verified
                setErrorMessage("This email is already verified. You can proceed to login.");
                setIsEmailVerified(true); // Disable further resend attempts
            } else if (error.response?.status === 404) {
                setErrorMessage("Email not found. Please check your email address.");
            } else {
                setErrorMessage("Failed to send verification email. Please try again later.");
            }
        }
    }
    // Removed automatic resend on mount to prevent "email already verified" error
    // useEffect(()=>{
    //     ResendVerificationEmail();
    // },[])
   // useEffect(()=>{witeTime()},[date.toLocaleTimeString()])
    return (
        <section className="fixed inset-0 h-[100vh] flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-md z-[999]" onClick={(e)=>{
            if(e.target===e.currentTarget){
                setVerification(false);
            }}}>
                
                <div className="w-[560px] border-2 rounded-2xl bg-white flex flex-col items-center pb-8">
                {/* Close button with X icon */}
                <div className="w-[90%] mt-3 text-[22px] flex justify-end">
                    <button 
                        className="text-[#9F9F9F] hover:text-gray-700 transition-colors duration-300 p-2 rounded-full hover:bg-gray-100" 
                        onClick={() => setVerification(false)}
                        aria-label="Close"
                    >
                        <svg 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path 
                                d="M18 6L6 18M6 6L12 12L18 18" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
                
                {/* Email icon */}
                <div className="flex justify-center items-center mt-4 mb-6">
                    <div className="w-[70px] h-[70px] bg-[#1e693029] rounded-full flex justify-center items-center">
                        <svg 
                            width="32" 
                            height="32" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-mainColor"
                        >
                            <rect 
                                x="2" 
                                y="4" 
                                width="20" 
                                height="16" 
                                rx="2" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                fill="none"
                            />
                            <path 
                                d="M22 7L13.03 12.7C12.71 12.89 12.36 13 12 13C11.64 13 11.29 12.89 10.97 12.7L2 7" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
                
                <h1 className="text-[22px] font-bold mb-4 text-center">Verify your email</h1>
                <h2 className="w-[400px] text-[17px] text-center font-medium text-[#6b6a6a] mb-3 mx-auto">To complete your registration, please verify:</h2>
                <p className="text-[19px] font-semibold mb-4 text-center">{email}</p>
                <h2 className="text-[17px] text-center font-medium text-[#6b6a6a] mb-6 px-8">Click the button below to send a verification email.</h2>
                
                {/* Display error message if exists */}
                {errorMessage && (
                    <div className="w-[85%] mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-center text-[15px] font-medium">{errorMessage}</p>
                    </div>
                )}
                
                {!isEmailVerified && (
                    seconds==0?<>
                    <button 
                        type='button' 
                        className="px-10 py-4 rounded-full border-2 font-medium mt-6 text-[16px] transition-all duration-300 bg-mainColor text-white border-mainColor hover:bg-white hover:text-mainColor hover:border-mainColor" 
                        onClick={()=>{
                            ResendVerificationEmail();
                            setSeconds(30)
                            intervalID=setInterval(witeTime,1000);
                        }}>
                        Resend verification email
                    </button>
                    </>
                    :<>
                    <p className="bg-[#F3F4F6] px-10 py-5 rounded-full text-[#9CA1A4] font-medium mt-6 text-[16px]">Resend in {seconds} S</p>
                    </> 
                )}
                
                    
                <p className="text-[13px] text-center font-medium text-[#6b6a6a] mt-6 mb-4">After sending, check your email and spam folder for the verification link.</p>
                </div>
            </section>
    );
}

export default VerificationEmail;
