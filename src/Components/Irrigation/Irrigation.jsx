// import { useRef, useState } from "react";
// import { useContext } from "react";
// import { AllContext } from "../../Context/All.context";
// import { QrCode, X } from "lucide-react";

// const Irrigation = (children) => {
//   const { outClick, setAddField } = useContext(AllContext);
//   const Name = useRef(null);
//   const serialNumber = useRef(null);
//   let [irrigationList] = useState([]);

//   function addIrrigationData() {
//     irrigationList.push({
//       Name: Name.current.value,
//       SerialNumber: SerialNumber.current.value,
//     });
//     children.setFieldData((prev) => ({
//       ...prev,
//       IrrigationUnit: irrigationList,
//     }));
//     Name.current.value = "";
//     SerialNumber.current.value = "";
//     console.log("irrigationList", children.FieldData);
//   }

//   return (
//     <section
//       className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70  font-manrope backdrop-blur-[blur(5)] absolute z-50 w-[100%]"
//       onClick={(e) => {
//         if (e.target === e.currentTarget) {
//           outClick();
//         }
//       }}
//     >
//       <div className=" w-[600px] h-[660px]   border-2 rounded-2xl bg-white flex  flex-col items-center relative">
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
//           <div className="w-[100%] rounded-xl flex gap-2  items-center">
//             <div className=" flex flex-col items-center ">
//               <div className="w-[33px] h-[33px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full">
//                 <p className="">1</p>
//               </div>
//               <p className="mt-2">Basic Info</p>
//             </div>
//             <div className="w-[75px] h-[1.6px] rounded-full bg-mainColor "></div>
//             <div className=" flex flex-col items-center ">
//               <div className="w-[33px] h-[33px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full ">
//                 <p className="">2</p>
//               </div>
//               <p className="mt-2">Irrigation</p>
//             </div>
//             <div className="w-[75px] h-[1.6px] rounded-full bg-mainColor opacity-[0.3]"></div>
//             <div className=" flex flex-col items-center ">
//               <div className="w-[33px] h-[33px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full opacity-[0.3]">
//                 <p className="">3</p>
//               </div>

//               <p className="mt-2">Sensors</p>
//             </div>
//             <div className="w-[75px] h-[1.6px] rounded-full bg-mainColor opacity-[0.3]"></div>
//             <div className=" flex flex-col items-center ">
//               <div className="w-[33px] h-[33px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full opacity-[0.3]">
//                 <p className="">4</p>
//               </div>

//               <p className="mt-2">Review</p>
//             </div>
//           </div>
//         </div>
//         <form
//           action=""
//           className="w-[85%] my-5 flex flex-col justify-between  text-[18px] flex-grow"
//         >
//           <div className="flex flex-col gap-3 my-5">
//             <div className="">
//               <label htmlFor="" className="ms-1">
//                 Irrigation Unit Name
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter Irrigation unit name "
//                 ref={Name}
//                 className="formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-[#0d121c21] "
//               />
//             </div>

//             <div className="">
//               <label htmlFor="" className="ms-1">
//                 Serial Number
//               </label>
//               <div className="flex justify-center items-center gap-3">
//                 <input
//                   type="text"
//                   placeholder="Enter Serial Number"
//                   ref={SerialNumber}
//                   className="formControl mx-0 rounded-xl text-[16px] py-5  border-[#0d121c21] "
//                 />
//                 <div className="flex justify-center items-center mx-0 rounded-xl text-[16px] p-2 w-20  border-2 border-[#0d121c21]">
//                   <QrCode strokeWidth={1.2} size={25} />
//                 </div>
//               </div>
//             </div>
//             <button
//               type="button"
//               className="btn2 rounded-xl w-[100%]  py-5 bg-mainColor text-[16px] text-white hover:bg-[#616161]  font-medium "
//               onClick={() => {
//                 addIrrigationData();
//               }}
//             >
//               <i className="fa-solid fa-plus me-2"></i>Add Sensor
//             </button>
//           </div>

