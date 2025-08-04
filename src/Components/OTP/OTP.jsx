/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { AllContext } from "../../Context/All.context";
import Check from "../check/Check";
import { object, string } from "yup";
import axios from "axios";
import { useFormik } from "formik";

const OTP = ({
  emailOfForgotPassword,
  otpValue,
  setOtpValue,
  setResetToken,
}) => {
  let { setOtp, setForgetPassword, setResetPassword, outClick, baseUrl } =
    useContext(AllContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  console.log(emailOfForgotPassword);

  var validationSchema = object({
    email: string().required("Email is required"),
    otpCode: string()
      .required("OTP is required")
      .length(6, "OTP must be 6 digits"),
  });

  async function sendOTP(values) {
    console.log("sendOTP: ", values);
    setLoading(true);
    setError("");
    setOtpError(false);

    try {
      const options = {
        url: `${baseUrl}/Auth/verify-password-reset-otp`,
        method: "POST",
        data: values,
      };
      let { data } = await axios(options);
      console.log("sendOTP response:", data);

      // Store the token for the reset password step
      if (typeof data === "string") {
        // The response is directly the token string
        setResetToken(data);
      } else if (data.token) {
        // The response has a token property
        setResetToken(data.token);
      } else {
        throw new Error("No token received from server");
      }

      setResetPassword(true);
      setOtp(false);
    } catch (error) {
      console.log("sendOTP error:", error);

      // Handle specific error cases
      if (error.response?.status === 401) {
        console.log("401 error detected in sendOTP");
        const errorData = error.response?.data;
        console.log("SendOTP Error data:", errorData);
        setError(
          "Invalid or expired OTP. Please check your code and try again."
        );
        setOtpValue(["", "", "", "", "", ""]); // Clear the OTP fields first
        setOtpError(true); // Make OTP fields red
        console.log("Set otpError to true from sendOTP");
      } else if (error.response?.status === 429) {
        const errorData = error.response?.data;
        if (errorData?.errors?.some((err) => err.code === "User.ExceedLimit")) {
          setError("Too many OTP attempts. Please try again later.");
        } else {
          setError("Too many attempts. Please wait before trying again.");
        }
      } else if (error.response?.status === 400) {
        const errorData = error.response?.data;
        if (errorData?.errors?.otpCode) {
          setError("Please enter a valid 6-digit OTP code.");
        } else {
          setError("Invalid request. Please check your OTP code.");
        }
      } else {
        setError("Failed to verify OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // Handle resend OTP
  async function resendOTP() {
    if (resendCooldown > 0) return;

    setResendLoading(true);
    setError("");
    setOtpError(false);

    try {
      const options = {
        url: `${baseUrl}/Auth/request-password-reset`,
        method: "POST",
        data: { email: emailOfForgotPassword },
      };
      await axios(options);

      // Start cooldown timer
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.log("resendOTP error:", error);
      console.log("resendOTP error status:", error.response?.status);
      console.log("resendOTP error data:", error.response?.data);

      if (error.response?.status === 401) {
        console.log("401 error detected in resendOTP");
        const errorData = error.response?.data;
        console.log("Error data:", errorData);
        setError("Invalid or expired OTP session. Please start over.");
        setOtpValue(["", "", "", "", "", ""]); // Clear the OTP fields first
        setOtpError(true); // Make OTP fields red
        console.log("Set otpError to true");
      } else if (error.response?.status === 429) {
        setError(
          "Too many requests. Please wait before requesting another code."
        );
      } else if (error.response?.status === 404) {
        setError("Email not found. Please start over.");
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } finally {
      setResendLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      otpCode: "",
      email: "",
    },
    validationSchema,
    onSubmit: sendOTP,
  });

  // Clear OTP values when component mounts (don't remember previously typed OTP)
  useEffect(() => {
    setOtpValue(["", "", "", "", "", ""]);
  }, []);

  useEffect(() => {
    formik.values.email = emailOfForgotPassword;
    formik.values.otpCode = otpValue.join("");

    // Clear OTP error when user starts typing
    if (otpError && otpValue.some((val) => val !== "")) {
      setOtpError(false);
      setError("");
    }
  }, [otpValue, emailOfForgotPassword, otpError]);

  return (
    <section
      className="fixed inset-0 h-[100vh] flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-md z-[999]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          outClick();
        }
      }}
    >
      <div className="w-[540px] h-[530px] border-2 rounded-2xl bg-white flex flex-col items-center justify-center relative">
        <div className="absolute top-5 left-5">
          <button
            className="text-[#9F9F9F] hover:text-black transition-colors duration-300 p-2 rounded-full hover:bg-gray-100"
            onClick={() => {
              setOtp(false);
              setForgetPassword(true);
            }}
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
            OTP Verification
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

          {error && (
            <div className="w-[400px] mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm font-medium text-center">
                {error}
              </p>
            </div>
          )}

          <form
            action=""
            className="w-[400px] my-6 flex flex-col items-center"
            onSubmit={formik.handleSubmit}
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
              {loading ? "Verifying..." : "Verify"}
            </button>
            <p className="my-3 text-[#333333] text-[15px]">
              Didn&apos;t receive code?{" "}
              <button
                type="button"
                onClick={resendOTP}
                disabled={resendLoading || resendCooldown > 0}
                className={`text-mainColor hover:text-green-700 transition-colors duration-300 ${
                  resendLoading || resendCooldown > 0
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {resendLoading
                  ? "Sending..."
                  : resendCooldown > 0
                  ? `Resend (${resendCooldown}s)`
                  : "Resend"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default OTP;
