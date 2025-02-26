
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css"
import { useContext, useState} from "react";
import ForgetPassword from "../../Components/ForgetPassword/ForgetPassword";
import { AllContext } from "../../Context/All.context";
import OTP from "../../Components/OTP/OTP";
import ResetPassword from "../../Components/ResetPassword/ResetPassword";
import OPTLogin from "../../Components/OPTLogin/OPTLogin";
import { Helmet } from "react-helmet";
import { userContext } from "../../Context/User.context";
import { object, string } from "yup";
import toast from "react-hot-toast";
import axios from "axios";
import { useFormik } from "formik";


const Login = () => {
    let {forgetPassword,otp,setForgetPassword,resetPassword,optLogin,setOptLogin}=useContext(AllContext);
    // const [inCorrectEmailorPassword,setInCorrectEmailorPassword]=useState(null);
    const navigate=useNavigate();
    const {setToken}=useContext(userContext);
    const validationSchema=object({
        email:string().required("Email is required").email("Email is invalid"),
        password:string().required("Password is required").matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,"password should be at least eight characters, at least one upper case English letter, one lower case English letter, one number and one special character"),
    });
    async function sendDataToLogin(values){
        const loadingId =toast.loading("Waiting...")
        try {
            const options={
                url:"https://agrivision.tryasp.net/auth",
                method:"POST",
                data:values,
            }
            let {data}=await axios.request(options);
            if(data.token){
                setToken(data.token);
                toast.success("User Logged in successfully");
                setTimeout(()=>{navigate("/Home")},500);
                setToken(data.token);
                localStorage.setItem("token",data.token);
            }
        }catch(error){
            toast.error("Incorrect email or password ("+error.response.data.errors[0].description+")");
            
        }finally{
            toast.dismiss(loadingId);
        }
    }
    const formik=useFormik({
        initialValues:{
                email:"",
                password:"",
        },
        validationSchema,
        onSubmit:sendDataToLogin,
    });
    return (
        <>
        <Helmet>
            <title>Login Page</title>
            <meta name="description" content="Login Page"/>
        </Helmet>
            <section className={`${styles.Login} h-[100vh] w-[100vw] font-manrope`}>
                <div className=" h-full w-full">
                    <div className=" w-full h-full grid lg:grid-cols-12  " >
                        <div className="contentAndbg  lg:col-span-5">
                        <div className="bg-black  w-full h-full  bg-opacity-70  flex flex-col justify-center items-center text-center ">
                            <div className="w-[450px]  h-[200px] md:w-[640px]  lg:w-[420px]  lg:h-[500px] xl:w-[520px]  xl:h-[534px] text-white container flex flex-col justify-center  ">
                                <div className="lg:w-[400px] lg:h-[300px]  xl:w-[510px] flex flex-col justify-between">
                                <div className="lg:w-[400px] xl:w-[510px] lg:h-[170px] flex flex-col items-center justify-center">
                                <h1 className=" text-[24px] md:text-[30px]  lg:text-4xl pb-4 lg:pb-7 font-medium">Welcome Back !</h1>
                                <p className=" text-[16px] lg:text-[22px] font-medium xl:px-16 ">Please Sign in into your Account With the give details to continue</p>
                                </div>
                                <p className=" text-[18px] lg:text-[19px] font-medium py-3 lg:mb-5">Don’t have an account? create new account</p>
                                
                                </div>
                                <div className="flex justify-center  w-[490px] md:w-[500px] lg:w-96   self-center ">
                                <Link to={"/SignUp"} className="w-[90%] ">
                                <button className="btn   bg-transparent border-2 py-5 font-medium w-full border-mainColor hover:bg-mainColor text-[18px]">Register</button>
                                </Link>
                                </div>
                                
                            </div>
                            
                        </div>
                        </div>
                        <div className=" lg:col-span-7  flex justify-center items-center">
                            <div className="w-[450px]  md:w-[640px]  lg:w-[500px]  ">
                                <h1 className="text-center text-[28px] md:text-[33px] lg:text-[38px] my-5 text-mainColor font-medium">Sign in to your account</h1>
                                <form action="" onSubmit={formik.handleSubmit} >
                                    <input type="text" placeholder="Enter your Email" className="formControl" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                    <input type="password" placeholder="Enter Your Password" className="formControl"  name="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                    <div className="flex justify-between items-center my-3">
                                        <div className=" flex items-center mx-7 ">
                                        <input type="checkbox" className=" my-2 mx-3 w-4 h-4  accent-mainColor  " id="Remember" />
                                        <label htmlFor="Remember me" className="text-[15px] " >Remember me</label>
                                        </div>
                                        <p className="text-mainColor mx-7 cursor-pointer" onClick={()=>{setForgetPassword(true)}} >Forgot Password ?</p>
                                        
                                    </div>
                                    {/* onClick={()=>{setOptLogin(true); */}
                                    {/* // }} */}
                                    <button type="submit"   className="btn w-[90%] px-2 py-5 mx-5 my-10 text-white bg-mainColor  hover:border-mainColor hover:text-mainColor hover:bg-transparent font-medium border-2 " 
                                    
                                    >Login</button>
                                </form>
                                
                            </div>
                        </div>
                    </div>
                </div>

                    {forgetPassword?
                        <div className=" absolute inset-0 " >
                        <ForgetPassword/>
                        </div> :"" 
                    }
                    {otp?
                        <div className="absolute inset-0">
                        <OTP/>
                        </div>:""
                        }
                    {resetPassword?
                        <div className=" absolute inset-0">
                        <ResetPassword/>
                        </div>:""
                        }
                    {optLogin?
                        <div className=" absolute inset-0">
                        <OPTLogin/>
                        </div>:""
                    }

                
            </section>
        </>
    );
}

export default Login;