//           <div className=" flex flex-col gap-1  h-[80px] overflow-y-scroll">
//             {children.FieldData.IrrigationUnit?.map((item, index) => {
//               return (
//                 <div className=" flex-grow " key={`${item.name}-${index}`}>
//                   <div className="bg-[#1e693021] rounded-lg py-3 px-5 my-1 flex justify-between items-center">
//                     <div className="flex flex-col  ">
//                       <p className="capitalize text-[15px] py-1">{item.Name}</p>
//                       <p className="text-[13px] text-[#757575]">
//                         {item.SerialNumber}
//                       </p>
//                     </div>
//                     <X
//                       className="fa-solid fa-x text-[#9F9F9F] hover:text-red-600 transition-colors duration-300 "
//                       onClick={() => {
//                         irrigationList = irrigationList.filter(
//                           (_, i) => i !== index
//                         );
//                         children.setFieldData((prev) => ({
//                           ...prev,
//                           IrrigationUnit:
//                             children.FieldData.IrrigationUnit.filter(
//                               (_, i) => i !== index
//                             ),
//                         }));
//                       }}
//                     />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//           <div className="flex justify-between items-center mt-[10px]">
//             <i
//               className="fa-solid fa-angle-left hover:text-mainColor  transition-all duration-300  cursor-pointer text-[22px]"
//               onClick={() => {
//                 setAddField(1);
//               }}
//             ></i>
//             <button
//               type="button"
//               className="w-full rounded-xl py-2 mb-2 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium "
//               onClick={() => {
//                 setAddField(3);
//               }}
//             >
//               Next <i className="fa-solid fa-angle-right ms-3"></i>
//             </button>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// };
// export default Irrigation;

