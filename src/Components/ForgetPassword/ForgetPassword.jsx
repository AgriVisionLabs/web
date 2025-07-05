import { useContext } from "react";
import { AllContext } from "../../Context/All.context";
import { object, string } from "yup";
import { useFormik } from "formik";
import axios from "axios";
import toast from "react-hot-toast";



const ForgetPassword = (children) => {
    let {setForgetPassword,setOtp,outClick,baseUrl}=useContext(AllContext);
    //setEmailOfForgotPassword
    var validationSchema=object({
        email:string().required("Email is required").email("Email is invalid")
    })
    async function sendEmail(values){
        console.log("sendEmail : ")
        const loadingId =toast.loading("Waiting...")
        
        try {
            const options={
                url:`${baseUrl}/Auth/forget-password`,
                method:"POST",
                data:values,
            }
            let {data}=await axios(options);
            children.setEmailOfForgotPassword(formik.values.email);
            setOtp(true);
            setForgetPassword(false);
        }catch(error){
            toast.error("Incorrect email or password ("+error+")");
            console.log("sendEmail : ",error)
        }finally{
            toast.dismiss(loadingId);
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
            <section className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70  font-manrope backdrop-blur-md" onClick={(e)=>{
                        if(e.target===e.currentTarget){
                            outClick()
            }}}>
                
                <div className=" w-[540px] h-[530px] border-2 rounded-2xl bg-white flex  flex-col items-center">
                <div className="w-[90%] mt-5 text-xl  flex justify-end">
                    <i className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300 " onClick={()=>{setForgetPassword(false)}} ></i>
                </div>
                <div className="flex justify-center items-center mt-8 mb-5">
                <div className="w-[60px] h-[60px] bg-mainColor rounded-xl flex justify-center items-center">
                <i className="fa-solid fa-lock text-2xl text-white"></i>
                </div>
                </div>
                <h1 className="text-[25px] text-mainColor capitalize font-medium my-5">forgot password ?</h1>
                <p className="w-[420px] text-[16px] text-center text-[#333333]">Don’t worry! it occurs. Please enter the email address linked with your account.</p>
                <form action="" className="w-[75%] my-8 flex flex-col items-center" onSubmit={formik.handleSubmit}>
                    <input type="text" placeholder="Enter your Email" className="formControl" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                    <button type='submit' className="btn w-[90%] py-5 bg-mainColor text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium my-20" >Send Code</button>
                </form>
                </div>
                
            </section>
        </>
    );
}

export default ForgetPassword;
