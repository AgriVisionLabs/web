import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Login.module.css";
import { useContext, useState, useEffect } from "react";
import ForgetPassword from "../../Components/ForgetPassword/ForgetPassword";
import { AllContext } from "../../Context/All.context";
import OTP from "../../Components/OTP/OTP";
import ResetPassword from "../../Components/ResetPassword/ResetPassword";
import VerificationEmail from "../../Components/VerificationEmail/VerificationEmail";
//import OPTLogin from "../../Components/OPTLogin/OPTLogin";
import { Helmet } from "react-helmet";
import { userContext } from "../../Context/User.context";
import { object, string } from "yup";
import axios from "axios";
import { useFormik } from "formik";
import { motion } from "framer-motion";
// import bgImage from "../../assets/images/image 4.png"

const Login = () => {
  let { forgetPassword, otp, setForgetPassword, resetPassword, baseUrl } =
    useContext(AllContext);
  // const [inCorrectEmailorPassword,setInCorrectEmailorPassword]=useState(null);
  let [emailOfForgotPassword, setEmailOfForgotPassword] = useState(null);
  // let [otpOfForgotPassword,setOtpOfForgotPassword ]=useState(null);
  let [otpValue, setOtpValue] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, setRefreshToken, setExpiresIn, setTokenExpiration, setRefreshTokenExpiration, verification } = useContext(userContext);
  const validationSchema = object({
    email: string().required("Email is required").email("Email is invalid"),
    password: string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [socialLoading, setSocialLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("rememberMe") === "true"
  );
  const [verificationEmail, setVerificationEmail] = useState("");
  const [showEmailNotConfirmed, setShowEmailNotConfirmed] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [resendingVerification, setResendingVerification] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Debug: Log when loginError changes
  useEffect(() => {
    console.log("loginError state changed:", loginError);
  }, [loginError]);

  // Initialize Google OAuth
  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log("Google script loaded successfully");
          // Wait a bit for the script to fully initialize
          setTimeout(() => {
            if (window.google?.accounts?.id) {
              try {
                window.google.accounts.id.initialize({
                  client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                  callback: handleGoogleSuccess,
                  auto_select: false,
                  cancel_on_tap_outside: true,
                });
                console.log("Google OAuth initialized successfully");
              } catch (error) {
                console.error("Error initializing Google OAuth:", error);
              }
            }
          }, 100);
        };
        script.onerror = () => {
          console.error("Failed to load Google OAuth script");
        };
        document.head.appendChild(script);
      } else if (window.google?.accounts?.id) {
        // Google is already loaded, just initialize
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleSuccess,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          console.log("Google OAuth re-initialized successfully");
        } catch (error) {
          console.error("Error re-initializing Google OAuth:", error);
        }
      }
    };

    initializeGoogleAuth();
  }, []);

  // Google OAuth success handler
  const handleGoogleSuccess = async (credentialResponse) => {
    setSocialLoading(true);
    setLoginError("");

    try {
      console.log("Google credential received:", credentialResponse);

      // Send the Google token to your backend
      const requestBody = {
        IdToken: credentialResponse.credential,
      };

      console.log("Sending to backend:", requestBody);
      console.log("Backend URL:", `${baseUrl}/auth/google`);

      const response = await fetch(`${baseUrl}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.log("Backend error response:", errorData);
        console.log("Response status:", response.status);
        console.log("Response headers:", [...response.headers.entries()]);
        throw new Error(
          errorData?.message ||
            errorData?.error ||
            `Server error: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Backend response:", data);

      // Check if we received the expected tokens
      if (!data.token) {
        throw new Error("No authentication token received from server");
      }

      // Calculate token expiration time
      const tokenExpirationTime = new Date(Date.now() + (data.expiresIn * 60 * 1000));

      // Store the JWT tokens and expiration data
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.id);
      localStorage.setItem("expiresIn", data.expiresIn);
      localStorage.setItem("tokenExpiration", tokenExpirationTime.toISOString());
      
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
        setRefreshToken(data.refreshToken);
      }
      
      if (data.refreshTokenExpiration) {
        localStorage.setItem("refreshTokenExpiration", data.refreshTokenExpiration);
        setRefreshTokenExpiration(data.refreshTokenExpiration);
      }

      // Update user context
      setToken(data.token);
      setExpiresIn(data.expiresIn);
      setTokenExpiration(tokenExpirationTime.toISOString());

      // Store credentials if remember me is checked
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      // Clean up any Google modal
      const googleModal = document.getElementById("google-modal-overlay");
      if (googleModal) {
        document.body.removeChild(googleModal);
      }

      const redirect = new URLSearchParams(location.search).get('redirect');
      navigate(redirect || "/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      setLoginError(error.message || "Google login failed. Please try again.");

      // Clean up any Google modal on error
      const googleModal = document.getElementById("google-modal-overlay");
      if (googleModal) {
        document.body.removeChild(googleModal);
      }
    } finally {
      setSocialLoading(false);
    }
  };

  // Social login handlers
  const handleGoogleLogin = async () => {
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      setLoginError(
        "Google OAuth not configured. Please check your environment variables."
      );
      return;
    }

    if (!window.google?.accounts?.id) {
      setLoginError("Google OAuth not loaded. Please refresh the page.");
      return;
    }

    setSocialLoading(true);
    setLoginError("");

    try {
      // Create overlay
      const overlay = document.createElement("div");
      overlay.id = "google-modal-overlay";
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
      `;

      // Create modal
      const modal = document.createElement("div");
      modal.id = "google-signin-modal";
      modal.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 32px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        max-width: 400px;
        width: 90%;
        position: relative;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;

      // Modal content
      modal.innerHTML = `
        <button id="close-google-modal" style="
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s;
        " onmouseover="this.style.backgroundColor='#f5f5f5'" onmouseout="this.style.backgroundColor='transparent'">×</button>
        
        <div style="margin-bottom: 24px;">
          <h2 style="margin: 0 0 8px 0; color: #333; font-size: 24px; font-weight: 500;">Continue with Google</h2>
          <p style="margin: 0; color: #666; font-size: 14px;">Sign in to your account using Google</p>
        </div>
        
        <div id="google-button-wrapper" style="
          display: flex;
          justify-content: center;
          min-height: 44px;
          margin: 16px 0;
        ">
          <div id="google-signin-button"></div>
        </div>
        
        <p style="margin: 16px 0 0 0; color: #888; font-size: 12px;">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      `;

      // Add modal to overlay
      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      // Close functionality
      const closeModal = () => {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
        setSocialLoading(false);
      };

      // Close button event
      document.getElementById("close-google-modal").onclick = closeModal;

      // Close on overlay click
      overlay.onclick = (e) => {
        if (e.target === overlay) {
          closeModal();
        }
      };

      // Close on escape key
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          closeModal();
          document.removeEventListener("keydown", handleEscape);
        }
      };
      document.addEventListener("keydown", handleEscape);

      // Render Google button with proper configuration - wait for Google to be ready
      let retryCount = 0;
      const maxRetries = 25; // Maximum 5 seconds of retries (25 * 200ms)

      const renderGoogleButton = () => {
        const buttonContainer = document.getElementById("google-signin-button");
        if (buttonContainer && window.google?.accounts?.id) {
          try {
            window.google.accounts.id.renderButton(buttonContainer, {
              theme: "outline",
              size: "large",
              text: "signin_with",
              width: "300",
              logo_alignment: "left",
              click_listener: () => {
                console.log("Google button clicked");
              },
            });
            console.log("Google sign-in button rendered successfully");
          } catch (error) {
            console.error("Error rendering Google button:", error);
            // Show fallback message
            showFallbackButton(buttonContainer);
          }
        } else if (retryCount < maxRetries) {
          console.log(
            `Google OAuth not ready, retrying... (${
              retryCount + 1
            }/${maxRetries})`
          );
          retryCount++;
          setTimeout(renderGoogleButton, 200);
        } else {
          console.error("Google OAuth failed to load after maximum retries");
          // Show fallback message
          const buttonContainer = document.getElementById(
            "google-signin-button"
          );
          if (buttonContainer) {
            showFallbackButton(buttonContainer);
          }
        }
      };

      const showFallbackButton = (buttonContainer) => {
        if (buttonContainer) {
          buttonContainer.innerHTML = `
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 12px 24px;
              border: 1px solid #dadce0;
              border-radius: 4px;
              background: white;
              cursor: pointer;
              font-family: 'Roboto', sans-serif;
              font-size: 14px;
              color: #3c4043;
              min-height: 40px;
            " onclick="location.reload();">
              <svg style="margin-right: 8px;" width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Refresh to continue with Google
            </div>
          `;
        }
      };

      // Start attempting to render the button
      renderGoogleButton();
    } catch (error) {
      console.error("Google login error:", error);
      setLoginError("Google login failed. Please try again.");
      setSocialLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setSocialLoading(true);
    setLoginError("");

    try {
      // For demo purposes, simulate successful login
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const redirect = new URLSearchParams(location.search).get('redirect');
      navigate(redirect || "/dashboard");
    } catch (error) {
      setLoginError("Facebook login failed. Please try again.");
      console.log(error);
    } finally {
      setSocialLoading(false);
    }
  };

  // Function to resend verification email
  const resendVerificationEmail = async () => {
    if (!verificationEmail || resendCooldown > 0) return;

    setResendingVerification(true);
    setResendMessage("");

    try {
      const options = {
        url: `${baseUrl}/auth/resend-confirmation-email`,
        method: "POST",
        data: {
          email: verificationEmail,
        },
      };

      await axios(options);
      setResendMessage(
        "Verification email sent successfully! Please check your inbox."
      );

      // Start 30-second cooldown timer
      setResendCooldown(30);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Clear success message after 5 seconds
      setTimeout(() => {
        setResendMessage("");
      }, 5000);
    } catch (error) {
      console.log("resend verification email error:", error);

      if (error.response?.status === 400) {
        setResendMessage(
          "This email is already verified. You can try logging in again."
        );
      } else if (error.response?.status === 404) {
        setResendMessage("Email not found. Please check your email address.");
      } else {
        setResendMessage(
          "Failed to send verification email. Please try again."
        );
      }
    } finally {
      setResendingVerification(false);
    }
  };

  async function sendDataToLogin(values) {
    console.log("sendDataToLogin called with values:", values);
    
    // Check if form has validation errors
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      console.log("Form has validation errors:", errors);
      formik.setTouched({
        email: true,
        password: true,
      });
      return; // Don't proceed with submission
    }

    console.log("Starting login request...");
    setLoading(true);
    setLoginError("");
    setShowEmailNotConfirmed(false);
    setResendMessage("");
    setResendCooldown(0);
    
    // Clear any existing tokens to prevent axios interceptor interference
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
      localStorage.removeItem('token');
      console.log('Cleared existing token before login');
    }

    try {
      // Create a fresh axios instance without interceptors for login
      const loginAxios = axios.create();
      
      const response = await loginAxios.post(`${baseUrl}/auth`, values);
      const data = response.data;
      console.log("login", data);
      if (data.token && data.refreshToken) {
        // Calculate token expiration time
        const tokenExpirationTime = new Date(Date.now() + (data.expiresIn * 60 * 1000));

        // Store all token data
        localStorage.setItem("userId", data.id);
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("expiresIn", data.expiresIn);
        localStorage.setItem("tokenExpiration", tokenExpirationTime.toISOString());
        
        if (data.refreshTokenExpiration) {
          localStorage.setItem("refreshTokenExpiration", data.refreshTokenExpiration);
          setRefreshTokenExpiration(data.refreshTokenExpiration);
        }

        // Update context
        setToken(data.token);
        setRefreshToken(data.refreshToken);
        setExpiresIn(data.expiresIn);
        setTokenExpiration(tokenExpirationTime.toISOString());

        // Handle remember me functionality
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", values.email);
          localStorage.setItem("rememberedPassword", values.password);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
          localStorage.removeItem("rememberMe");
        }

        setTimeout(() => {
          const redirect = new URLSearchParams(location.search).get('redirect');
          navigate(redirect || "/dashboard");
        }, 500);
      }
    } catch (error) {
      console.log("Login error:", error);
      console.log("Error response:", error.response);
      console.log("Error response data:", error.response?.data);
      console.log("Error response status:", error.response?.status);

      // Handle specific error cases
      if (error.response?.status === 403) {
        // Check if it's an EmailNotConfirmed error
        const errorData = error.response?.data;
        if (
          errorData?.errors?.some(
            (err) => err.code === "User.EmailNotConfirmed"
          )
        ) {
          setLoginError("Please verify your email before logging in.");
          setShowEmailNotConfirmed(true);
          setVerificationEmail(values.email);
        } else {
          setLoginError("Access denied. Please check your credentials.");
        }
      } else if (error.response?.status === 401) {
        console.log("Setting login error for 401");
        setLoginError("Invalid email or password. Please try again.");
      } else if (error.response?.status === 400) {
        const errorData = error.response?.data;
        const errorMessage = errorData?.message || errorData?.title || "Please check your email and password.";
        setLoginError(errorMessage);
      } else if (error.response?.status >= 500) {
        setLoginError("Server error. Please try again later.");
      } else {
        const errorMessage = error.response?.data?.message || error.response?.data?.title || error.message || "Something went wrong. Please try again.";
        setLoginError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      email: localStorage.getItem("rememberedEmail") || "",
      password: localStorage.getItem("rememberedPassword") || "",
    },
    validationSchema,
    onSubmit: sendDataToLogin,
  });
  return (
    <>
      <Helmet>
        <title>Login Page</title>
      </Helmet>
      <section className={`${styles.Login} h-[100vh] w-[100vw] font-manrope`}>
        <div className="h-full w-full">
          <div className="w-full h-full grid lg:grid-cols-12 relative overflow-hidden">
            <motion.div
              className="contentAndbg lg:col-span-5 z-10"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "tween",
                ease: "easeInOut",
                duration: 0.6,
              }}
            >
              <div className="bg-black  w-full h-full  bg-opacity-40  flex flex-col justify-center items-center text-center ">
                <div className="w-full text-center max-w-md sm:max-w-lg md:max-w-xl text-white flex flex-col justify-center">
                  <div className="w-full flex flex-col justify-between items-center">
                    <div className="w-full flex flex-col items-center justify-center">
                      <h1 className=" text-[24px] md:text-[30px]  lg:text-4xl pb-4 lg:pb-7 font-medium">
                        Welcome Back !
                      </h1>
                      <p className=" text-[16px] lg:text-[22px] font-medium xl:px-16 ">
                        Please log in to your account with the given details to
                        continue
                      </p>
                    </div>
                    <p className=" text-[18px] lg:text-[19px] font-medium py-3 lg:mb-5">
                      Don&apos;t have an account? create new account
                    </p>
                  </div>
                  <div className="w-full max-w-xs self-center">
                    <Link to={"/signUp"} className="w-full">
                      <motion.button
                        className="btn bg-transparent border-2 py-5 font-medium w-full border-mainColor hover:bg-mainColor hover:text-white text-white text-[18px] transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Register
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
            {/* right part */}
            <div className="lg:col-span-7 flex justify-center mt-4 lg:items-center px-2">
              <div className="w-full md:w-[640px]  lg:w-[500px]  ">
                <h1 className="text-center text-[28px] md:text-[33px] lg:text-[38px] my-5 text-mainColor font-medium">
                  Log in to your account
                </h1>
                <form onSubmit={(e) => {
                  console.log('Form submit event triggered');
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Form default prevented');
                  try {
                    formik.handleSubmit(e);
                  } catch (error) {
                    console.error('Error in form submission:', error);
                  }
                }}>
                  {loginError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-600 text-sm font-medium">
                        {loginError}
                        {showEmailNotConfirmed && (
                          <>
                            {" "}
                            <button
                              type="button"
                              onClick={resendVerificationEmail}
                              disabled={
                                resendingVerification || resendCooldown > 0
                              }
                              className={`text-red-600 hover:text-red-700 underline underline-offset-2 transition-colors duration-300 cursor-pointer font-medium ${
                                resendingVerification || resendCooldown > 0
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {resendingVerification
                                ? "Sending..."
                                : resendCooldown > 0
                                ? `Resend? (${resendCooldown}s)`
                                : "Resend?"}
                            </button>
                          </>
                        )}
                      </p>
                      {resendMessage && (
                        <p
                          className={`text-sm mt-2 font-medium ${
                            resendMessage.includes("successfully")
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {resendMessage}
                        </p>
                      )}
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Enter your Email"
                    className={`formControl ${
                      formik.errors.email && formik.touched.email
                        ? "border-red-500 text-red-500 placeholder-red-400"
                        : ""
                    }`}
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoFocus={false}
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Your Password"
                      className={`formControl ${
                        formik.errors.password && formik.touched.password
                          ? "border-red-500 text-red-500 placeholder-red-400"
                          : ""
                      }`}
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      autoFocus={false}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.05 8.05M14.12 14.12l1.827 1.828"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                      <div className="group">
                        <svg
                          className="w-4 h-4 text-gray-400 cursor-help"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                          <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
                          <div className="font-medium text-blue-200 mb-1">
                            Password Requirements:
                          </div>
                          <div>• At least 8 characters long</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center md:mx-4">
                      <input
                        type="checkbox"
                        className=" my-2 mx-3 w-4 h-4  accent-mainColor   "
                        id="Remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label htmlFor="Remember" className="text-[15px] ">
                        remember me
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
                  <motion.button
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
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                  >
                    {loading ? "Logging in..." : "Log in"}
                  </motion.button>

                  {/* Social Login Section */}
                  <div className="mt-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="border-t border-gray-300 flex-1"></div>
                      <span className="px-4 text-gray-500 text-sm">
                        or continue with
                      </span>
                      <div className="border-t border-gray-300 flex-1"></div>
                    </div>

                    <div className="flex justify-center space-x-6">
                      <motion.div
                        onClick={!socialLoading ? handleGoogleLogin : undefined}
                        className={`cursor-pointer ${
                          socialLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        whileHover={!socialLoading ? { scale: 1.1 } : {}}
                        whileTap={!socialLoading ? { scale: 0.95 } : {}}
                      >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      </motion.div>

                      <motion.div
                        onClick={
                          !socialLoading ? handleFacebookLogin : undefined
                        }
                        className={`cursor-pointer ${
                          socialLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        whileHover={!socialLoading ? { scale: 1.1 } : {}}
                        whileTap={!socialLoading ? { scale: 0.95 } : {}}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="#1877F2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </form>
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
                setResetToken={setResetToken}
              />
            </div>
          ) : resetPassword ? (
            <div className=" absolute inset-0">
              <ResetPassword resetToken={resetToken} />
            </div>
          ) : (
            ""
          )
          // optLogin?<div className=" absolute inset-0"><OPTLogin/></div>:""
        }

        {verification ? (
          <div className="fixed z-50 inset-0">
            <VerificationEmail email={verificationEmail} />
          </div>
        ) : (
          ""
        )}
      </section>
    </>
  );
};

export default Login;
