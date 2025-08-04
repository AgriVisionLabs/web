import { Shield } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import ToggleSwitch from "../ui/ToggleSwitch";
import axios from "axios";
import { AllContext } from "../../Context/All.context";
import { userContext } from "../../Context/User.context";
import { object, string, ref } from "yup";
import { useFormik } from "formik";

const Security = () => {
  const { baseUrl } = useContext(AllContext);
  const { token } = useContext(userContext);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mfaLoading, setMfaLoading] = useState(false);

  // Password validation schema
  const passwordValidationSchema = object({
    currentPassword: string().required("Current password is required"),
    newPassword: string()
      .required("New password is required")
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
        "Password should be at least eight characters, at least one upper case English letter, one lower case English letter, one number and one special character"
      ),
    confirmPassword: string()
      .required("Confirm password is required")
      .oneOf([ref("newPassword")], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: passwordValidationSchema,
    onSubmit: changePassword,
  });

  async function getMfaState() {
    try {
      setMfaLoading(true);
      const response = await axios.get(`${baseUrl}/Accounts/Mfa`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("MFA state response:", response.data);
      setMfaEnabled(response.data.isEnabled);
    } catch (err) {
      console.error("Error fetching MFA state:", err);
    } finally {
      setMfaLoading(false);
    }
  }

  async function setMfaState(newValue) {
    try {
      setMfaLoading(true);
      await axios.put(`${baseUrl}/Accounts/Mfa`, {
        isEnabled: newValue,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMfaEnabled(newValue);
      console.log("MFA state updated successfully:", newValue);
    } catch (err) {
      console.error("Error updating MFA state:", err);
      // Revert the toggle if the API call failed
      setMfaEnabled(!newValue);
    } finally {
      setMfaLoading(false);
    }
  }

  async function changePassword(values) {
    try {
      setLoading(true);
      await axios.put(`${baseUrl}/Accounts/change-password`, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Clear form and hide it on success
      formik.resetForm();
      setShowPasswordForm(false);
    } catch (err) {
      console.error("Error changing password:", err);
      if (err.response?.data?.message) {
        formik.setFieldError("currentPassword", err.response.data.message);
      } else {
        formik.setFieldError("currentPassword", "Failed to change password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMfaState();
  }, []);

  return (
    <section className="mb-[20px]">
      <div className=" border-[1px] border-[rgba(13,18,28,0.25)] rounded-[12px]  p-[16px] ">
        <div className="">
          <div className="flex space-x-2 items-center text-[#0D121C]  mb-[8px]">
            <Shield size={20} strokeWidth={1.8} />
            <h2 className="text-[17px] font-medium ">Security Settings</h2>
          </div>
          <p className="text-[#9F9F9F] text-[14px] font-medium">
            Manage your account security and authentication methods.
          </p>
        </div>
        <div className="flex space-x-2 items-center justify-between mt-[18px]">
          <div className=" text-[#0D121C] ">
            <h3 className="text-[15px] font-medium  mb-[6px]">
              Multifactor Authentication
            </h3>
            <p className="text-[#9F9F9F] text-[13px] font-medium">
              Add an extra layer of security to your account
            </p>
          </div>
          <ToggleSwitch
            enabled={mfaEnabled}
            onClick={() => {
              if (!mfaLoading) {
                const newValue = !mfaEnabled;
                setMfaState(newValue);
              }
            }}
          />
        </div>
        <div className="mt-[16px]">
          <div className="border-t-[1px] border-[#0d121c3c] py-[12px]">
            <h3 className="mb-[8px] text-[15px] font-semibold">Password</h3>
            <div className="flex justify-between items-center ">
              <div className="flex space-x-1">
                <div className="rounded-full h-[4px] w-[4px] bg-black"></div>
                <div className="rounded-full h-[4px] w-[4px] bg-black"></div>
                <div className="rounded-full h-[4px] w-[4px] bg-black"></div>
                <div className="rounded-full h-[4px] w-[4px] bg-black"></div>
                <div className="rounded-full h-[4px] w-[4px] bg-black"></div>
                <div className="rounded-full h-[4px] w-[4px] bg-black"></div>
                <div className="rounded-full h-[4px] w-[4px] bg-black"></div>
                <div className="rounded-full h-[4px] w-[4px] bg-black"></div>
              </div>
              <button
                type="button"
                className="py-[3px] px-[16px] border-[1px] border-[#616161] rounded-[10px]  text-[13px] text-[#333333] hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-medium"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                <div className="flex justify-center items-center space-x-[8px]">
                  <p className="">Change Password</p>
                </div>
              </button>
            </div>
            {showPasswordForm && (
              <form onSubmit={formik.handleSubmit} className="mt-4 space-y-3">
                {/* Current Password */}
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Current Password"
                    name="currentPassword"
                    className={`w-full px-3 py-2 border rounded text-sm ${
                      formik.errors.currentPassword && formik.touched.currentPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    value={formik.values.currentPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.values.currentPassword && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        tabIndex={-1}
                      >
                        {showCurrentPassword ? (
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
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
                  {formik.errors.currentPassword && formik.touched.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.currentPassword}</p>
                  )}
                </div>

                {/* New Password */}
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New Password"
                    name="newPassword"
                    className={`w-full px-3 py-2 border rounded text-sm ${
                      formik.errors.newPassword && formik.touched.newPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    {formik.values.newPassword && (
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        tabIndex={-1}
                      >
                        {showNewPassword ? (
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
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z"
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
                  {formik.errors.newPassword && formik.touched.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.newPassword}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    name="confirmPassword"
                    className={`w-full px-3 py-2 border rounded text-sm ${
                      formik.errors.confirmPassword && formik.touched.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.values.confirmPassword && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
                  {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-mainColor text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      formik.resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Security;
