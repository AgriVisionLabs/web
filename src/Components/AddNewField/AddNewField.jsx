// import { useContext, useEffect, useState } from "react";
// import { AllContext } from "../../Context/All.context";
// import MenuElementCrop from "../MenuElement/MenuElementCrop";
// import { userContext } from "../../Context/User.context";
// import axios from "axios";

// const AddNewField = (children) => {
//   let { outClick, setAddField, baseUrl } = useContext(AllContext);
//   let { token } = useContext(userContext);
//   let [data, setData] = useState();
//   let [index, setIndex] = useState(0);
//   async function getCrops() {
//     try {
//       const options = {
//         url: `${baseUrl}/Crops`,
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       let { data } = await axios(options);
//       setData(data);
//       children.setCropType(data);
//       console.log("getCrops", data);
//     } catch (error) {
//       // toast.error("Incorrect email or password "+error);
//       console.log(error);
//     }
//   }

//   useEffect(() => {
//     getCrops();
//   }, []);

//   useEffect(() => {
//     children.setFieldData((prev) => ({
//       ...prev,
//       CropType: index,
//     }));
//   }, [index]);

//   return data ? (
//     <section
//       className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70  font-manrope backdrop-blur-[blur(5)] absolute z-50 w-[100%]"
//       onClick={(e) => {
//         if (e.target === e.currentTarget) {
//           outClick();
//         }
//       }}
//     >
//       <div className=" w-[650px] h-[660px]   border-2 rounded-2xl bg-white flex  flex-col items-center">
//         <div className="w-[90%] mt-5 text-[22px]  flex justify-end">
//           <i
//             className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300 "
//             onClick={() => {
//               outClick();
//             }}
//           ></i>
//         </div>
//         <div className="flex flex-col justify-center items-center mt-8 mb-5">
//           <div className=" capitalize mb-5 text-[20px] font-semibold text-mainColor">
//             add new field
//           </div>
//   <div className="w-[100%] rounded-xl flex gap-2  items-center">
//     <div className=" flex flex-col items-center ">
//       <div className="w-[33px] h-[33px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full">
//         <p className="">1</p>
//       </div>
//       <p className="mt-2">Basic Info</p>
//     </div>
//     <div className="w-[75px] h-[1.6px] rounded-full bg-mainColor opacity-[0.3]"></div>
//     <div className=" flex flex-col items-center ">
//       <div className="w-[33px] h-[33px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full opacity-[0.3]">
//         <p className="">2</p>
//       </div>
//       <p className="mt-2">Irrigation</p>
//     </div>
//     <div className="w-[75px] h-[1.6px] rounded-full bg-mainColor opacity-[0.3]"></div>
//     <div className=" flex flex-col items-center ">
//       <div className="w-[33px] h-[33px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full opacity-[0.3]">
//         <p className="">3</p>
//       </div>

//       <p className="mt-2">Sensors</p>
//     </div>
//     <div className="w-[75px] h-[1.6px] rounded-full bg-mainColor opacity-[0.3]"></div>
//     <div className=" flex flex-col items-center ">
//       <div className="w-[33px] h-[33px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full opacity-[0.3]">
//         <p className="">4</p>
//       </div>

//       <p className="mt-2">Review</p>
//     </div>
//   </div>
//         </div>

//         <form
//           action=""
//           className="w-[85%] my-5 flex flex-col justify-between  text-[17px]"
//         >
//           <div className="flex flex-col gap-3 my-5">
//             <div className="">
//               <label htmlFor="" className="ms-1">
//                 Field Name
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter Field Name "
//                 className="formControl mx-0 rounded-xl text-[15px] py-5 w-[100%] border-[#0d121c21] "
//                 onChange={(e) => {
//                   children.setFieldData((prev) => ({
//                     ...prev,
//                     FieldName: e.target.value,
//                   }));
//                 }}
//               />
//             </div>

//             <div className="">
//               <label htmlFor="" className="ms-1">
//                 Field Size (acres)
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter Field Size"
//                 className="formControl mx-0 rounded-xl text-[15px] py-5 w-[100%] border-[#0d121c21] "
//                 onChange={(e) => {
//                   children.setFieldData((prev) => ({
//                     ...prev,
//                     FieldSize: e.target.value,
//                   }));
//                 }}
//               />
//             </div>
//             <div className="">
//               <label htmlFor="" className="ms-1 ">
//                 Crop Type
//               </label>
//               <MenuElementCrop
//                 Items={data}
//                 nameChange={data[index].name}
//                 setIndex={setIndex}
//                 className={"mt-[15px]"}
//                 index={index}
//                 Pformat={"text-[#0D121C] font-[400]"}
//               />
//             </div>
//           </div>

//           <button
//             type="button"
//             className="btn self-end rounded-lg py-4 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium mt-[20px]"
//             onClick={() => {
//               setAddField(2);
//             }}
//           >
//             Next <i className="fa-solid fa-angle-right ms-3 "></i>
//           </button>
//         </form>
//       </div>
//     </section>
//   ) : null;
// };
// export default AddNewField;