import { useContext, useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AllContext } from "../../Context/All.context";
import { userContext } from "../../Context/User.context";
import { QrCode, X, Upload } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Irrigation = (children) => {
  const { outClick, setAddField, baseUrl } = useContext(AllContext);
  const { token } = useContext(userContext);
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const [showQrUpload, setShowQrUpload] = useState(false);
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [deletingUnitId, setDeletingUnitId] = useState(null);

  const irrigationSchema = Yup.object({
    name: Yup.string()
      .required("Irrigation Unit Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name can't be longer than 100 characters"),
    serialNumber: Yup.string()
      .required("Serial Number is required")
      .min(10, "Serial Number must be at least 10 characters")
      .max(25, "Serial Number can't be longer than 25 characters"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      serialNumber: "",
    },
    validationSchema: irrigationSchema,
    onSubmit: async (values, { resetForm }) => {
      await createIrrigationUnit(values, resetForm);
    },
  });

  // Create irrigation unit function
  async function createIrrigationUnit(values, resetForm) {
    setIsCreating(true);
    setFormError("");

    // Validate required parameters
    if (!children.farmId || !children.fieldId) {
      setFormError("Field information is missing. Please try creating the field again.");
      setIsCreating(false);
      return;
    }

    try {
      const options = {
        url: `${baseUrl}/farms/${children.farmId}/fields/${children.fieldId}/irrigationunits`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          serialNumber: values.serialNumber,
          Name: values.name,
        },
      };

      let { data } = await axios(options);

      if (data) {
        toast.success(`Irrigation unit "${values.name}" added successfully!`);

        // Update local state with the new unit
        children.setFieldData((prev) => ({
          ...prev,
          IrrigationUnit: [
            ...(prev.IrrigationUnit || []),
            {
              name: values.name,
              serialNumber: values.serialNumber,
              id: data.id,
            },
          ],
        }));

        resetForm();
      }
    } catch (error) {
      console.error("Error creating irrigation unit:", error);

      // Handle new error response format with errors array
      if (
        error.response?.data?.errors &&
        Array.isArray(error.response.data.errors)
      ) {
        const firstError = error.response.data.errors[0];
        const errorCode = firstError?.code;

        switch (errorCode) {
          case "Field.AlreadyHasIrrigationUnit":
            setFormError(
              "This field already has an irrigation unit. Only one irrigation unit per field is allowed."
            );
            break;
          case "IrrigationUnit.DuplicateNameInFarm":
            setFormError(
              `An irrigation unit with the name "${values.name}" already exists in this farm.`
            );
            break;
          case "IrrigationDeviceUnit.AlreadyAssigned":
            setFormError(
              "This device is already assigned to another field. Please use a different serial number."
            );
            break;
          case "IrrigationDeviceUnit.NotFound":
            setFormError(
              "Device with this serial number was not found. Please check the serial number and try again."
            );
            break;
          case "Field.UnauthorizedAction":
            setFormError(
              "You don't have permission to add irrigation units to this field. Please contact the farm owner."
            );
            break;
          case "Farm.UnauthorizedAction":
            setFormError(
              "You don't have permission to access this farm. Please contact the farm owner."
            );
            break;
          case "FarmUserRole.InsufficientPermissions":
            setFormError(
              "Only farm owners and managers can add irrigation units. Please contact a farm owner or manager."
            );
            break;
          case "Field.FieldNotFound":
            setFormError(
              "Field not found. Please refresh the page and try again."
            );
            break;
          default:
            setFormError(
              error.response.data.message ||
                "Failed to add irrigation unit. Please try again."
            );
        }
      } else {
        setFormError(
          "Failed to add irrigation unit. Please check your connection and try again."
        );
      }
    } finally {
      setIsCreating(false);
    }
  }

  // Delete irrigation unit function
  async function deleteIrrigationUnit(irrigationUnit, index) {
    // Validate required parameters
    if (!children.farmId || !children.fieldId) {
      toast.error("Field information is missing. Cannot delete irrigation unit.");
      return;
    }

    setDeletingUnitId(irrigationUnit.id || 'local');
    
    try {
      // Only make API call if the unit has been saved to server
      if (irrigationUnit.id) {
        const options = {
          url: `${baseUrl}/farms/${children.farmId}/fields/${children.fieldId}/IrrigationUnits`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        await axios(options);
      }
      
      // Remove from local state after successful deletion (or if local-only)
      children.setFieldData((prev) => ({
        ...prev,
        IrrigationUnit: [],
      }));
      
      toast.success(`Irrigation unit "${irrigationUnit.name || irrigationUnit.Name}" deleted successfully!`);
      
    } catch (error) {
      console.error("Error deleting irrigation unit:", error);
      
      // Handle error response
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const firstError = error.response.data.errors[0];
        const errorCode = firstError?.code;
        
        switch (errorCode) {
          case "IrrigationUnit.NotFound":
            toast.error("Irrigation unit not found. It may have already been deleted.");
            // Remove from local state since it doesn't exist on server
            children.setFieldData((prev) => ({
              ...prev,
              IrrigationUnit: [],
            }));
            break;
          case "Field.UnauthorizedAction":
            toast.error("You don't have permission to delete irrigation units from this field.");
            break;
          case "Farm.UnauthorizedAction":
            toast.error("You don't have permission to access this farm.");
            break;
          case "FarmUserRole.InsufficientPermissions":
            toast.error("Only farm owners and managers can delete irrigation units.");
            break;
          default:
            toast.error(firstError?.description || "Failed to delete irrigation unit. Please try again.");
        }
      } else {
        toast.error("Failed to delete irrigation unit. Please check your connection and try again.");
      }
    } finally {
      setDeletingUnitId(null);
    }
  }

  // QR Code upload handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleQrFile(e.dataTransfer.files[0]);
    }
  };

  const handleQrFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      // Here you would typically process the QR code image
      // For now, we'll just show a success message
      toast.success("QR code image uploaded! Processing...");
      setShowQrUpload(false);
      // You can add QR code processing logic here
    } else {
      toast.error("Please upload a valid image file.");
    }
  };

  return (
    <section
      className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-[blur(5)] absolute z-50 w-[100%]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          outClick();
        }
      }}
    >
      <div className="w-[600px] h-fit border-2 rounded-2xl bg-white flex flex-col items-center">
        <div className="w-[90%] mt-3 text-[22px] flex justify-end">
          <i
            className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300"
            onClick={outClick}
          ></i>
        </div>

        <div className="flex flex-col justify-center items-center mt-3 mb-3">
          <div className="capitalize mb-5 text-[20px] font-semibold text-mainColor">
            add new field
          </div>
          <div className="w-[100%] rounded-xl flex gap-2 items-center">
            {["Basic Info", "Irrigation", "Sensors", "Review"].map(
              (step, i) => (
                <div className="flex items-center" key={i}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-[33px] h-[33px] text-[20px] text-white flex justify-center items-center rounded-full ${
                        i <= 1 ? "bg-mainColor" : "bg-mainColor opacity-[0.3]"
                      }`}
                    >
                      <p>{i + 1}</p>
                    </div>
                    <p className="mt-2">{step}</p>
                  </div>
                  {i < 3 && (
                    <div className="w-[75px] h-[1.6px] rounded-full bg-mainColor opacity-[0.3] mx-1"></div>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="w-[85%] my-3 flex flex-col justify-between text-[18px] flex-grow"
        >
          <div className="flex flex-col gap-3 my-3">
            {/* Field ID Missing Warning */}
            {(!children.farmId || !children.fieldId) && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4">
                <div className="flex items-center">
                  <i className="fa-solid fa-exclamation-triangle text-yellow-500 mr-2"></i>
                  <p className="text-sm">
                    Please create a field in the Basic Info tab first before adding irrigation units.
                  </p>
                </div>
              </div>
            )}
            
            {/* Single Irrigation Unit Info */}
            {children.farmId && children.fieldId && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4">
                <div className="flex items-center">
                  <i className="fa-solid fa-info-circle text-blue-500 mr-2"></i>
                  <p className="text-sm">
                    <strong>Note:</strong> Each field can only have one irrigation unit. {children.FieldData.IrrigationUnit?.length > 0 ? "Delete the existing unit to add a new one." : "Add your irrigation unit below."}
                  </p>
                </div>
              </div>
            )}
            
            {/* Form Error Display */}
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                <p className="text-sm">{formError}</p>
              </div>
            )}

            {/* Irrigation Unit Name */}
            <div>
              <div className="flex items-center gap-1 ">
                <label className="ms-1 text-[16px] font-medium">
                  Irrigation Unit Name *
                </label>
                <div className="group relative">
                  <i className="fa-solid fa-info-circle text-gray-400 hover:text-mainColor cursor-help text-sm"></i>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    <div className="text-center">
                      <div>Required: 3-100 characters</div>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
              <input
                type="text"
                name="name"
                placeholder="Enter irrigation unit name (3-100 characters)"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-2 ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-300 focus:border-red-500"
                    : "border-[#0d121c21] focus:border-mainColor"
                } focus:outline-none focus:ring-0 transition-colors duration-200`}
              />
            </div>

            {/* Serial Number */}
            <div>
              <div className="flex items-center gap-2">
                <label className="ms-1 text-[16px] font-medium">
                  Serial Number *
                </label>
                <div className="group relative">
                  <i className="fa-solid fa-info-circle text-gray-400 hover:text-mainColor cursor-help text-sm"></i>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    <div className="text-center">
                      <div>Required: 10-25 characters</div>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-3">
                <input
                  type="text"
                  name="serialNumber"
                  placeholder="Enter serial number (10-25 characters)"
                  value={formik.values.serialNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`formControl mx-0 rounded-xl text-[16px] py-5 flex-1 border-2 ${
                    formik.touched.serialNumber && formik.errors.serialNumber
                      ? "border-red-300 focus:border-red-500"
                      : "border-[#0d121c21] focus:border-mainColor"
                  } focus:outline-none focus:ring-0 transition-colors duration-200`}
                />
                <div
                  className="flex justify-center items-center mx-0 rounded-xl text-[16px] p-2 w-20 border-2 border-[#0d121c21] cursor-pointer hover:border-mainColor hover:bg-mainColor hover:text-white transition-all duration-200"
                  onClick={() => setShowQrUpload(true)}
                >
                  <QrCode strokeWidth={1.2} size={25} />
                </div>
              </div>
            </div>

            {/* Add Button */}
            <button
              type="submit"
              disabled={isCreating || !children.farmId || !children.fieldId || children.FieldData.IrrigationUnit?.length > 0}
              className={`btn2 rounded-xl w-full py-5 text-[16px] font-medium transition-all duration-200 ${
                isCreating || !children.farmId || !children.fieldId || children.FieldData.IrrigationUnit?.length > 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-mainColor hover:bg-[#1e5f30] text-white"
              }`}
            >
              {isCreating ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin me-2"></i>
                  Adding...
                </>
              ) : !children.farmId || !children.fieldId ? (
                <>
                  <i className="fa-solid fa-exclamation-triangle me-2"></i>
                  Field Not Ready
                </>
              ) : children.FieldData.IrrigationUnit?.length > 0 ? (
                <>
                  <i className="fa-solid fa-check me-2"></i>
                  Field Has Irrigation Unit
                </>
              ) : (
                <>
                  <i className="fa-solid fa-plus me-2"></i>
                  Add Irrigation Unit
                </>
              )}
            </button>
          </div>

          {/* Irrigation Units List */}
          <div className="flex flex-col gap-1 h-[100px] overflow-y-auto mb-1">
            {children.FieldData.IrrigationUnit?.length > 0
              ? children.FieldData.IrrigationUnit.map((item, index) => (
                  <div
                    key={`${item.name || item.Name}-${index}`}
                    className="flex-grow"
                  >
                    <div className="bg-[#1e693021] rounded-lg py-3 px-5 my-1 flex justify-between items-center">
                      <div className="flex flex-col">
                        <p className="capitalize text-[15px] py-1">
                          {item.name || item.Name}
                        </p>
                        <p className="text-[13px] text-[#757575]">
                          {item.serialNumber || item.SerialNumber}
                        </p>
                      </div>
                      {deletingUnitId === (item.id || 'local') ? (
                        <i className="fa-solid fa-spinner fa-spin text-gray-400"></i>
                      ) : (
                        <X
                          className="text-[#9F9F9F] hover:text-red-600 transition-colors duration-300 cursor-pointer"
                          onClick={() => deleteIrrigationUnit(item, index)}
                        />
                      )}
                    </div>
                  </div>
                ))
              : null}
          </div>

          {/* Navigation Button - Inside form to fit within popup */}
          <button
            type="button"
            className="btn self-end rounded-lg py-3 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium mt-4 mb-4"
            onClick={() => {
              setAddField(3);
            }}
          >
            {children.FieldData.IrrigationUnit?.length > 0 ? (
              <>
                Next <i className="fa-solid fa-angle-right ms-3"></i>
              </>
            ) : (
              <>
                Skip <i className="fa-solid fa-angle-right ms-3"></i>
              </>
            )}
          </button>
        </form>
      </div>

      {/* QR Upload Modal */}
      {showQrUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 w-[400px] max-w-[90vw]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-mainColor">
                Upload QR Code
              </h3>
              <X
                className="cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setShowQrUpload(false)}
              />
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                dragActive
                  ? "border-mainColor bg-green-50"
                  : "border-gray-300 hover:border-mainColor"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 mb-2">
                Drag and drop a QR code image here
              </p>
              <p className="text-gray-400 text-sm mb-4">or</p>
              <button
                type="button"
                className="bg-mainColor text-white px-4 py-2 rounded-lg hover:bg-[#1e5f30] transition-colors duration-200"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleQrFile(e.target.files[0]);
                  }
                }}
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Supported formats: JPG, PNG, GIF
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Irrigation;
