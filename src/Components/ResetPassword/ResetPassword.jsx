import React, { useContext, useEffect, useState } from 'react';
import { AllContext } from '../../Context/All.context';
import { object, ref, string } from 'yup';
import axios from 'axios';
import { useFormik } from 'formik';

const ResetPassword = ({ resetToken }) => {
    let{setOtp,setResetPassword,setForgetPassword,outClick,baseUrl}=useContext(AllContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    var validationSchema=object({
        newPassword:string()
            .required("New Password is required")
            .matches(
                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
                "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
            ),
        confirmPassword:string()
            .required("Confirm Password is required")
            .oneOf([ref("newPassword")],"Passwords must match")
    })
    
    async function sendResetPassword(values){
        console.log("sendResetPassword: ", values)
        setLoading(true);
        setError("");
        
        try {
            const options={
                url:`${baseUrl}/Auth/password-reset`,
                method:"POST",
                data:{
                    token: resetToken,
                    newPassword: values.newPassword
                },
            }
            let {data}=await axios(options);
            console.log("Password reset successful:", data)
            setSuccess(true);
            
            // Close modal after 3 seconds
            setTimeout(() => {
                setResetPassword(false);
                setForgetPassword(false);
                setSuccess(false);
            }, 3000);
            
        }catch(error){
            console.log("sendResetPassword error:", error)
            
            // Handle specific error cases
            if (error.response?.status === 401) {
                const errorData = error.response?.data;
                if (errorData?.errors?.some(err => err.code === "User.InvalidPasswordResetToken")) {
                    setError("Password reset session has expired. Please start over.");
                } else if (errorData?.errors?.some(err => err.code === "User.InvalidPasswordResetOtp")) {
                    setError("Your verification code has expired or is invalid. Please verify your email again.");
                    // Redirect back to OTP verification after 3 seconds
                    setTimeout(() => {
                        setResetPassword(false);
                        setOtp(true);
                    }, 3000);
                } else {
                    setError("Invalid or expired reset token. Please start over.");
                }
            } else if (error.response?.status === 400) {
                const errorData = error.response?.data;
                if (errorData?.errors?.NewPassword) {
                    // Handle password validation errors from server
                    setError(errorData.errors.NewPassword[0] || "Password does not meet requirements.");
                } else if (errorData?.errors?.token) {
                    setError("Invalid reset token. Please start over.");
                } else {
                    setError("Invalid request. Please check your password and try again.");
                }
            } else if (error.response?.status === 429) {
                setError("Too many attempts. Please try again later.");
            } else {
                setError("Failed to reset password. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }
    
    const formik=useFormik({
        initialValues:{
                newPassword:"",
                confirmPassword:"",
        },
        validationSchema,
        onSubmit:sendResetPassword,
    })
    
    // If no token is provided, show error
    if (!resetToken) {
        return (
                    <section className="fixed inset-0 h-[100vh] flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-md z-[999]" onClick={(e)=>{
            if(e.target===e.currentTarget){
                outClick()}}}>
                <div className="w-[540px] h-[530px] border-2 rounded-2xl bg-white flex flex-col items-center justify-center">
                    <div className="text-center">
                        <div className="w-[60px] h-[60px] bg-red-500 rounded-full flex justify-center items-center mx-auto mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h1 className="text-[25px] text-red-500 font-medium mb-4">Session Expired</h1>
                        <p className="text-[16px] text-[#333333] mb-6">Your password reset session has expired. Please start over.</p>
                        <button
                            onClick={() => {
                                setResetPassword(false);
                                setForgetPassword(true);
                            }}
                            className="px-6 py-3 bg-mainColor text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                        >
                            Start Over
                        </button>
                    </div>
                </div>
            </section>
        );
    }
    
    return (
        <section className="fixed inset-0 h-[100vh] flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-md z-[999]" onClick={(e)=>{
            if(e.target===e.currentTarget){
                outClick()}}}>
                
        <div className="w-[540px] h-[530px] border-2 rounded-2xl bg-white flex flex-col items-center justify-center relative">
        <div className="absolute top-5 left-5">
        <button 
            className="text-[#9F9F9F] hover:text-black transition-colors duration-300 p-2 rounded-full hover:bg-gray-100" 
            onClick={()=>{setResetPassword(false); setOtp(true);}}
            aria-label="Go back"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </button>
        </div>
        
        <div className="flex flex-col items-center justify-center text-center">
            <div className="flex justify-center items-center mb-6">
                <div className="w-[70px] h-[70px] bg-[#1e693029] rounded-full flex justify-center items-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-mainColor">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <circle cx="12" cy="16" r="1" fill="currentColor"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                </div>
            </div>
            <h1 className="text-[25px] text-mainColor capitalize font-medium mb-4">Reset Password</h1>
            <div className="flex items-center justify-center mb-4">
                <p className="text-[16px] text-center text-[#333333]">Enter your new password</p>
                <div className="group ml-2 relative">
                    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <div className="absolute top-1/2 left-full transform -translate-y-1/2 ml-2 w-80 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                        <div className="absolute top-1/2 right-full transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-800"></div>
                        <div className="font-medium text-blue-200 mb-1">Password Requirements:</div>
                        <div>• At least 8 characters long</div>
                        <div>• Contains uppercase and lowercase letters</div>
                        <div>• Contains at least one number</div>
                        <div>• Contains at least one special character</div>
                    </div>
                </div>
            </div>
        
            {error && (
                <div className="w-[420px] mb-4">
                    <p className="text-red-600 text-sm font-medium text-center bg-red-50 border border-red-200 rounded-lg p-3">
                        {error}
                    </p>
                </div>
            )}
        
            {success ? (
                <div className="flex flex-col items-center">
                    <div className="w-[70px] h-[70px] bg-[#1e693029] rounded-full flex justify-center items-center mb-6">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-mainColor">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h2 className="text-[25px] text-mainColor font-medium mb-4">Password Reset Successful!</h2>
                    <p className="text-[16px] text-[#333333] text-center mb-4 px-8">Your password has been successfully reset. You can now login with your new password.</p>
                    <p className="text-[14px] text-[#666666] px-8">This window will close automatically...</p>
                </div>
            ) : (
                <>
                    <form action="" className="w-[420px] my-4 flex flex-col items-center" onSubmit={formik.handleSubmit}>
                        <div className="relative w-full">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                id='NewPassword' 
                                placeholder="New Password" 
                                className={`formControl ${formik.errors.newPassword && (formik.touched.newPassword || formik.submitCount > 0) ? "border-red-500 text-red-500 placeholder-red-400" : ""}`}
                                name="newPassword" 
                                value={formik.values.newPassword} 
                                onBlur={formik.handleBlur} 
                                onChange={formik.handleChange}
                                autoFocus={false}
                                onKeyDown={(e) => {
                                    if (e.key === 'Tab') {
                                        e.preventDefault();
                                        document.getElementById('ConfirmPassword').focus();
                                    }
                                }}
                            />
                                            <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                >
                                {showPassword ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.05 8.05M14.12 14.12l1.827 1.828" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        
                        <div className="relative w-full mt-4">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                id='ConfirmPassword' 
                                placeholder="Confirm Password" 
                                className={`formControl ${formik.errors.confirmPassword && (formik.touched.confirmPassword || formik.submitCount > 0) ? "border-red-500 text-red-500 placeholder-red-400" : ""}`}
                                name="confirmPassword" 
                                value={formik.values.confirmPassword} 
                                onBlur={formik.handleBlur} 
                                onChange={formik.handleChange}
                                autoFocus={false}
                                onKeyDown={(e) => {
                                    if (e.key === 'Tab') {
                                        e.preventDefault();
                                        document.getElementById('NewPassword').focus();
                                    }
                                }}
                            />
                                            <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                >
                                {showConfirmPassword ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.05 8.05M14.12 14.12l1.827 1.828" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        
                        <button 
                            type='submit' 
                            disabled={loading}
                            className={`btn w-full py-5 bg-mainColor text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium mt-8 transition-all duration-300 ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </>
            )}
        </div>
        </div>
        
    </section>
    );
}

export default ResetPassword;
