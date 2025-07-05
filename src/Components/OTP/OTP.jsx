
import { useContext, useEffect } from 'react';
import { AllContext } from '../../Context/All.context';
import Check from '../check/Check';
import ResetPassword from '../ResetPassword/ResetPassword';
import { object, string } from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useFormik } from 'formik';
ResetPassword
const OTP = (children) => {
    let {setOtp,setForgetPassword,setResetPassword,outClick,baseUrl}=useContext(AllContext);
    
    console.log(children.emailOfForgotPassword)
        var validationSchema=object({
            email:string().required("Email is required"),
            otp:string().required("OTP is required")
        })
        async function sendOTP(values){
            console.log("sendOTP : ")
            const loadingId =toast.loading("Waiting...")
            
            try {
                const options={
                    url:`${baseUrl}/Auth/verify-otp`,
                    method:"POST",
                    data:values,
                }
                let {data}=await axios(options);
                console.log("sendOTP done")
                setResetPassword(true);
                setOtp(false);
            }catch(error){
                toast.error("Incorrect email or password ("+error+")");
                console.log(error)
            }finally{
                toast.dismiss(loadingId);
            }
        }
        const formik=useFormik({
            initialValues:{
                    otp:"",
                    email:""
            },
            validationSchema,
            onSubmit:sendOTP,
        })
        useEffect(()=>{
                formik.values.email=children.emailOfForgotPassword
                formik.values.otp=children.otpValue.join("")
            },[children.otpValue])
        
    return (
        <section className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70  font-manrope backdrop-blur-md" onClick={(e)=>{
            if(e.target===e.currentTarget){
                outClick()}}}>
                
                <div className=" w-[540px] h-[530px] border-2 rounded-2xl bg-white flex  flex-col items-center">
                <div className="w-[90%] mt-5 text-[22px]  flex justify-start">
                    <i className="fa-solid fa-arrow-left text-[#9F9F9F] hover:text-black transition-colors duration-300 " onClick={()=>{setOtp(false);
                        setForgetPassword(true);
                    }} ></i>
                </div>
                <div className="flex justify-center items-center mt-8 mb-5">
                <div className="w-[60px] h-[60px] bg-mainColor rounded-xl flex justify-center items-center">
                <i className="fa-regular fa-envelope-open text-2xl text-white"></i>
                </div>
                </div>
                <h1 className="text-[25px] text-mainColor capitalize font-medium my-5">OTP Verification</h1>
                <p className="w-[350px] text-[16px] text-center text-[#333333] ">Enter the verification code we just sent on your
                email address</p>
                <form action="" className="w-[75%] my-8 flex flex-col items-center" onSubmit={formik.handleSubmit}>
                    <div className='space-x-5'>
                    <Check otpValue={children.otpValue} setOtpValue={children.setOtpValue}/>
                    
                    </div>
                    <button type='submit' className="btn w-[90%] py-5 bg-mainColor text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium mt-20">Verify</button>
                    <p className="my-3 text-[#333333] text-[15px]">Didn’t received code? <span className='text-mainColor'>Resend</span></p>
                </form>
                </div>
                
            </section>
    );
}

export default OTP;
