import { X } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { AllContext } from "../../Context/All.context";
import { useFormik } from "formik";
import axios from "axios";
import toast from "react-hot-toast";
import { object, string } from "yup";
import { userContext } from "../../Context/User.context";
import QRFromImage from "../QRFromImage/QRFromImage";
import { motion } from "framer-motion";

const AddIrrigationStep2IrrigationPage = (Children) => {
  let { setControlIrrigationPage, baseUrl } = useContext(AllContext);
  // let {setAddNewIrrigationUnit}=useContext(AllContext);
  const [result, setResult] = useState("");
  let { token } = useContext(userContext);
  
  const validationSchema = object({
    serialNumber: string()
      .required("Serial Number is required")
      .min(10, "Serial Number must be at least 10 characters")
      .max(25, "Serial Number cannot exceed 25 characters"),
    name: string()
      .required("Irrigation Unit Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name cannot exceed 100 characters"),
  });

  console.log("farm id", Children.farmId);
  console.log("field id", Children.field.id);
  console.log(token);

  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState("");

  async function sendIrrigationUnit(values) {
    setIsCreating(true);
    setFormError("");
    
    try {
      const options = {
        url: `${baseUrl}/farms/${Children.farmId}/fields/${Children.field.id}/IrrigationUnits`,
        method: "POST",
        data: values,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      console.log("sendIrrigationUnit", data);
      toast.success("Irrigation Unit added successfully!");
      if (Children.getIrrigationUnits) {
        Children.getIrrigationUnits();
      }
      setControlIrrigationPage(null);
    } catch (error) {
      console.error("Error adding irrigation unit:", error);
      
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 400:
            setFormError(data.title || "Please check your input and try again.");
            break;
          case 409:
            setFormError("An irrigation unit with this serial number already exists.");
            break;
          default:
            setFormError("Failed to add irrigation unit. Please try again.");
        }
      } else {
        setFormError("Network error. Please check your connection and try again.");
      }
      toast.error("Failed to add irrigation unit");
    } finally {
      setIsCreating(false);
    }
  }
  const formik = useFormik({
    initialValues: {
      serialNumber: "",
      name: "",
    },
    validationSchema,
    onSubmit: sendIrrigationUnit,
  });

  // Update formik values when QR result changes
  useEffect(() => {
    if (result && result !== formik.values.serialNumber) {
      formik.setFieldValue('serialNumber', result);
    }
  }, [result, formik]);
  return (
    <section
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-sm z-50 p-4 sm:p-6"
      onClick={(e) => {
        if (e.target == e.currentTarget) {
          setControlIrrigationPage(null);
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
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg sm:rounded-2xl border-2 font-manrope"
      >
        {/* Header - Sticky */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-lg sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-mainColor capitalize">
                Add New Irrigation Unit
              </h1>
              <p className="text-sm sm:text-base text-[#616161] font-medium mt-1">
                Add a new irrigation unit to a field
              </p>
            </div>
            <button
              onClick={() => setControlIrrigationPage(null)}
              className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2"
            >
              <X size={24} className="text-gray-600 hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-6">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Form Error Message */}
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  <i className="fa-solid fa-exclamation-triangle text-red-500 mr-2"></i>
                  <span className="text-sm">{formError}</span>
                </div>
              </div>
            )}

            {/* Irrigation Unit Name */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm sm:text-base font-medium">Irrigation Unit Name</label>
                <div className="relative group">
                  <i className="fa-solid fa-info-circle text-gray-400 hover:text-gray-600 cursor-help text-sm"></i>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Unit name must be 3-100 characters long
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
              <input
                type="text"
                name="name"
                placeholder="Enter Irrigation Unit Name (3-100 characters)"
                className={`w-full px-4 py-3 sm:py-4 border rounded-lg text-sm sm:text-base transition-colors duration-200 ${
                  formik.touched.name && formik.errors.name
                    ? 'border-red-500 text-red-500 border-2 placeholder-red-400'
                    : 'border-gray-300 focus:border-mainColor focus:outline-none'
                }`}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-sm mt-1">
                  <i className="fa-solid fa-exclamation-circle mr-1"></i>
                  {formik.errors.name}
                </div>
              )}
            </div>

            {/* Serial Number */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm sm:text-base font-medium">Serial Number</label>
                <div className="relative group">
                  <i className="fa-solid fa-info-circle text-gray-400 hover:text-gray-600 cursor-help text-sm"></i>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Serial number must be 10-25 characters long
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  name="serialNumber"
                  placeholder="Enter Serial Number (10-25 characters)"
                  className={`flex-1 px-4 py-3 sm:py-4 border rounded-lg text-sm sm:text-base transition-colors duration-200 ${
                    formik.touched.serialNumber && formik.errors.serialNumber
                      ? 'border-red-500 text-red-500 border-2 placeholder-red-400'
                      : 'border-gray-300 focus:border-mainColor focus:outline-none'
                  }`}
                  value={formik.values.serialNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <div className="flex justify-center items-center px-3 py-2 border border-gray-300 rounded-lg w-full sm:w-auto sm:min-w-[80px]">
                  <QRFromImage setResult={setResult} />
                </div>
              </div>
              {formik.touched.serialNumber && formik.errors.serialNumber && (
                <div className="text-red-500 text-sm mt-1">
                  <i className="fa-solid fa-exclamation-circle mr-1"></i>
                  {formik.errors.serialNumber}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer - Sticky */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4 rounded-b-lg sm:rounded-b-2xl">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              disabled={isCreating}
              className="flex-1 sm:flex-none py-3 px-6 sm:px-8 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-gray-50 hover:border-mainColor hover:text-mainColor transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                setControlIrrigationPage("Step1Irrigation");
              }}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="flex-1 sm:flex-none py-3 px-6 sm:px-8 border border-transparent rounded-lg bg-mainColor text-sm sm:text-base text-white hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={formik.handleSubmit}
            >
              <div className="flex justify-center items-center space-x-2">
                {isCreating ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check"></i>
                    <span>Save</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AddIrrigationStep2IrrigationPage;
