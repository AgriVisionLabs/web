import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { useContext, useState } from "react";
import ForgetPassword from "../../Components/ForgetPassword/ForgetPassword";
import { AllContext } from "../../Context/All.context";
import OTP from "../../Components/OTP/OTP";
import ResetPassword from "../../Components/ResetPassword/ResetPassword";
//import OPTLogin from "../../Components/OPTLogin/OPTLogin";

import { userContext } from "../../Context/User.context";
import { object, string } from "yup";
import toast from "react-hot-toast";
import axios from "@axiosInstance";
import { useFormik } from "formik";
import Google from "../../assets/logo/google-icon.svg"
import Facebook from "../../assets/logo/facebook-logo-2.png"
const Login = () => {
  let { forgetPassword, otp, setForgetPassword, resetPassword ,baseUrl} =useContext(AllContext);
  let {setUserId}=useContext(userContext)
  // const [inCorrectEmailorPassword,setInCorrectEmailorPassword]=useState(null);
  let [emailOfForgotPassword, setEmailOfForgotPassword] = useState(null);
  
  // let [otpOfForgotPassword,setOtpOfForgotPassword ]=useState(null);
  let [otpValue, setOtpValue] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();
  const { setToken, setRefreshToken } = useContext(userContext);
  const validationSchema = object({
    email: string().required("Email is required").email("Email is invalid"),
    password: string()
      .required("Password is required")
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
        "password should be at least eight characters, at least one upper case English letter, one lower case English letter, one number and one special character"
      ),
  });

  const [loading, setLoading] = useState(false);

  async function sendDataToLogin(values) {
    console.log("sendDataToLogin : ");
    setLoading(true);
    const loadingId = toast.loading("Waiting...");

    try {
      const options = {
        url: `${baseUrl}/auth`,
        method: "POST",
        data: values,
      };
      let { data } = await axios(options);
      if (data.token && data.refreshToken) {
        localStorage.setItem("token",data.token);
        localStorage.setItem("refreshToken",data.refreshToken);
        localStorage.setItem("userId",data.id);
        setToken(data.token);
        setRefreshToken(data.refreshToken);
        setTimeout(() => {
          navigate("/Dashboard");
        }, 500);
      }
    } catch (error) {
      toast.error("Invalid credentials");
      console.log(error);
    } finally {
      toast.dismiss(loadingId);
      setLoading(false);
    }
  }

  // async function RefreshToken(){
  //     console.log("RefreshToken : ")
  //         const loadingId =toast.loading("Waiting...")
  //         try {
  //             const options={
  //                 url:"https://agrivision.tryasp.net/Auth/refresh",
  //                 method:"POST",
  //                 data:{
  //                     token:token,
  //                     refreshToken:refreshToken,
  //                 },
  //             }
  //             let {data}=await axios(options);
  //                 setToken(data.token);
  //                 localStorage.setItem("token",data.token);
  //                 setRefreshToken(data.refreshToken);
  //                 console.log("RefreshToken : end :"+token)

  //             }
  //             catch(error){
  //             toast.error("Incorrect email or password ("+error+")");
  //             console.log(error)

  //         }finally{
  //             toast.dismiss(loadingId);
  //         }
  //     }
  //     useEffect(()=>{
  //         if(token&&refreshToken){
  //             const counter=0;
  //             counter=setTimeout(() => {RefreshToken()}
  //             ,((6-5)*1000*6))
  //             clearTimeout(counter)
  //         }
  //     }
  //     ,[token,refreshToken])
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: sendDataToLogin,
  });
  return (
    <>
      <section className={`${styles.Login} h-[100vh] w-[100vw] font-manrope`}>
        <div className="h-full w-full">
          <div className="w-full h-full grid lg:grid-cols-12">
            <div className="contentAndbg lg:col-span-5">
              <div className="bg-black  w-full h-full  bg-opacity-40  flex flex-col justify-center items-center text-center ">
                <div className="w-full h-[200px] md:w-[640px] lg:w-[420px] lg:h-[500px] xl:w-[520px]  xl:h-[534px] text-white container flex flex-col justify-center px-2">
                  <div className="lg:w-[400px] lg:h-[300px]  xl:w-[510px] flex flex-col justify-between">
                    <div className="lg:w-[400px] xl:w-[510px] lg:h-[170px] flex flex-col items-center justify-center">
                      <h1 className=" text-[24px] md:text-[30px]  lg:text-4xl pb-4 lg:pb-7 font-medium">
                        Welcome Back !
                      </h1>
                      <p className=" text-[16px] lg:text-[22px] font-medium xl:px-16 ">
                        Please Sign in into your Account With the give details
                        to continue
                      </p>
                    </div>
                    <p className=" text-[18px] lg:text-[19px] font-medium py-3 lg:mb-5">
                      Don’t have an account? create new account
                    </p>
                  </div>
                  <div className="flex justify-center  w-full md:w-[500px] lg:w-96   self-center ">
                    <Link to={"/SignUp"} className="w-[90%] ">
                      <button className="btn bg-transparent border-2 py-5 font-medium w-full border-mainColor hover:bg-mainColor text-[18px]">
                        Register
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* right part */}
            <div className="lg:col-span-7 flex justify-center mt-4 lg:items-center px-2">
              <div className="w-full md:w-[640px]  lg:w-[500px]  ">
                <h1 className="text-center text-[28px] md:text-[33px] lg:text-[38px] my-5 text-mainColor font-medium">
                  Sign in to your account
                </h1>
                <form action="" onSubmit={formik.handleSubmit}>
                  <input
                    type="text"
                    placeholder="Enter your Email"
                    className={`formControl ${formik.errors.email && formik.touched.email ? 'border-red-500' : ''}`}
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <input
                    type="password"
                    placeholder="Enter Your Password"
                    className={`formControl ${formik.errors.password && formik.touched.password ? 'border-red-500' : ''}`}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center md:mx-4">
                      <input
                        type="checkbox"
                        className=" my-2 mx-3 w-4 h-4  accent-mainColor   "
                        id="Remember"
                      />
                      <label htmlFor="Remember me" className="text-[15px] ">
                        Remember me
                      </label>
                    </div>
                    <p
                      className="text-mainColor mr-2 md:mr-10 cursor-pointer hover:underline"
                      onClick={() => {
                        setForgetPassword(true);
                      }}
                    >
                      Forgot Password ?
                    </p>
                  </div>
                  {/* onClick={()=>{setOptLogin(true); */}
                  {/* // }} */}
                  {/* <button
                    disabled={loading}
                    type="submit"
                    className="btn w-[90%] px-2 py-5 mx-5 my-10 text-white bg-mainColor  hover:border-mainColor hover:text-mainColor hover:bg-transparent font-medium border-2 "
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button> */}
                  <button
                    disabled={loading}
                    type="submit"
                    className={`
                        btn bg-mainColor mx-auto hover:border-mainColor hover:text-mainColor hover:bg-transparent
                        px-2 py-5 my-6 text-white font-medium border-2 rounded-full transition-colors duration-300
                        ${
                          loading
                            ? "cursor-not-allowed opacity-50"
                            : "hover:bg-transparent hover:text-mainColor hover:border-mainColor"
                        }
                    `}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>
                <div className="">
                  <div className="flex justify-center items-center space-x-4">
                    <div className="w-[120px] h-[1px] bg-[#9F9F9F] rounded-full"></div>
                    <p className="text-[#9F9F9F]">Or Continue with</p>
                    <div className="w-[120px] h-[1px] bg-[#9F9F9F] rounded-full"></div>
                    
                  </div>
                  <div className="mt-[40px] flex justify-center items-center space-x-6">
                      <div className="flex cursor-pointer">
                        <img src={Google} className="w-[30px] h-[30px]" alt="" />
                      </div>
                      <div className="flex cursor-pointer">
                        <img src={Facebook} className="w-[30px] h-[30px]" alt="" />
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {
          forgetPassword ? (
            <div className=" absolute inset-0 ">
              <ForgetPassword
                setEmailOfForgotPassword={setEmailOfForgotPassword}
              />
            </div>
          ) : otp ? (
            <div className="absolute inset-0">
              <OTP
                emailOfForgotPassword={emailOfForgotPassword}
                otpValue={otpValue}
                setOtpValue={setOtpValue}
              />
            </div>
          ) : resetPassword ? (
            <div className=" absolute inset-0">
              <ResetPassword
                otpValue={otpValue}
                emailOfForgotPassword={emailOfForgotPassword}
              />
            </div>
          ) : (
            ""
          )
          // optLogin?<div className=" absolute inset-0"><OPTLogin/></div>:""
        }
      </section>
    </>
  );
};

export default Login;
