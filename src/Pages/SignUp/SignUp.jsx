import { Link } from "react-router-dom";
import styles from "./SignUp.module.css";
import { object, string } from "yup";
import toast from "react-hot-toast";
import axios from "@axiosInstance";
import { useFormik } from "formik";
// import { Helmet } from "react-helmet";
import { useContext, useState } from "react";
import { userContext } from "../../Context/User.context";
import VerificationEmail from "../../Components/VerificationEmail/VerificationEmail";
import { AllContext } from "../../Context/All.context";
import Google from "../../assets/logo/google-icon.svg"
import Facebook from "../../assets/logo/facebook-logo-2.png"
const SignUp = () => {
  let {baseUrl}=useContext(AllContext)
  let { verification, setVerification } = useContext(userContext);
  let [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  // const navigate=useNavigate();
  const validationSchema = object({
    lastName: string()
      .required("UserName is required")
      .min(3, "UserName must be at least 3 characters")
      .max(32, "UserName can not be than 32 characters"),
    email: string()
      .required("Email is required")
      .email("Email is not a valid email address."),
    password: string()
      .required("Password is required")
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
        "password should be at least eight characters, at least one upper case English letter, one lower case English letter, one number and one special character"
      ),
    //rePassword:string().required("Confirm Password is required").oneOf([ref("password")],"Password and Confirm Password should be the same"),
    firstName: string()
      .required("First Name is required")
      .min(3, "First Name must be at least 3 characters")
      .max(100, "First Name can not be than 100 characters"),
    userName: string()
      .required("Last Name is required")
      .min(3, "Last Name must be at least 3 characters")
      .max(100, "Last Name can not be than 100 characters"),
    phoneNumber: string()
      .required("Phone is required")
      .matches(
        /^(2)01[0125][0-9]{8}$/,
        "Sorry, we Accept Egyption Phone Numbers Only"
      ),
  });
  async function sendDataToRegister(values) {
    const loadingId = toast.loading("Waiting...", { position: "top-left" });
    setLoading(true);
    try {
      const option = {
        url: `${baseUrl}/auth/register`,
        method: "POST",
        data: values,
      };
      let { data } = await axios(option);
      console.log(data)
      setVerification(true);
    } catch (error) {
      console.log(error)
      if(error.response.data.errors[0].description){toast.error(error.response.data.errors[0].description, { position: "top-left" })}
      else{toast.error("Invalid Data", { position: "top-left" })}
    } finally {
      toast.dismiss(loadingId);
      setLoading(false);
    }
  }
  const formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      password: "",
      // rePassword:"",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
    validationSchema,
    onSubmit: sendDataToRegister,
  });
  return (
    <section
      className={`${styles.SignUp} h-full min-h-screen w-full font-manrope overflow-auto`}
    >
      <div className="h-full w-full">
        <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-12">
          {/* Form Section */}
          <div className="order-2 lg:order-1 lg:col-span-7 flex justify-center items-center p-4">
            <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:w-[75%] 2xl:w-1/2 flex flex-col justify-center items-center">
              <h1 className="text-[28px] sm:text-[35px] my-4 text-mainColor font-medium text-center">
                Create your new account
              </h1>

              <form action="" className="w-full" onSubmit={formik.handleSubmit}>
                <input
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  className={`formControl ${formik.errors.firstName && formik.touched.firstName ? 'border-red-500' : ''}`}
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}/>
                <input
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  className={`formControl ${formik.errors.lastName && formik.touched.lastName ? 'border-red-500' : ''}`}
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <input
                  type="text"
                  placeholder="Username"
                  name="userName"
                  className={`formControl ${formik.errors.userName && formik.touched.userName ? 'border-red-500' : ''}`}
                  value={formik.values.userName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  className={`formControl ${formik.errors.email && formik.touched.email? 'border-red-500' : ''}`}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  className={`formControl ${formik.errors.password&& formik.touched.password ? 'border-red-500' : ''}`}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.password && formik.touched.password && (
                  <p className="text-red-500 mb-1 mx-6 text-ms">
                    * {formik.errors.password}
                  </p>
                )}
                {/* <input type="password" placeholder="Confirm Password" name="rePassword" className="formControl" value={formik.values.rePassword} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                                        {formik.errors.rePassword && formik.touched.rePassword && <p className="text-red-500 mb-1 mx-6 text-ms">* {formik.errors.rePassword}</p>} */}
                <input
                  type="tel"
                  placeholder="Phone Number"
                  name="phoneNumber"
                  className={`formControl ${formik.errors.phoneNumber && formik.touched.phoneNumber ? 'border-red-500' : ''}`}
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    className="my-1 mx-2 w-4 h-4  accent-mainColor"
                    required
                    id="Remember"
                    onClick={() => {
                      if (check) {
                        setCheck(false);
                      } else {
                        setCheck(true);
                      }
                    }}
                  />
                  <label htmlFor="Remember me" className="text-[16px]">
                    I agree to{" "}
                    <a
                      href=""
                      className="text-mainColor underline underline-offset-4 decoration-mainColor the mr-1"
                    >
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href=""
                      className="text-mainColor underline underline-offset-4 decoration-mainColor the ml-1"
                    >
                      Privacy Statement
                    </a>
                  </label>
                </div>
                <button
                  disabled={loading}
                  type="submit"
                  className={`btn px-2 py-5 my-4 text-white bg-mainColor  hover:border-mainColor hover:text-mainColor hover:bg-transparent font-medium border-2
                            ${
                              loading
                                ? "cursor-not-allowed opacity-50"
                                : "hover:bg-transparent hover:text-mainColor hover:border-mainColor"
                            }

                            `}
                            // onClick={(e)=>{e.preventDefault();}}
                  // onClick={(e)=>{e.preventDefault();
                    
                  //   if (
                  //     formik.values.firstName &&
                  //     formik.values.lastName &&
                  //     formik.values.email &&
                  //     formik.values.password &&
                  //     formik.values.userName &&
                  //     formik.values.phoneNumber &&
                  //     check
                  //   ) {
                  //     setVerification(true);
                  //   }
                  // }}
                >
                  {" "}
                  {loading ? "Registering..." : "Register"}
                </button>
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
              </form>
            </div>
          </div>

          {/* Background Section */}
          <div className="order-1 lg:order-2 contentAndbg lg:col-span-5">
            <div className="bg-black w-full h-full bg-opacity-40 flex flex-col justify-center items-center text-center px-4 py-8">
              <div className="w-full text-center max-w-md sm:max-w-lg md:max-w-xl text-white flex flex-col justify-center">
                <div className="w-full flex flex-col justify-between items-center">
                  <div className="w-full flex flex-col items-center justify-center">
                    <h1 className="text-[26px] sm:text-[32px] pb-4 font-semibold">
                      Register Now
                    </h1>
                    <p className="text-[18px] sm:text-[22px] font-medium px-4">
                      Please provide the informations to register your account
                    </p>
                  </div>
                  <p className="text-[16px] sm:text-[19px] font-medium my-6">
                    Already have an account? Sign in
                  </p>
                </div>

                <div className="w-full max-w-xs self-center">
                  <Link to={"/Login"} className="w-full">
                    <button type='button' className="btn mx-2 bg-transparent border-2 py-4 font-medium w-full border-mainColor hover:bg-mainColor text-[16px] sm:text-[18px]" >
                      Login
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {verification ? (
        <div className=" fixed z-50 inset-0  ">
          <VerificationEmail email={formik.values.email} />
        </div>
      ) : (
        ""
      )}
    </section>

    // <>
    //   <Helmet>
    //     <title>Sign up Page</title>
    //     <meta name="description" content="Sign up Page" />
    //   </Helmet>
    //   <section className={`${styles.SignUp} h-[100vh] w-[100vw] font-manrope`}>
    //     <div className="h-full w-full">
    //       <div className="w-full h-full grid lg:grid-cols-12 ">
    //         <div className="lg:col-span-7 flex justify-center items-center ">
    //           <div className="w-full lg:w-[75%] 2xl:w-1/2 flex flex-col justify-center items-center">
    //             <h1 className="text-[35px] my-5 text-mainColor font-medium">
    //               Create your new account
    //             </h1>
    // <form action="" className="" onSubmit={formik.handleSubmit}>
    //   <input
    //     type="text"
    //     placeholder="First Name"
    //     name="firstName"
    //     className="formControl"
    //     value={formik.values.firstName}
    //     onChange={formik.handleChange}
    //     onBlur={formik.handleBlur}
    //   />
    //   {formik.errors.firstName && formik.touched.firstName && (
    //     <p className="text-red-500 mt-1 mx-6 text-ms">
    //       * {formik.errors.firstName}
    //     </p>
    //   )}
    //   <input
    //     type="text"
    //     placeholder="Last Name"
    //     name="lastName"
    //     className="formControl"
    //     value={formik.values.lastName}
    //     onChange={formik.handleChange}
    //     onBlur={formik.handleBlur}
    //   />
    //   {formik.errors.lastName && formik.touched.lastName && (
    //     <p className="text-red-500 mt-1 mx-6 text-ms">
    //       * {formik.errors.lastName}
    //     </p>
    //   )}
    //   <input
    //     type="text"
    //     placeholder="Username"
    //     name="userName"
    //     className="formControl"
    //     value={formik.values.userName}
    //     onChange={formik.handleChange}
    //     onBlur={formik.handleBlur}
    //   />
    //   {formik.errors.userName && formik.touched.userName && (
    //     <p className="text-red-500 mt-1 mx-6 text-ms">
    //       * {formik.errors.userName}
    //     </p>
    //   )}
    //   <input
    //     type="email"
    //     placeholder="Email"
    //     name="email"
    //     className="formControl"
    //     value={formik.values.email}
    //     onChange={formik.handleChange}
    //     onBlur={formik.handleBlur}
    //   />
    //   {formik.errors.email && formik.touched.email && (
    //     <p className="text-red-500 mt-1 mx-6 text-ms">
    //       * {formik.errors.email}
    //     </p>
    //   )}
    //   <input
    //     type="password"
    //     placeholder="Password"
    //     name="password"
    //     className="formControl"
    //     value={formik.values.password}
    //     onChange={formik.handleChange}
    //     onBlur={formik.handleBlur}
    //   />
    //   {formik.errors.password && formik.touched.password && (
    //     <p className="text-red-500 mt-1 mx-6 text-ms">
    //       * {formik.errors.password}
    //     </p>
    //   )}
    //   {/* <input type="password" placeholder="Confirm Password" name="rePassword" className="formControl" value={formik.values.rePassword} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
    //                         {formik.errors.rePassword && formik.touched.rePassword && <p className="text-red-500 mt-1 mx-6 text-ms">* {formik.errors.rePassword}</p>} */}
    //   <input
    //     type="tel"
    //     placeholder="Phone Number"
    //     name="phoneNumber"
    //     className="formControl"
    //     value={formik.values.phoneNumber}
    //     onChange={formik.handleChange}
    //     onBlur={formik.handleBlur}
    //   />
    //   {formik.errors.phoneNumber && formik.touched.phoneNumber && (
    //     <p className="text-red-500 mt-1 mx-6 text-ms">
    //       * {formik.errors.phoneNumber}
    //     </p>
    //   )}
    //   <div className="flex items-center my-3">
    //     <input
    //       type="checkbox"
    //       className="my-2 mx-2 w-4 h-4  accent-mainColor"
    //       required
    //       id="Remember"
    //       onClick={() => {
    //         if (check) {
    //           setCheck(false);
    //         } else {
    //           setCheck(true);
    //         }
    //       }}
    //     />
    //     <label htmlFor="Remember me" className="text-[16px]">
    //       I agree to{" "}
    //       <a
    //         href=""
    //         className="text-mainColor underline underline-offset-4 decoration-mainColor the mr-1"
    //       >
    //         Terms and Conditions
    //       </a>{" "}
    //       and{" "}
    //       <a
    //         href=""
    //         className="text-mainColor underline underline-offset-4 decoration-mainColor the ml-1"
    //       >
    //         Privacy Statement
    //       </a>
    //     </label>
    //   </div>
    //   <button
    //     disabled={loading}
    //     type="submit"
    //     className={`btn w-[90%] px-2 py-5 my-10 text-white bg-mainColor  hover:border-mainColor hover:text-mainColor hover:bg-transparent font-medium border-2
    //             ${
    //               loading
    //                 ? "cursor-not-allowed opacity-50"
    //                 : "hover:bg-transparent hover:text-mainColor hover:border-mainColor"
    //             }

    //             `}
    // onClick={() => {
    //   if (
    //     formik.values.firstName &&
    //     formik.values.lastName &&
    //     formik.values.email &&
    //     formik.values.password &&
    //     formik.values.userName &&
    //     formik.values.phoneNumber &&
    //     check
    //   ) {
    //     setVerification(true);
    //   }
    // }}
    //   >
    //     {" "}
    //     Register
    //   </button>
    // </form>
    //           </div>
    //         </div>
    //         <div className="contentAndbg lg:col-span-5">
    //           <div className="bg-black  w-full h-full  bg-opacity-70 overflow-hidden  flex flex-col justify-center items-center text-center ">
    //             <div className="w-[560px] h-[534px] text-white container flex flex-col justify-center  ">
    //               <div className="w-[560px] h-[300px]  flex flex-col justify-between">
    //                 <div className="w-[560px] h-[170px] flex flex-col items-center justify-center">
    //                   <h1 className="text-[32px] pb-7 font-semibold">
    //                     Register Now
    //                   </h1>
    //                   <p className=" text-[22px] font-medium px-10 ">
    //                     Please provide the informations to register your account
    //                   </p>
    //                 </div>
    //                 <p className="text-[19px] font-medium mb-5">
    //                   Already have an account? Sign in
    //                 </p>
    //               </div>
    //               <div className="flex justify-center w-96  self-center ">
    //                 <Link to={"/Login"} className="w-full">
    //                   <button className="btn mx-2  bg-transparent border-2 py-5 font-medium w-full border-mainColor hover:bg-mainColor text-[18px]">
    //                     Login
    //                   </button>
    //                 </Link>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    // {verification ? (
    //   <div className=" fixed z-50 inset-0  ">
    //     <VerificationEmail email={formik.values.email} />
    //   </div>
    // ) : (
    //   ""
    // )}
    //   </section>
    // </>
  );
};

export default SignUp;
