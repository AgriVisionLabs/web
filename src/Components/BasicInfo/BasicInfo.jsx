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
  const popupHeightClass = serverError ? "h-[780px]" : "h-[680px]";

  return (
    <section
      className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-[blur(5)] absolute z-50 w-[100%] px-2"
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
        className={`w-[600px] ${popupHeightClass} border-2 rounded-2xl bg-white flex flex-col items-center`}
      >
        <div className="w-[95%] mt-5 text-[22px] flex justify-end">
          <i
            className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300 "
            onClick={() => {
              setBasicInfo(false);
            }}
          ></i>
        </div>
        <div className="flex flex-col justify-center items-center  mb-5">
          <div className=" capitalize mb-5 text-[20px] font-semibold text-mainColor">
            add new farm
          </div>
          <div className="w-[100%] rounded-xl flex gap-4  items-center">
            <div className="flex flex-col items-center ">
              <div className="w-[35px] h-[35px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full">
                <p className="">1</p>
              </div>
              <p className="mt-2">Basic Info</p>
            </div>

            <div className="w-[30px] -ml-2 lg:ml-0 lg:w-[100px] h-[1.6px] rounded-full bg-mainColor opacity-[0.3]"></div>

            <div className=" flex flex-col items-center ">
              <div className="w-[35px] h-[35px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full opacity-[0.3]">
                <p className="">2</p>
              </div>
              <p className="mt-2">Team</p>
            </div>

            <div className="w-[30px] -ml-1 lg:ml-0 lg:w-[100px] h-[1.6px] rounded-full bg-mainColor opacity-[0.3]"></div>

            <div className=" flex flex-col items-center ">
              <div className="w-[35px] h-[35px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full opacity-[0.3]">
                <p className="">3</p>
              </div>
              <p className="mt-2">Review</p>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="flex flex-col justify-center items-center flex-grow w-[80%]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainColor"></div>
            <p className="text-[#808080] mt-4">Creating farm...</p>
          </div>
        ) : isSuccess ? (
          <div className="flex flex-col justify-center items-center flex-grow w-full">
            <div className="flex justify-center items-center mb-4">
              <div className="w-[55px] h-[55px] bg-[#1e693029] rounded-full flex justify-center items-center">
                <i className="fa-solid fa-check text-2xl text-mainColor"></i>
              </div>
            </div>
            <p className="text-green-700 text-[20px] font-semibold mb-6 text-center">
              Farm created successfully!
            </p>
            <button
              className="mt-4 py-2.5 px-6 rounded-xl bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium"
              onClick={() => {
                setBasicInfo(false);
                setTeam(true);
              }}
            >
              Continue
            </button>
          </div>
        ) : (
        <form
          className="w-[80%] my-3 flex flex-col text-[18px] space-y-3"
          onSubmit={formik.handleSubmit}
        >
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm font-medium">
                {serverError}
              </p>
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <label 
                htmlFor="name" 
                className={`ms-1 transition-colors duration-200 ${
                  formik.touched.name && formik.errors.name 
                    ? 'text-red-500' 
                    : ''
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
              className={`formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] transition-colors duration-200 ${
                formik.touched.name && formik.errors.name
                  ? 'border-red-500 text-red-500 placeholder-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-[#0d121c21] focus:border-mainColor'
              }`}
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <label 
                htmlFor="size" 
                className={`ms-1 transition-colors duration-200 ${
                  formik.touched.area && formik.errors.area 
                    ? 'text-red-500' 
                    : ''
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
              className={`formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] transition-colors duration-200 ${
                formik.touched.area && formik.errors.area
                  ? 'border-red-500 text-red-500 placeholder-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-[#0d121c21] focus:border-mainColor'
              }`}
              name="area"
              value={formik.values.area}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <label 
                htmlFor="loc" 
                className={`ms-1 transition-colors duration-200 ${
                  formik.touched.location && formik.errors.location 
                    ? 'text-red-500' 
                    : ''
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
              className={`formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] transition-colors duration-200 ${
                formik.touched.location && formik.errors.location
                  ? 'border-red-500 text-red-500 placeholder-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-[#0d121c21] focus:border-mainColor'
              }`}
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <label 
                className={`transition-colors duration-200 ${
                  formik.touched.soilType && formik.errors.soilType 
                    ? 'text-red-500' 
                    : ''
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
              width={100 + "%"}
              nameChange={SoilTypes[indexBI]}
              setIndex={setIndexBI}
              index={indexBI}
              textColor={"#000"}
              className={"my-2 rounded-xl"}
              onList={onList}
              setOnList={setOnList}
            />
          </div>

          <button
            type="submit"
            className="py-2.5 rounded-xl bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium mt-6 disabled:opacity-50"
            disabled={isLoading}
          >
            Next <i className="fa-solid fa-angle-right ms-3"></i>
          </button>
        </form>
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
