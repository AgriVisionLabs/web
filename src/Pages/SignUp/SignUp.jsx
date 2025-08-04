import { Link, useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";
import { object, string, ref } from "yup";
import axios from "axios";
import { useFormik } from "formik";
// import { Helmet } from "react-helmet";
import { useContext, useState, useEffect } from "react";
import { userContext } from "../../Context/User.context";
import VerificationEmail from "../../Components/VerificationEmail/VerificationEmail";
import { AllContext } from "../../Context/All.context";
import { motion } from "framer-motion";
// Google OAuth will be handled manually

const SignUp = () => {
  let { baseUrl } = useContext(AllContext);
  let {
    verification,
    setVerification,
    setToken,
    setRefreshToken,
    setExpiresIn,
    setTokenExpiration,
    setRefreshTokenExpiration,
  } = useContext(userContext);
  let [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
  // const [showPhoneTooltip, setShowPhoneTooltip] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const navigate = useNavigate();
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
    confirmPassword: string()
      .required("Confirm Password is required")
      .oneOf([ref("password")], "Passwords must match"),
  });
  async function sendDataToRegister(values) {
    // Check if form has validation errors or terms not accepted
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0 || !check) {
      formik.setTouched({
        firstName: true,
        lastName: true,
        userName: true,
        email: true,
        password: true,
        confirmPassword: true,
        phoneNumber: true,
      });
      return; // Don't proceed with submission
    }

    setLoading(true);
    setSignUpError("");
    try {
      const option = {
        url: `${baseUrl}/auth/register`,
        method: "POST",
        data: values,
      };
      let { data } = await axios(option);
      console.log("Registration successful:", data);

      // Store the email for verification modal
      setVerificationEmail(values.email);

      // Show verification email modal after successful registration
      setVerification(true);
    } catch (error) {
      console.log("Registration error:", error);

      // Close verification modal if it's open
      setVerification(false);
      setVerificationEmail("");

      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.description ||
          "Registration failed. Please check your information.";
        setSignUpError(errorMessage);
      } else if (error.response?.status === 409) {
        setSignUpError(
          "This email is already registered. Please use a different email or try logging in."
        );
      } else {
        setSignUpError("Registration failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }
  const formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
    validationSchema,
    onSubmit: sendDataToRegister,
  });

  // Clear form fields when component mounts and initialize Google OAuth
  useEffect(() => {
    formik.resetForm();
    setVerificationEmail("");

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
    setSignUpError("");

    try {
      console.log("Google credential received:", credentialResponse);

      // Send the Google token to your backend for registration
      const requestBody = {
        IdToken: credentialResponse.credential,
        isSignUp: true, // Indicate this is a sign-up request
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
      const tokenExpirationTime = new Date(
        Date.now() + data.expiresIn * 60 * 1000
      );

      // Store the JWT tokens and expiration data
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.id);
      localStorage.setItem("expiresIn", data.expiresIn);
      localStorage.setItem(
        "tokenExpiration",
        tokenExpirationTime.toISOString()
      );

      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
        setRefreshToken(data.refreshToken);
      }

      if (data.refreshTokenExpiration) {
        localStorage.setItem(
          "refreshTokenExpiration",
          data.refreshTokenExpiration
        );
        setRefreshTokenExpiration(data.refreshTokenExpiration);
      }

      // Update user context
      setToken(data.token);
      setExpiresIn(data.expiresIn);
      setTokenExpiration(tokenExpirationTime.toISOString());

      // Clean up any Google modal
      const googleModal = document.getElementById("google-modal-overlay");
      if (googleModal) {
        document.body.removeChild(googleModal);
      }

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Google signup error:", error);
      setSignUpError(
        error.message || "Google signup failed. Please try again."
      );

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
      setSignUpError(
        "Google OAuth not configured. Please check your environment variables."
      );
      return;
    }

    if (!window.google?.accounts?.id) {
      setSignUpError("Google OAuth not loaded. Please refresh the page.");
      return;
    }

    setSocialLoading(true);
    setSignUpError("");

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
      modal.id = "google-signup-modal";
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
          <p style="margin: 0; color: #666; font-size: 14px;">Create your account using Google</p>
        </div>
        
        <div id="google-button-wrapper" style="
          display: flex;
          justify-content: center;
          min-height: 44px;
          margin: 16px 0;
        ">
          <div id="google-signup-button"></div>
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
        const buttonContainer = document.getElementById("google-signup-button");
        if (buttonContainer && window.google?.accounts?.id) {
          try {
            window.google.accounts.id.renderButton(buttonContainer, {
              theme: "outline",
              size: "large",
              text: "signup_with",
              width: "300",
              logo_alignment: "left",
              click_listener: () => {
                console.log("Google signup button clicked");
              },
            });
            console.log("Google sign-up button rendered successfully");
          } catch (error) {
            console.error("Error rendering Google signup button:", error);
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
            "google-signup-button"
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
      console.error("Google signup error:", error);
      setSignUpError("Google signup failed. Please try again.");
      setSocialLoading(false);
    }
  };

  return (
    <section
      className={`${styles.SignUp} h-full min-h-screen w-full font-manrope overflow-auto`}
    >
      <div className="h-full w-full">
        <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-12 relative overflow-hidden">
          {/* Form Section */}
          <div className="order-2 lg:order-1 col-span-12 lg:col-span-7 flex justify-center mt-4 lg:items-center px-4 lg:px-2 pb-4">
            <div className="w-full md:w-[640px] lg:w-[500px]">
              {/* Logo for mobile with navigation links */}
              <div className="relative flex justify-center items-center mb-6 lg:hidden">
                {/* Back to Home - Absolute positioned left */}
                <Link
                  to="/"
                  className="absolute left-0 flex items-center space-x-1 text-gray-600 hover:text-mainColor transition-colors"
                >
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
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  <span className="text-sm font-medium">Home</span>
                </Link>

                {/* Logo - Centered */}
                <img
                  src="/blackLogo.png"
                  className="w-32 h-10"
                  alt="Agrivision Logo"
                />

                {/* Login - Absolute positioned right */}
                <Link
                  to="/login"
                  className="absolute right-0 flex items-center space-x-1 text-gray-600 hover:text-mainColor transition-colors"
                >
                  <span className="text-sm font-medium">Login</span>
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
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
              <h1 className="text-center text-[28px] md:text-[33px] lg:text-[38px] my-5 text-mainColor font-medium">
                Create your new account
              </h1>

              <form
                action=""
                className="w-full"
                onSubmit={formik.handleSubmit}
                autoComplete="off"
              >
                <input
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  autoComplete="off"
                  className={`formControl ${
                    formik.errors.firstName && formik.touched.firstName
                      ? "border-red-500 text-red-500 placeholder-red-400"
                      : ""
                  }`}
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoFocus={false}
                />

                <input
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  autoComplete="off"
                  className={`formControl ${
                    formik.errors.lastName && formik.touched.lastName
                      ? "border-red-500 text-red-500 placeholder-red-400"
                      : ""
                  }`}
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <input
                  type="text"
                  placeholder="Username"
                  name="userName"
                  autoComplete="off"
                  className={`formControl ${
                    formik.errors.userName && formik.touched.userName
                      ? "border-red-500 text-red-500 placeholder-red-400"
                      : ""
                  }`}
                  value={formik.values.userName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  autoComplete="off"
                  className={`formControl ${
                    formik.errors.email && formik.touched.email
                      ? "border-red-500 text-red-500 placeholder-red-400"
                      : ""
                  }`}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    autoComplete="new-password"
                    className={`formControl ${
                      formik.errors.password && formik.touched.password
                        ? "border-red-500 text-red-500 placeholder-red-400"
                        : ""
                    }`}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    {formik.values.password && (
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
                    )}
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
                        <div>• Include uppercase and lowercase letters</div>
                        <div>• Include numbers and special characters</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    className={`formControl ${
                      formik.errors.confirmPassword &&
                      formik.touched.confirmPassword
                        ? "border-red-500 text-red-500 placeholder-red-400"
                        : ""
                    }`}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.values.confirmPassword && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
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
                    </div>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    name="phoneNumber"
                    autoComplete="off"
                    className={`formControl ${
                      formik.errors.phoneNumber && formik.touched.phoneNumber
                        ? "border-red-500 text-red-500 placeholder-red-400"
                        : ""
                    }`}
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 group">
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
                        Phone Format:
                      </div>
                      <div>• Egyptian phone number format</div>
                      <div>• Start with 201 (e.g., 201012345678)</div>
                      <div>• 12 digits total</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    className="my-2 mx-2 w-4 h-4  accent-mainColor"
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
                <motion.button
                  disabled={loading}
                  type="submit"
                  className={`btn px-2 py-5 my-6 text-white bg-mainColor  hover:border-mainColor hover:text-mainColor hover:bg-transparent font-medium border-2 transition-all duration-300
                            ${
                              loading
                                ? "cursor-not-allowed opacity-50"
                                : "hover:bg-transparent hover:text-mainColor hover:border-mainColor"
                            }`}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                >
                  {loading ? "Registering..." : "Register"}
                </motion.button>

                {/* Social Login Section */}
                <div className="mt-6">
                  {signUpError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-600 text-sm font-medium">
                        {signUpError}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center justify-center mb-4">
                    <div className="border-t border-gray-300 flex-1"></div>
                    <span className="px-4 text-gray-500 text-sm">
                      or continue with
                    </span>
                    <div className="border-t border-gray-300 flex-1"></div>
                  </div>

                  <div className="flex justify-center">
                    {/* Google Login */}
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
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Background Section */}
          <motion.div
            className="order-1 lg:order-2 contentAndbg hidden lg:block lg:col-span-5 z-10"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              ease: "easeInOut",
              duration: 0.6,
            }}
          >
            <div className="bg-black w-full h-full bg-opacity-40 flex flex-col justify-center items-center text-center px-4 py-8">
              <div className="w-full text-center max-w-md sm:max-w-lg md:max-w-xl text-white flex flex-col justify-center">
                <div className="w-full flex flex-col justify-between items-center">
                  <div className="w-full flex flex-col items-center justify-center">
                    <h1 className="text-[24px] md:text-[30px] lg:text-4xl pb-4 lg:pb-7 font-medium">
                      Register Now
                    </h1>
                    <p className="text-[16px] lg:text-[22px] font-medium xl:px-16">
                      Please provide the informations to register your account
                    </p>
                  </div>
                  <p className="text-[18px] lg:text-[19px] font-medium py-3 lg:mb-5">
                    Already have an account? Log in
                  </p>
                </div>

                <div className="w-full max-w-xs self-center">
                  <Link to={"/login"} className="w-full">
                    <motion.button
                      className="btn bg-transparent border-2 py-5 font-medium w-full border-mainColor hover:bg-mainColor hover:text-white text-white text-[18px] transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Log in
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {verification ? (
        <div className=" fixed z-50 inset-0  ">
          <VerificationEmail email={verificationEmail} />
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
