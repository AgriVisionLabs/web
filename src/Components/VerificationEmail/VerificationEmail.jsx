/* eslint-disable react/prop-types */
import { useState } from "react";
import { useContext } from "react";
import { userContext } from "../../Context/User.context";
import axios from "axios";
import { AllContext } from "../../Context/All.context";

const VerificationEmail = ({ email }) => {
  let { setVerification } = useContext(userContext);
  let { baseUrl } = useContext(AllContext);
  let [seconds, setSeconds] = useState(30);
  let [errorMessage, setErrorMessage] = useState("");
  let [isEmailVerified, setIsEmailVerified] = useState(false);
  // const date= new Date();
  // date.toISOString
  let intervalID = setInterval(witeTime, 1000);
  function witeTime() {
    if (seconds >= 1) {
      seconds = seconds - 1;
      setSeconds(seconds);
    } else {
      setSeconds(0);
      clearInterval(intervalID);
    }
  }
  async function ResendVerificationEmail() {
    try {
      setErrorMessage(""); // Clear any previous error
      console.log(email);
      const option = {
        url: `${baseUrl}/auth/resend-confirmation-email`,
        method: "POST",
        data: {
          email: email,
        },
      };
      await axios(option);
      console.log("Verification email sent successfully");

      // Show success message
      setErrorMessage(""); // Clear any errors
      // You could add a success state here if needed
    } catch (error) {
      console.log("resend-confirmation-email error", error);

      // Handle different error cases
      if (error.response?.status === 400) {
        // Email is already verified
        setErrorMessage(
          "This email is already verified. You can proceed to login."
        );
        setIsEmailVerified(true); // Disable further resend attempts
      } else if (error.response?.status === 404) {
        setErrorMessage("Email not found. Please check your email address.");
      } else {
        setErrorMessage(
          "Failed to send verification email. Please try again later."
        );
      }
    }
  }
  // Removed automatic resend on mount to prevent "email already verified" error
  // useEffect(()=>{
  //     ResendVerificationEmail();
  // },[])
  // useEffect(()=>{witeTime()},[date.toLocaleTimeString()])
  return (
    <section
      className="fixed inset-0 h-[100vh] flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-md z-[999] p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setVerification(false);
        }
      }}
    >
      <div className="w-full max-w-lg border-2 rounded-lg sm:rounded-2xl bg-white flex flex-col items-center pb-6 sm:pb-8">
        {/* Close button with X icon */}
        <div className="w-full px-4 sm:px-6 mt-3 text-[22px] flex justify-end">
          <button
            className="text-[#9F9F9F] hover:text-gray-700 transition-colors duration-300 p-2 rounded-full hover:bg-gray-100"
            onClick={() => setVerification(false)}
            aria-label="Close"
          >
            <svg
              width="24"
              height="24"
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

        {/* Email icon */}
        <div className="flex justify-center items-center mt-2 sm:mt-4 mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-[70px] sm:h-[70px] bg-[#1e693029] rounded-full flex justify-center items-center">
            <svg
              width="28"
              height="28"
              className="sm:w-8 sm:h-8"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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
                className="text-mainColor"
              />
              <path
                d="M22 7L13.03 12.7C12.71 12.89 12.36 13 12 13C11.64 13 11.29 12.89 10.97 12.7L2 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-mainColor"
              />
            </svg>
          </div>
        </div>

        <div className="px-4 sm:px-8 w-full text-center">
          <h1 className="text-xl sm:text-[22px] font-bold mb-3 sm:mb-4">
            Verify your email
          </h1>
          <h2 className="text-sm sm:text-[17px] font-medium text-[#6b6a6a] mb-2 sm:mb-3">
            To complete your registration, please verify:
          </h2>
          <p className="text-base sm:text-[19px] font-semibold mb-3 sm:mb-4 break-all">
            {email}
          </p>
          <h2 className="text-sm sm:text-[17px] font-medium text-[#6b6a6a] mb-4 sm:mb-6">
            Click the button below to send a verification email.
          </h2>

          {/* Display error message if exists */}
          {errorMessage && (
            <div className="w-full mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-center text-sm sm:text-[15px] font-medium">
                {errorMessage}
              </p>
            </div>
          )}

          {!isEmailVerified &&
            (seconds == 0 ? (
              <>
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 rounded-full border-2 font-medium mt-4 sm:mt-6 text-sm sm:text-[16px] transition-all duration-300 bg-mainColor text-white border-mainColor hover:bg-white hover:text-mainColor hover:border-mainColor"
                  onClick={() => {
                    ResendVerificationEmail();
                    setSeconds(30);
                    intervalID = setInterval(witeTime, 1000);
                  }}
                >
                  Resend verification email
                </button>
              </>
            ) : (
              <>
                <div className="bg-[#F3F4F6] w-full sm:w-auto inline-block px-8 sm:px-10 py-3 sm:py-5 rounded-full text-[#9CA1A4] font-medium mt-4 sm:mt-6 text-sm sm:text-[16px]">
                  Resend in {seconds} S
                </div>
              </>
            ))}

          <p className="text-xs sm:text-[13px] font-medium text-[#6b6a6a] mt-4 sm:mt-6 mb-2 sm:mb-4">
            After sending, check your email and spam folder for the verification
            link.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VerificationEmail;