import { useContext, useEffect, useState } from "react";
import { AllContext } from "../../Context/All.context";
import { userContext } from "../../Context/User.context";
import MenuElementCrop from "../MenuElement/MenuElementCrop";
import { useFormik } from "formik";
import axios from "axios";
import { string, number, object } from "yup";
import toast from "react-hot-toast";

const AddNewField = (children) => {
  const { outClick, setAddField, baseUrl } = useContext(AllContext);
  const { token } = useContext(userContext);
  const [cropsData, setCropsData] = useState([]);
  const [cropIndex, setCropIndex] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const [isFieldCreated, setIsFieldCreated] = useState(false);
  const [createdFieldName, setCreatedFieldName] = useState("");

  // Fetch crops data
  useEffect(() => {
    async function getCrops() {
      try {
        const options = {
          url: `${baseUrl}/Crops`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios(options);
        setCropsData(data);
        children.setCropType(data); // External state
      } catch (error) {
        console.log(error);
      }
    }

    getCrops();
  }, []);

  const fieldSchema = object({
    FieldName: string()
      .required("Field Name is required")
      .min(3, "Field Name must be at least 3 characters")
      .max(100, "Field Name can't be longer than 100 characters"),

    FieldSize: number()
      .required("Field Size is required")
      .min(0.25, "The farm area must be at least 0.25 acres"),

    CropType: number().required("Crop Type is required"),
  });

  // Formik setup
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      FieldName: "",
      FieldSize: 0,
      CropType: 0,
    },
    validationSchema: fieldSchema,
    onSubmit: async (values) => {
      await createField(values);
    },
  });

  // Create field function
  async function createField(values) {
    setIsCreating(true);
    // Clear any previous form errors
    setFormError("");
    
    try {
      const options = {
        url: `${baseUrl}/farms/${children.farmId}/Fields`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          name: values.FieldName,
          area: values.FieldSize,
          cropType: cropIndex,
        },
      };
      let { data } = await axios(options);
      
      if (data) {
        // Store the created field name and show success screen
        setCreatedFieldName(values.FieldName);
        setIsFieldCreated(true);
        // Refresh fields list
        if (children.getFields) {
          children.getFields();
        }
        // Don't close the modal - show success screen instead
      }
    } catch (error) {
      console.error("Error creating field:", error);
      
      // Handle new error response format with errors array
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const firstError = error.response.data.errors[0];
        const errorCode = firstError?.code;
        
        switch (errorCode) {
          case "Field.DuplicateName":
            setFormError(`A field with the name "${values.FieldName}" already exists in this farm.`);
            break;
          case "Field.UnauthorizedAction":
            setFormError("You don't have permission to create fields in this farm. Please contact the farm owner.");
            break;
          case "Field.InvalidArea":
            setFormError("Field area exceeds the available space in the farm. Please reduce the field size.");
            break;
          case "Farm.NotFound":
            setFormError("Farm not found. Please refresh the page and try again.");
            break;
          case "Crop.NotFound":
            setFormError("Selected crop type is not available. Please choose a different crop.");
            break;
          default:
            setFormError(firstError?.description || "Failed to create field. Please try again.");
        }
      } 
      // Handle legacy error response format
      else if (error.response?.data?.error) {
        const errorCode = error.response.data.error;
        
        switch (errorCode) {
          case "Field.DuplicateName":
            setFormError(`A field with the name "${values.FieldName}" already exists in this farm.`);
            break;
          case "Field.UnauthorizedAction":
            setFormError("You don't have permission to create fields in this farm. Please contact the farm owner.");
            break;
          case "Field.InvalidArea":
            setFormError("Field area exceeds the available space in the farm. Please reduce the field size.");
            break;
          case "Farm.NotFound":
            setFormError("Farm not found. Please refresh the page and try again.");
            break;
          case "Crop.NotFound":
            setFormError("Selected crop type is not available. Please choose a different crop.");
            break;
          default:
            setFormError(error.response.data.message || "Failed to create field. Please try again.");
        }
      } else {
        setFormError("Failed to create field. Please check your connection and try again.");
      }
    } finally {
      setIsCreating(false);
    }
  }

  // Sync Formik values to external fieldData
  useEffect(() => {
    children.setFieldData({
      ...formik.values,
      CropType: cropIndex,
    });
  }, [formik.values, cropIndex]);

  return cropsData.length ? (
    <section
      className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-[blur(5)] absolute z-50 w-[100%]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          outClick();
        }
      }}
    >
      <div className={`w-[650px] ${formError ? 'h-[730px]' : 'h-[660px]'} border-2 rounded-2xl bg-white flex flex-col items-center transition-all duration-300 ease-in-out`}>
        <div className="w-[90%] mt-5 text-[22px] flex justify-end">
          <i
            className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300"
            onClick={outClick}
          ></i>
        </div>

        {/* Steps UI */}
        <div className="flex flex-col justify-center items-center mt-6 mb-3">
          <div className="capitalize mb-4 text-[20px] font-semibold text-mainColor">
            Add New Field
          </div>
          <div className="w-full rounded-xl flex gap-2 items-center">
            {[1, 2, 3, 4].map((step, i) => (
              <div className="flex items-center" key={i}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-[33px] h-[33px] text-[20px] text-white flex justify-center items-center rounded-full ${
                      step === 1 ? "bg-mainColor" : "bg-mainColor opacity-[0.3]"
                    }`}
                  >
                    <p>{step}</p>
                  </div>
                  <p className="mt-1">
                    {["Basic Info", "Irrigation", "Sensors", "Review"][i]}
                  </p>
                </div>
                {i !== 3 && (
                  <div className="w-[75px] h-[1.6px] rounded-full bg-mainColor opacity-[0.3] mx-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Conditional Content - Success Screen or Form */}
        {isFieldCreated ? (
          <div className="w-[85%] my-3 flex flex-col items-center justify-center text-center py-10">
            <div className="w-[70px] h-[70px] bg-[#1e693029] rounded-full flex justify-center items-center mb-6">
              <i className="fa-solid fa-check text-2xl text-mainColor"></i>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Field Created Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Field "{createdFieldName}" has been created and added to your farm.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsFieldCreated(false);
                setAddField(2); // Move to irrigation tab
              }}
              className="btn py-4 px-8 bg-mainColor text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium rounded-lg transition-all duration-200"
            >
              Continue to Irrigation <i className="fa-solid fa-arrow-right ms-2"></i>
            </button>
          </div>
        ) : (
          <form
            onSubmit={formik.handleSubmit}
            className="w-[85%] my-3 flex flex-col justify-between text-[17px]"
          >
          <div className="flex flex-col gap-3 my-3">
            {/* Form Error Message */}
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                <div className="flex items-center">
                  <i className="fa-solid fa-exclamation-triangle text-red-500 mr-2"></i>
                  <span>{formError}</span>
                </div>
              </div>
            )}
            
            <div>
              <div className="flex items-center gap-2 ms-1 mb-2">
                <label>Field Name</label>
                <div className="relative group">
                  <i className="fa-solid fa-info-circle text-gray-400 hover:text-gray-600 cursor-help text-sm"></i>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Field name must be 3-100 characters long
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
              <input
                type="text"
                name="FieldName"
                placeholder="Enter Field Name (3-100 characters)"
                className={`formControl mx-0 rounded-xl text-[15px] py-5 w-full ${
                  formik.touched.FieldName && formik.errors.FieldName
                    ? 'border-red-400 border-2 placeholder-red-400'
                    : 'border-[#0d121c21]'
                }`}
                value={formik.values.FieldName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 ms-1 mb-2">
                <label>Field Size (acres)</label>
                <div className="relative group">
                  <i className="fa-solid fa-info-circle text-gray-400 hover:text-gray-600 cursor-help text-sm"></i>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Field size must be at least 0.25 acres
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
              <input
                type="number"
                name="FieldSize"
                placeholder="Enter Field Size (min 0.25 acres)"
                step="0.01"
                min="0.25"
                className={`formControl mx-0 rounded-xl text-[15px] py-5 w-full ${
                  formik.touched.FieldSize && formik.errors.FieldSize
                    ? 'border-red-400 border-2'
                    : 'border-[#0d121c21]'
                }`}
                value={formik.values.FieldSize}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 ms-1 mb-2">
                <label>Crop Type</label>
                <div className="relative group">
                  <i className="fa-solid fa-info-circle text-gray-400 hover:text-gray-600 cursor-help text-sm"></i>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Please select a crop type from the dropdown
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
              <MenuElementCrop
                Items={cropsData}
                nameChange={cropsData[cropIndex]?.name || "Select Crop Type"}
                setIndex={setCropIndex}
                className="mt-[5px]"
                index={cropIndex}
                Pformat="text-[#0D121C] font-[400]"
              />
            </div>
          </div>

          {children.userRole === "owner" ? (
            <button
              type="submit"
              disabled={isCreating}
              className="btn self-end rounded-lg py-4 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium mt-[20px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin me-2"></i>
                  Creating...
                </>
              ) : (
                <>
                  Create Field <i className="fa-solid fa-check ms-3"></i>
                </>
              )}
            </button>
          ) : (
            <div className="self-end bg-gray-100 border border-gray-300 text-gray-500 px-6 py-4 rounded-lg text-[16px] font-medium mt-[20px]">
              <i className="fa-solid fa-lock me-2"></i>
              Only farm owners can create fields
            </div>
          )}
        </form>
        )}
      </div>
    </section>
  ) : null;
};

export default AddNewField;
