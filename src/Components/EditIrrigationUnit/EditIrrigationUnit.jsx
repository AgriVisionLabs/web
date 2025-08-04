import { X } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { AllContext } from "../../Context/All.context";
import { useFormik } from "formik";
import axios from "axios";
import toast from "react-hot-toast";
import { object, string } from "yup";
import { userContext } from "../../Context/User.context";
import { motion } from "framer-motion";
import MenuElement from "../MenuElement/MenuElement";

const EditIrrigationUnit = ({ irrigationUnit, onClose, onUpdate, fields }) => {
  let { baseUrl } = useContext(AllContext);
  let { token } = useContext(userContext);
  
  const validationSchema = object({
    name: string()
      .required("Irrigation Unit Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name cannot exceed 100 characters"),
    status: string()
      .required("Status is required"),
    newFieldId: string()
      .required("Field is required"),
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [formError, setFormError] = useState("");
  const [statusIndex, setStatusIndex] = useState(irrigationUnit.status || 0);
  const [fieldIndex, setFieldIndex] = useState(0);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [fieldMenuOpen, setFieldMenuOpen] = useState(false);

  async function updateIrrigationUnit(values) {
    setIsUpdating(true);
    setFormError("");
    
    try {
      const requestBody = {
        name: values.name,
        status: parseInt(values.status),
        newFieldId: values.newFieldId,
      };
      
      const options = {
        url: `${baseUrl}/farms/${irrigationUnit.farmId}/fields/${irrigationUnit.fieldId}/irrigationUnits`,
        method: "PUT",
        data: requestBody,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      console.log("updateIrrigationUnit", data);
      toast.success("Irrigation Unit updated successfully!");
      if (onUpdate) {
        onUpdate();
      }
      onClose();
    } catch (error) {
      console.error("Error updating irrigation unit:", error);
      
      if (error.response) {
        const { status, data } = error.response;
        const errorCode = data.title || data.error || data.message;
        
        // Handle specific error codes
        switch (errorCode) {
          case "IrrigationUnit.NoUnitAssigned":
            setFormError("No irrigation unit is assigned to this field.");
            break;
          case "IrrigationUnit.DeviceOffline":
            setFormError("The irrigation device is currently offline. Please check the device connection.");
            break;
          case "IrrigationUnit.FailedToSendCommand":
            setFormError("Failed to send command to the irrigation device. Please try again later.");
            break;
          case "IrrigationDeviceUnit.NotFound":
            setFormError("The irrigation device unit was not found. Please check the device.");
            break;
          case "IrrigationUnit.DeviceUnreachable":
            setFormError("The irrigation device is unreachable. Please check the device connection and try again.");
            break;
          case "Field.AlreadyHasIrrigationUnit":
            setFormError("The selected field already has an irrigation unit assigned. Please select a different field.");
            break;
          case "IrrigationUnit.DuplicateNameInFarm":
            setFormError("An irrigation unit with this name already exists in the farm. Please choose a different name.");
            break;
          case "IrrigationDeviceUnit.AlreadyAssigned":
            setFormError("This irrigation device is already assigned to another unit. Please use a different device.");
            break;
          default:
            // Handle by status code if no specific error code matches
            switch (status) {
              case 400:
                setFormError(data.title || "Please check your input and try again.");
                break;
              case 404:
                setFormError("The irrigation unit or device was not found.");
                break;
              case 409:
                setFormError("There is a conflict with the current data. Please check your inputs.");
                break;
              case 503:
                setFormError("The irrigation service is temporarily unavailable. Please try again later.");
                break;
              default:
                setFormError("Failed to update irrigation unit. Please try again.");
            }
        }
      } else {
        setFormError("Network error. Please check your connection and try again.");
      }
      toast.error("Failed to update irrigation unit");
    } finally {
      setIsUpdating(false);
    }
  }

  const statusOptions = ["Active", "Idle", "Maintenance"];
  const fieldNames = fields ? fields.map(field => field.name) : [];
  
  // Initialize field index based on current field
  const initializeFieldIndex = () => {
    if (fields && irrigationUnit.fieldId) {
      const index = fields.findIndex(field => field.id === irrigationUnit.fieldId);
      return index >= 0 ? index : 0;
    }
    return 0;
  };

  const formik = useFormik({
    initialValues: {
      name: irrigationUnit.name || "",
      status: irrigationUnit.status?.toString() || "0",
      newFieldId: irrigationUnit.fieldId || "",
    },
    validationSchema,
    onSubmit: updateIrrigationUnit,
  });

  // Initialize field index when fields are loaded
  useEffect(() => {
    const initialFieldIndex = initializeFieldIndex();
    setFieldIndex(initialFieldIndex);
  }, [fields, irrigationUnit.fieldId]);

  // Update formik values when menu selections change
  useEffect(() => {
    formik.setFieldValue('status', statusIndex.toString());
    formik.setFieldTouched('status', true);
  }, [statusIndex]);

  useEffect(() => {
    if (fields && fields[fieldIndex]) {
      formik.setFieldValue('newFieldId', fields[fieldIndex].id);
      formik.setFieldTouched('newFieldId', true);
    }
  }, [fieldIndex, fields]);

  return (
    <section
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-sm z-50 p-4 sm:p-6"
      onClick={(e) => {
        if (e.target == e.currentTarget) {
          onClose();
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
                Edit Irrigation Unit
              </h1>
              <p className="text-sm sm:text-base text-[#616161] font-medium mt-1">
                Update irrigation unit information
              </p>
            </div>
            <button
              onClick={onClose}
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

            {/* Status */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm sm:text-base font-medium">Status</label>
              </div>
              <div className={`${
                formik.touched.status && formik.errors.status
                  ? 'border-red-500 border-2 rounded-lg'
                  : ''
              }`}>
                <MenuElement
                  Items={statusOptions}
                  nameChange={statusOptions[statusIndex]}
                  setIndex={setStatusIndex}
                  onList={statusMenuOpen}
                  width="100%"
                  className="py-[12px]"
                  setOnList={setStatusMenuOpen}
                  Pformat="text-[#0D121C] font-[400]"
                />
              </div>
              {formik.touched.status && formik.errors.status && (
                <div className="text-red-500 text-sm mt-1">
                  <i className="fa-solid fa-exclamation-circle mr-1"></i>
                  {formik.errors.status}
                </div>
              )}
            </div>

            {/* Field */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm sm:text-base font-medium">Field</label>
              </div>
              <div className={`${
                formik.touched.newFieldId && formik.errors.newFieldId
                  ? 'border-red-500 border-2 rounded-lg'
                  : ''
              }`}>
                <MenuElement
                  Items={fieldNames}
                  nameChange={fieldNames[fieldIndex] || "Select a field"}
                  setIndex={setFieldIndex}
                  onList={fieldMenuOpen}
                  width="100%"
                  className="py-[12px]"
                  setOnList={setFieldMenuOpen}
                  Pformat="text-[#0D121C] font-[400]"
                />
              </div>
              {formik.touched.newFieldId && formik.errors.newFieldId && (
                <div className="text-red-500 text-sm mt-1">
                  <i className="fa-solid fa-exclamation-circle mr-1"></i>
                  {formik.errors.newFieldId}
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
              disabled={isUpdating}
              className="flex-1 sm:flex-none py-3 px-6 sm:px-8 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-gray-50 hover:border-mainColor hover:text-mainColor transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 sm:flex-none py-3 px-6 sm:px-8 border border-transparent rounded-lg bg-mainColor text-sm sm:text-base text-white hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={formik.handleSubmit}
            >
              <div className="flex justify-center items-center space-x-2">
                {isUpdating ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check"></i>
                    <span>Update</span>
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

export default EditIrrigationUnit; 