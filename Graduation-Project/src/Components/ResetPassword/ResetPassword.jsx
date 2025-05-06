import React, { useContext, useEffect } from 'react';
import { AllContext } from '../../Context/All.context';
import { object, ref, string } from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useFormik } from 'formik';

const ResetPassword = (children) => {
    let{setOtp,setResetPassword,outClick}=useContext(AllContext);
    var validationSchema=object({
        email:string().required("Email is required"),
        otp:string().required("OTP is required"),
        newPassword:string().required("New Password is required"),
        ConfirmPassword:string().required("Confirm Password is required").oneOf([ref("newPassword")],"Passwords must match")
    })
    async function sendResetPassword(values){
        console.log("sendResetPassword : ")
        const loadingId =toast.loading("Waiting...")
        
        try {
            const options={
                url:" https://agrivision.tryasp.net/Auth/reset-password",
                method:"POST",
                data:values,
            }
            let {data}=await axios(options);
            console.log(data)
            toast.success("The password has been changed successfully.")
        }catch(error){
            toast.error("Incorrect email or password ("+error+")");
            console.log("sendResetPassword error : " ,error)
        }finally{
            toast.dismiss(loadingId);
        }
    }
    const formik=useFormik({
        initialValues:{
                otp:"",
                email:"",
                newPassword:"",
                ConfirmPassword:"",
        },
        validationSchema,
        onSubmit:sendResetPassword,
    })
    useEffect(()=>{
            formik.values.email=children.emailOfForgotPassword
            formik.values.otp=children.otpValue.join("")
            console.log("formik.values.email : " ,formik.values.email)
            console.log("formik.values.otp : " ,formik.values.otp)
        },[])
    return (
        <section className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70  font-manrope backdrop-blur-md " onClick={(e)=>{
            if(e.target===e.currentTarget){
                outClick()}}}>
                
        <div className=" w-[540px] h-[530px] border-2 rounded-2xl bg-white flex  flex-col items-center">
        <div className="w-[90%] mt-5 text-[22px]  flex justify-start">
        <i className="fa-solid fa-arrow-left text-[#9F9F9F] hover:text-black transition-colors duration-300" onClick={()=>{setResetPassword(false);
                        setOtp(true);
                    }} ></i>
        </div>
        <div className="flex justify-center items-center mt-7 mb-5">
        <div className="w-[60px] h-[60px] bg-mainColor rounded-xl flex justify-center items-center">
        <i className="fa-solid fa-retweet text-2xl text-white"></i>
        </div>
        </div>
        <h1 className="text-[25px] text-mainColor capitalize font-medium my-5">Reset Password</h1>
        <form action="" className="w-[75%] my-2 flex flex-col items-center" onSubmit={formik.handleSubmit}>
            <label htmlFor="NewPassword" className='text-[15px] self-start ms-5 mb-1 font-medium ' >New Password</label>
            <input type="password" id='NewPassword' placeholder="Enter password" className="formControl" name="newPassword" value={formik.values.newPassword} onBlur={formik.handleBlur} onChange={formik.handleChange}/>
            {formik.errors.newPassword&&console.log("formik.errors.newPassword ",formik.errors.newPassword)}
            <label htmlFor="ConfirmPassword" className='text-[15px] self-start ms-5 mb-1 font-medium '  >Confirm Password</label>
            <input type="password" id='ConfirmPassword' placeholder="Enter Confirm password" className="formControl" name="ConfirmPassword" value={formik.values.ConfirmPassword} onBlur={formik.handleBlur} onChange={formik.handleChange}/>
            {formik.errors.ConfirmPassword&&console.log("formik.errors.ConfirmPassword ",formik.errors.ConfirmPassword)}
            <button type='submit' className="btn w-[90%] py-5 bg-mainColor text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium my-12" >Reset Password</button>
        </form>
        </div>
        
    </section>
    );
}

export default ResetPassword;
