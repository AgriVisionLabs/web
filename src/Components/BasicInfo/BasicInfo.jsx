/* eslint-disable react/prop-types */
import { useContext, useEffect } from "react";
import { AllContext } from "../../Context/All.context";
import { useState } from "react";
import MenuElement from "../MenuElement/MenuElement";
import { useFormik } from "formik";
import { number, object, string } from "yup";
import { motion } from "framer-motion";
import axios from "axios";
import { userContext } from "../../Context/User.context";

const BasicInfo = ({ farmData, setFarmData }) => {
  const { outClick, setBasicInfo, setTeam, baseUrl } = useContext(AllContext);
  const { token } = useContext(userContext);
  let [indexBI, setIndexBI] = useState(0);
  let [onList, setOnList] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  var SoilTypes = ["Sandy", "Clay", "Loamy"];

  const validationSchema = object({
    name: string()
      .required("Farm Name is required")
      .min(3, "Farm Name must be at least 3 characters")
      .max(100, "Farm Name cannot be more than 100 characters"),

    area: number()
      .required("Farm Size is required")
      .min(0.25, "The farm area must be at least 0.25 acres"),

    location: string()
      .required("Farm Location is required")
      .min(3, "Farm Location must be at least 3 characters")
      .max(200, "Farm Location cannot be more than 200 characters"),

    soilType: number()
      .required("Soil Type is required")
      .oneOf([0, 1, 2], "Please select a valid soil type"),
  });
  async function AddFarm(values, { setSubmitting }) {
    // Clear previous server errors
    setServerError("");
    setIsLoading(true);
    values.soilType = indexBI;
    // Update local state (optional, kept for further steps)
    setFarmData((prev) => ({
      ...prev,
      name: values.name,
      area: values.area,
      location: values.location,
      soilType: values.soilType,
    }));

    if (!token) {
      setServerError("You must be logged in to create a farm.");
      return;
    }

    try {
      const response = await axios({
        url: `${baseUrl}/farms`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          name: values.name,
          area: values.area,
          location: values.location,
          soilType: values.soilType,
        },
      });

      const { status, data } = response;

      if (status === 200 || status === 201) {
        // Store farmId for later steps
        setFarmData((prev) => ({ ...prev, farmId: data.farmId }));
        setIsSuccess(true);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 409) {
          setServerError(
            "You already have a farm with that name. Please choose a different name."
          );
        } else if (status === 400) {
          let msg = "Please check your input and try again.";
          if (data.errors && data.errors.length > 0) {
            msg = data.errors[0].description || msg;
          }
          setServerError(msg);
        } else {
          setServerError(
            data.title || "Failed to create farm. Please try again."
          );
        }
      } else if (error.request) {
        setServerError(
          "Network error. Please check your connection and try again."
        );
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    } finally {
      if (setSubmitting) setSubmitting(false);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    console.log("ِafter");
    console.log("farmData updated ===>", farmData);
  }, [farmData]);
  const formik = useFormik({
    initialValues: {
      name: "",
      area: 0,
      location: "",
      soilType: 0,
    },
    validationSchema,
    onSubmit: AddFarm,
  });
  formik.values.soilType = indexBI;
  console.log("farmData", farmData);
  // const popupHeightClass = serverError ? "h-[780px]" : "h-[680px]";

  return (
    <section
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-md z-50 p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          outClick();
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{
          duration: 0.4,
          ease: [0.23, 1, 0.32, 1],
        }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-lg sm:rounded-2xl border-2 flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-lg sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-semibold text-mainColor capitalize">
              Add New Farm
            </h1>
            <button
              onClick={() => setBasicInfo(false)}
              className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <i className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors text-lg sm:text-xl"></i>
            </button>
          </div>

          {/* Progress Steps - Mobile responsive */}
          <div className="mt-4">
            <div className="flex items-center justify-center sm:justify-between gap-2 sm:gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 sm:w-9 sm:h-9 text-sm sm:text-base text-white flex justify-center items-center bg-mainColor rounded-full">
                  <p>1</p>
                </div>
                <p className="text-xs sm:text-sm mt-1">Basic Info</p>
              </div>

              <div className="w-8 sm:w-16 h-0.5 rounded-full bg-mainColor opacity-30"></div>

              <div className="flex flex-col items-center">
                <div className="w-8 h-8 sm:w-9 sm:h-9 text-sm sm:text-base text-white flex justify-center items-center bg-mainColor rounded-full opacity-30">
                  <p>2</p>
                </div>
                <p className="text-xs sm:text-sm mt-1">Team</p>
              </div>

              <div className="w-8 sm:w-16 h-0.5 rounded-full bg-mainColor opacity-30"></div>

              <div className="flex flex-col items-center">
                <div className="w-8 h-8 sm:w-9 sm:h-9 text-sm sm:text-base text-white flex justify-center items-center bg-mainColor rounded-full opacity-30">
                  <p>3</p>
                </div>
                <p className="text-xs sm:text-sm mt-1">Review</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-6 flex-1">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainColor"></div>
              <p className="text-[#808080] mt-4 text-sm sm:text-base">
                Creating farm...
              </p>
            </div>
          ) : isSuccess ? (
            <div className="flex flex-col justify-center items-center py-16 text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#1e693029] rounded-full flex justify-center items-center">
                  <i className="fa-solid fa-check text-xl sm:text-2xl text-mainColor"></i>
                </div>
              </div>
              <p className="text-green-700 text-lg sm:text-xl font-semibold mb-6">
                Farm created successfully!
              </p>
              <button
                className="w-full sm:w-auto px-6 py-3 rounded-[45px] bg-mainColor text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium transition-all duration-200"
                onClick={() => {
                  setBasicInfo(false);
                  setTeam(true);
                }}
              >
                Continue
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={formik.handleSubmit}>
              {serverError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-medium">
                    {serverError}
                  </p>
                </div>
              )}

              {/* Farm Name */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="name"
                    className={`text-base sm:text-lg font-semibold transition-colors duration-200 ${
                      formik.touched.name && formik.errors.name
                        ? "text-red-500"
                        : "text-[#0D121C]"
                    }`}
                  >
                    Farm Name
                  </label>
                  <div className="relative group">
                    <i className="fa-solid fa-info-circle text-gray-400 hover:text-gray-600 cursor-help text-sm"></i>
                    <div className="absolute left-0 bottom-full mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      Must be 3-100 characters long
                      <div className="absolute top-full left-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter Farm Name"
                  className={`w-full border-2 rounded-[45px] px-4 py-3 text-sm sm:text-base focus:outline-none transition-colors duration-200 ${
                    formik.touched.name && formik.errors.name
                      ? "border-red-500 text-red-500 placeholder-red-400 focus:border-red-500"
                      : "border-[#0d121c21] focus:border-mainColor"
                  }`}
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-sm">{formik.errors.name}</p>
                )}
              </div>

              {/* Farm Size */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="size"
                    className={`text-base sm:text-lg font-semibold transition-colors duration-200 ${
                      formik.touched.area && formik.errors.area
                        ? "text-red-500"
                        : "text-[#0D121C]"
                    }`}
                  >
                    Farm Size (acres)
                  </label>
                  <div className="relative group">
                    <i className="fa-solid fa-info-circle text-gray-400 hover:text-gray-600 cursor-help text-sm"></i>
                    <div className="absolute left-0 bottom-full mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      Must be at least 0.25 acres
                      <div className="absolute top-full left-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                </div>
                <input
                  id="size"
                  type="number"
                  step="0.01"
                  min="0.25"
                  placeholder="Enter Farm Size"
                  className={`w-full border-2 rounded-[45px] px-4 py-3 text-sm sm:text-base focus:outline-none transition-colors duration-200 ${
                    formik.touched.area && formik.errors.area
                      ? "border-red-500 text-red-500 placeholder-red-400 focus:border-red-500"
                      : "border-[#0d121c21] focus:border-mainColor"
                  }`}
                  name="area"
                  value={formik.values.area}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.area && formik.errors.area && (
                  <p className="text-red-500 text-sm">{formik.errors.area}</p>
                )}
              </div>

              {/* Farm Location */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="loc"
                    className={`text-base sm:text-lg font-semibold transition-colors duration-200 ${
                      formik.touched.location && formik.errors.location
                        ? "text-red-500"
                        : "text-[#0D121C]"
                    }`}
                  >
                    Farm Location
                  </label>
                  <div className="relative group">
                    <i className="fa-solid fa-info-circle text-gray-400 hover:text-gray-600 cursor-help text-sm"></i>
                    <div className="absolute left-0 bottom-full mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      Must be 3-200 characters long
                      <div className="absolute top-full left-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                </div>
                <input
                  id="loc"
                  type="text"
                  placeholder="Enter Farm Location"
                  className={`w-full border-2 rounded-[45px] px-4 py-3 text-sm sm:text-base focus:outline-none transition-colors duration-200 ${
                    formik.touched.location && formik.errors.location
                      ? "border-red-500 text-red-500 placeholder-red-400 focus:border-red-500"
                      : "border-[#0d121c21] focus:border-mainColor"
                  }`}
                  name="location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.location && formik.errors.location && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.location}
                  </p>
                )}
              </div>

              {/* Soil Type */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label
                    className={`text-base sm:text-lg font-semibold transition-colors duration-200 ${
                      formik.touched.soilType && formik.errors.soilType
                        ? "text-red-500"
                        : "text-[#0D121C]"
                    }`}
                  >
                    Soil Type
                  </label>
                  <div className="relative group">
                    <i className="fa-solid fa-info-circle text-gray-400 hover:text-gray-600 cursor-help text-sm"></i>
                    <div className="absolute left-0 bottom-full mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      Select: Sandy, Clay, or Loamy
                      <div className="absolute top-full left-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                </div>
                <MenuElement
                  Items={SoilTypes}
                  name={"Soil Type"}
                  width="100%"
                  nameChange={SoilTypes[indexBI]}
                  setIndex={setIndexBI}
                  index={indexBI}
                  textColor={"#000"}
                  className={"rounded-[45px]"}
                  onList={onList}
                  setOnList={setOnList}
                  Pformat="text-sm sm:text-base"
                />
                {formik.touched.soilType && formik.errors.soilType && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.soilType}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Footer - Only show for form, not loading or success */}
        {!isLoading && !isSuccess && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4 rounded-b-lg sm:rounded-b-2xl">
            <button
              type="submit"
              onClick={formik.handleSubmit}
              className="w-full py-3 rounded-[45px] bg-mainColor text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium transition-all duration-200 disabled:opacity-50"
              disabled={isLoading}
            >
              Next <i className="fa-solid fa-angle-right ms-2"></i>
            </button>
          </div>
        )}
      </motion.div>
    </section>
  );
};
// onClick={()=>{
//     setBasicInfo(false);
//     setTeam(true);
//     console.log(formik.values)
// }}

export default BasicInfo;
