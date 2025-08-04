/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Check from "../check/Check";
import { AllContext } from "../../Context/All.context";
import { userContext } from "../../Context/User.context";
import { useNavigate, useLocation } from "react-router-dom";

const MfaOtp = ({ email, setShowOtpPopup, rememberMe }) => {
  const { baseUrl } = useContext(AllContext);
  const {
    setToken,
    setRefreshToken,
    setExpiresIn,
    setTokenExpiration,
    setRefreshTokenExpiration,
  } = useContext(userContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpValue, setOtpValue] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState(false);

  // Validation
  const validationSchema = Yup.object({
    otpCode: Yup.string()
      .required("OTP is required")
      .length(6, "OTP must be 6 digits"),
  });

  const formik = useFormik({
    initialValues: {
      otpCode: "",
    },
    validationSchema,
    onSubmit: handleOtpSubmit,
  });

  async function handleOtpSubmit(values) {
    setLoading(true);
    setError("");
    setOtpError(false);

    try {
      const response = await axios.post(`${baseUrl}/auth/verify-mfa-otp`, {
        email,
        otpCode: values.otpCode,
      });

      const data = response.data;
      console.log("MFA verified:", data);

      const tokenExpirationTime = new Date(
        Date.now() + data.expiresIn * 60 * 1000
      );

      if (data.refreshTokenExpiration) {
        localStorage.setItem(
          "refreshTokenExpiration",
          data.refreshTokenExpiration
        );
        setRefreshTokenExpiration(data.refreshTokenExpiration);
      }

      setToken(data.token);
      setRefreshToken(data.refreshToken);
      setExpiresIn(data.expiresIn);
      setTokenExpiration(tokenExpirationTime.toISOString());

      if (rememberMe) {
        localStorage.setItem("userId", data.id);
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("expiresIn", data.expiresIn);
        localStorage.setItem(
          "tokenExpiration",
          tokenExpirationTime.toISOString()
        );
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", "");
        localStorage.setItem("rememberMe", "true");
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userId", data.id);
        sessionStorage.setItem("refreshToken", data.refreshToken);
        sessionStorage.setItem("expiresIn", data.expiresIn);
        sessionStorage.setItem(
          "tokenExpiration",
          tokenExpirationTime.toISOString()
        );

        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
        localStorage.setItem("rememberMe", "false");
      }

      // Redirect
      const redirect = new URLSearchParams(location.search).get("redirect");
      navigate(redirect || "/dashboard");

      setShowOtpPopup(false);
    } catch (err) {
      console.error("MFA error:", err);
      if (err.response?.status === 401) {
        setError("Invalid or expired OTP. Please check your code and try again.");
        setOtpValue(["", "", "", "", "", ""]);
        setOtpError(true);
      } else if (err.response?.status === 429) {
        const errorData = err.response?.data;
        if (errorData?.errors?.some((err) => err.code === "User.ExceedLimit")) {
          setError("Too many OTP attempts. Please try again later.");
        } else {
          setError("Too many attempts. Please wait before trying again.");
        }
      } else if (err.response?.status === 400) {
        const errorData = err.response?.data;
        if (errorData?.errors?.otpCode) {
          setError("Please enter a valid 6-digit OTP code.");
        } else {
          setError("Invalid request. Please check your OTP code.");
        }
      } else {
        setError("Verification failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // Clear OTP values when component mounts
  useEffect(() => {
    setOtpValue(["", "", "", "", "", ""]);
  }, []);

  useEffect(() => {
    formik.setFieldValue("otpCode", otpValue.join(""));
    if (otpError && otpValue.some((v) => v !== "")) {
      setOtpError(false);
      setError("");
    }
  }, [otpValue, otpError]);

  return (
    <section className="fixed inset-0 h-[100vh] flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-md z-[999]">
      <div className="w-[540px] h-[530px] border-2 rounded-2xl bg-white flex flex-col items-center justify-center relative">
        <div className="absolute top-5 left-5">
          <button
            className="text-[#9F9F9F] hover:text-black transition-colors duration-300 p-2 rounded-full hover:bg-gray-100"
            onClick={() => setShowOtpPopup(false)}
            aria-label="Go back"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5M12 19L5 12L12 5"
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
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-mainColor"
              >
                <rect
                  x="2"
                  y="4"
                  width="20"
                  height="16"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M22 7L13.03 12.7C12.71 12.89 12.36 13 12 13C11.64 13 11.29 12.89 10.97 12.7L2 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          
          <h1 className="text-[25px] text-mainColor capitalize font-medium mb-4">
            Multi-Factor Authentication
          </h1>
          
          <div className="flex items-center justify-center mb-4">
            <p className="w-[400px] text-[16px] text-center text-[#333333]">
              Enter the verification code we just sent to your email address
            </p>
            <div className="group relative ml-2">
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
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none z-50">
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-800"></div>
                <div className="font-medium text-blue-200 mb-1">
                  OTP Instructions:
                </div>
                <div>• Check your email inbox and spam folder</div>
                <div>• Enter the 6-digit code you received</div>
                <div>• Code expires in 10 minutes</div>
              </div>
            </div>
          </div>

          <p className="text-base text-center sm:text-[19px] font-semibold mb-3 sm:mb-10 break-all">
            {email}
          </p>

          {error && (
            <div className="w-[400px] mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm font-medium text-center">
                {error}
              </p>
            </div>
          )}

          <form
            onSubmit={formik.handleSubmit}
            className="w-[400px] my-6 flex flex-col items-center"
          >
            <div className="space-x-5">
              <Check
                otpValue={otpValue}
                setOtpValue={setOtpValue}
                hasError={otpError}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || otpValue.join("").length !== 6}
              className={`btn w-full py-5 bg-mainColor text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium mt-12 transition-all duration-300 ${
                loading || otpValue.join("").length !== 6
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default MfaOtp;
