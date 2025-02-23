
import { Link, useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css"
import { object, ref, string } from "yup";
import toast from "react-hot-toast";
import axios from "axios";
import { useFormik } from "formik";
import { Helmet } from "react-helmet";
import { useState } from "react";

const SignUp = () => {
    const navigate=useNavigate();
    const validationSchema=object({
        userName:string().required("Name is required").min(3,"Name must be at least 3 characters").max(32,"Name can not be than 32 characters"),
        email:string().required("Email is required").email("Email is not a valid email address."),
        password:string().required("Password is required").matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,"password should be at least eight characters, at least one upper case English letter, one lower case English letter, one number and one special character"),
        rePassword:string().required("Confirm Password is required").oneOf([ref("password")],"Password and Confirm Password should be the same"),
        firstName:string().required("Name is required").min(3,"Name must be at least 3 characters").max(100,"Name can not be than 100 characters"),
        lastName:string().required("Name is required").min(3,"Name must be at least 3 characters").max(100,"Name can not be than 100 characters"),
       // phone:string().required("Phone is required").matches(/^(02)?01[0125][0-9]{8}$/,"Sorry, we Accept Egyption Phone Numbers Only"),
    }) ;
    async function sendDataToRegister(values){
        const loadingId =toast.loading("Waiting...",{position:"top-left"});
        try{
            const option={
                url:"http://agrivision.tryasp.net/auth/register",
                method:"POST",
                data:values,
            }
            let {data}= await axios(option);
            toast.success("User created successfully",{position:"top-left"});
            setTimeout(()=>{navigate("/Login")},500);
            
        }catch(error){
            toast.error(error.response.data.errors[0].description,{position:"top-left"});
        }
        finally{
            toast.dismiss(loadingId);
        }
    }
    const formik=useFormik({
        initialValues:{
                userName:"",
                email:"",
                password:"",
                rePassword:"",
                firstName: "",
                lastName:"",
                // phone:""
        },
        validationSchema,
        onSubmit:sendDataToRegister,
    });
    return (
        
        <>
            <Helmet>
            <title>Sign up Page</title>
            <meta name="description" content="Sign up Page"/>
            </Helmet>
            <section className={`${styles.SignUp} h-[100vh] w-[100vw] font-manrope`}>
                    <div className=" h-full w-full">
                        <div className=" w-full h-full grid grid-cols-12 " >
                            
                            <div className="col-span-7 flex justify-center items-center ">
                                <div className="w-[480px] flex flex-col justify-center items-center ">
                                    <h1 className=" text-[35px]  my-5 text-mainColor font-medium">Create your new account</h1>
                                    <form action="" className="" onSubmit={formik.handleSubmit}>
                                        <input type="text" placeholder="First Name"  name="firstName" className="formControl" value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                        {formik.errors.firstName && formik.touched.firstName && <p className="text-red-500 mt-1 mx-6 text-ms">* {formik.errors.firstName}</p>}
                                        <input type="text" placeholder="Last Name" name="lastName" className="formControl"  value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                        {formik.errors.lastName && formik.touched.lastName && <p className="text-red-500 mt-1 mx-6 text-ms">* {formik.errors.lastName}</p>}
                                        <input type="text" placeholder="Username" name="userName" className="formControl" value={formik.values.userName} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                        {formik.errors.userName && formik.touched.userName && <p className="text-red-500 mt-1 mx-6 text-ms">* {formik.errors.userName}</p>}
                                        <input type="email" placeholder="Email" name="email" className="formControl" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                        {formik.errors.email && formik.touched.email && <p className="text-red-500 mt-1 mx-6 text-ms">* {formik.errors.email}</p>}
                                        <input type="password" placeholder="Password" name="password" className="formControl" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                        {formik.errors.password && formik.touched.password && <p className="text-red-500 mt-1 mx-6 text-ms">* {formik.errors.password}</p>}
                                        <input type="password" placeholder="Confirm Password" name="rePassword" className="formControl" value={formik.values.rePassword} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                        {formik.errors.rePassword && formik.touched.rePassword && <p className="text-red-500 mt-1 mx-6 text-ms">* {formik.errors.rePassword}</p>}
                                        <input type="tel" placeholder="Phone Number" name="phoneNumber" className="formControl" />
                                        
                                        <div className="flex justify-between   my-3">
                                            <div className=" flex  mx-7 items-baseline ">
                                            <input type="checkbox" className=" my-2 mx-3 w-4 h-4  accent-mainColor" id="Remember" />
                                            <label htmlFor="Remember me" className="text-[16px]" >I agree to <a href="" className="text-mainColor underline underline-offset-4 decoration-mainColor the">Terms and Conditions</a> and <a href="" className="text-mainColor underline underline-offset-4 decoration-mainColor the">Privacy Statement</a></label>
                                            </div>

                                        </div>
                                        <button type="submit"  className="btn w-[90%] px-2 py-5 mx-5 my-10 text-white bg-mainColor  hover:border-mainColor hover:text-mainColor hover:bg-transparent font-medium border-2"> Login</button>
                                    </form>
                                    
                                </div>
                            </div>
                            <div className="contentAndbg  col-span-5">
                            <div className="bg-black  w-full h-full  bg-opacity-70 overflow-hidden  flex flex-col justify-center items-center text-center ">
                                <div className="w-[560px] h-[534px] text-white container flex flex-col justify-center  ">
                                    <div className="w-[560px] h-[300px]  flex flex-col justify-between">
                                    <div className="w-[560px] h-[170px] flex flex-col items-center justify-center">
                                    <h1 className="text-[32px] pb-7 font-semibold">Register Now</h1>
                                    <p className=" text-[22px] font-medium px-10 ">Please provide the informations to register your account</p>
                                    </div>
                                    <p className="text-[19px] font-medium mb-5">Already have an account? Sign in</p>
                                    
                                    </div>
                                    <div className="flex justify-center w-96  self-center ">
                                    <Link to={"/Login"} className="w-full">
                                    <button className="btn mx-2  bg-transparent border-2 py-5 font-medium w-full border-mainColor hover:bg-mainColor text-[18px]">Login</button>
                                    </Link>
                                    </div>
                                    
                                </div>
                                
                            </div>
                            </div>
                        </div>
                    </div>
            </section>
        </>
    );
}

export default SignUp;
