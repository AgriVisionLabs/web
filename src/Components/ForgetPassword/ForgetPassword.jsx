import { useContext, useState } from "react";
import { AllContext } from "../../Context/All.context";
import { object, string } from "yup";
import { useFormik } from "formik";
import axios from "axios";

const ForgetPassword = ({ setEmailOfForgotPassword }) => {
    let {setForgetPassword,setOtp,outClick,baseUrl}=useContext(AllContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    var validationSchema=object({
        email:string().required("Email is required").email("Email is invalid")
    })
    
    async function sendEmail(values){
        console.log("sendEmail : ")
        setLoading(true);
        setError("");
        
        try {
            const options={
                url:`${baseUrl}/Auth/request-password-reset`,
                method:"POST",
                data:values,
            }
            let {data}=await axios(options);
            setEmailOfForgotPassword(formik.values.email);
            setOtp(true);
            setForgetPassword(false);
        }catch(error){
            console.log("sendEmail error: ",error)
            
            // Handle specific error cases
            if (error.response?.status === 404) {
                const errorData = error.response?.data;
                if (errorData?.errors?.some(err => err.code === "User.NotFound")) {
                    setError("No account found with this email address.");
                } else {
                    setError("User not found. Please check your email address.");
                }
            } else if (error.response?.status === 429) {
                const errorData = error.response?.data;
                if (errorData?.errors?.some(err => err.code === "User.ExceedLimit")) {
                    setError("Too many password reset requests. Please try again later.");
                } else {
                    setError("Too many requests. Please wait before trying again.");
                }
            } else if (error.response?.status === 400) {
                const errorData = error.response?.data;
                if (errorData?.errors?.email) {
                    setError("Please enter a valid email address.");
                } else {
                    setError("Invalid request. Please check your email address.");
                }
            } else {
                setError("Failed to send reset code. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }
    
    const formik=useFormik({
        initialValues:{
                email:"",
        },
        validationSchema,
        onSubmit:sendEmail,
    })

    return (
        <>
            <section className="fixed inset-0 h-[100vh] flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-md z-[999]" onClick={(e)=>{
                        if(e.target===e.currentTarget){
                            outClick()
            }}}>
                
                <div className="w-[540px] h-[530px] border-2 rounded-2xl bg-white flex flex-col items-center justify-center relative">
                <div className="absolute top-5 right-5">
                    <button 
                        className="text-[#9F9F9F] hover:text-black transition-colors duration-300 p-2 rounded-full hover:bg-gray-100" 
                        onClick={()=>{setForgetPassword(false)}}
                        aria-label="Close"
                    >
                        <svg 
                            width="20" 
                            height="20" 
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
                
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="flex justify-center items-center mb-6">
                        <div className="w-[70px] h-[70px] bg-[#1e693029] rounded-full flex justify-center items-center">
                                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-mainColor">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                            <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                        </div>
                    </div>
                    <h1 className="text-[25px] text-mainColor capitalize font-medium mb-4">forgot password ?</h1>
                    <p className="w-[420px] text-[16px] text-center text-[#333333] mb-4">Don't worry! it occurs. Please enter the email address linked with your account.</p>
                    
                    {error && (
                        <div className="w-[420px] mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600 text-sm font-medium text-center">{error}</p>
                        </div>
                    )}
                    
                    <form action="" className="w-[420px] my-6 flex flex-col items-center" onSubmit={formik.handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Enter your Email" 
                        className={`formControl ${formik.errors.email && formik.touched.email ? "border-red-500 !text-red-500 !placeholder-red-500" : ""}`}
                        name="email" 
                        value={formik.values.email} 
                        onChange={formik.handleChange} 
                        onBlur={formik.handleBlur}
                        autoFocus={false}
                    />
                        <button 
                            type='submit' 
                            disabled={loading}
                            className={`btn w-full py-5 bg-mainColor text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium mt-6 transition-all duration-300 ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {loading ? "Sending..." : "Send Code"}
                        </button>
                    </form>
                </div>
                </div>
                
            </section>
        </>
    );
}

export default ForgetPassword;
