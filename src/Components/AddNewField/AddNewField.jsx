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
  const [createdFieldId, setCreatedFieldId] = useState(null);

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
        // Store the created field name and ID, then show success screen
        setCreatedFieldName(values.FieldName);
        setCreatedFieldId(data.id);
        setIsFieldCreated(true);
        // Pass the field ID to parent component
        if (children.setCreatedFieldId) {
          children.setCreatedFieldId(data.id);
        }
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
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-md z-50 p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          outClick();
        }
      }}
    >
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-lg sm:rounded-2xl border-2 font-manrope">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-lg sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-semibold text-mainColor">Add New Field</h1>
            <button
              onClick={outClick}
              className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <i className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors text-lg sm:text-xl"></i>
            </button>
          </div>

          {/* Steps UI - Mobile responsive */}
          <div className="mt-4">
            <div className="flex flex-wrap justify-center sm:justify-between items-center gap-2 sm:gap-1">
              {[1, 2, 3, 4].map((step, i) => (
                <div className="flex items-center" key={i}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 text-sm sm:text-base text-white flex justify-center items-center rounded-full ${
                        step === 1 ? "bg-mainColor" : "bg-mainColor opacity-30"
                      }`}
                    >
                      <p>{step}</p>
                    </div>
                    <p className="mt-1 text-xs sm:text-sm text-center">
                      {["Basic Info", "Irrigation", "Sensors", "Review"][i]}
                    </p>
                  </div>
                  {i !== 3 && (
                    <div className="w-8 sm:w-16 h-0.5 rounded-full bg-mainColor opacity-30 mx-1 sm:mx-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Conditional Content - Success Screen or Form */}
          {isFieldCreated ? (
            <div className="flex flex-col items-center justify-center text-center py-8 sm:py-10">
              <div className="w-16 h-16 sm:w-[70px] sm:h-[70px] bg-[#1e693029] rounded-full flex justify-center items-center mb-4 sm:mb-6">
                <i className="fa-solid fa-check text-xl sm:text-2xl text-mainColor"></i>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                Field Created Successfully!
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Field "{createdFieldName}" has been created and added to your farm.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsFieldCreated(false);
                  setAddField(2); // Move to irrigation tab
                }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-mainColor text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium rounded-[45px] transition-all duration-200"
              >
                Continue to Irrigation 
                <i className="fa-solid fa-arrow-right ms-2"></i>
              </button>
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Form Error Message */}
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <i className="fa-solid fa-exclamation-triangle text-red-500 mt-0.5 flex-shrink-0"></i>
                    <span className="text-sm">{formError}</span>
                  </div>
                </div>
              )}
              
              {/* Field Name */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-base sm:text-lg font-semibold text-[#0D121C]">Field Name</label>
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
                  className={`w-full border-2 rounded-[45px] px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-mainColor ${
                    formik.touched.FieldName && formik.errors.FieldName
                      ? 'border-red-400 placeholder-red-400'
                      : 'border-[#0d121c21]'
                  }`}
                  value={formik.values.FieldName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.FieldName && formik.errors.FieldName && (
                  <p className="text-red-500 text-sm">{formik.errors.FieldName}</p>
                )}
              </div>

              {/* Field Size */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-base sm:text-lg font-semibold text-[#0D121C]">Field Size (acres)</label>
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
                  className={`w-full border-2 rounded-[45px] px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-mainColor ${
                    formik.touched.FieldSize && formik.errors.FieldSize
                      ? 'border-red-400'
                      : 'border-[#0d121c21]'
                  }`}
                  value={formik.values.FieldSize}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.FieldSize && formik.errors.FieldSize && (
                  <p className="text-red-500 text-sm">{formik.errors.FieldSize}</p>
                )}
              </div>

              {/* Crop Type */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-base sm:text-lg font-semibold text-[#0D121C]">Crop Type</label>
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
                  className="mt-1"
                  index={cropIndex}
                  Pformat="text-[#0D121C] font-[400] text-sm sm:text-base"
                  width="100%"
                />
                {formik.touched.CropType && formik.errors.CropType && (
                  <p className="text-red-500 text-sm">{formik.errors.CropType}</p>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Footer - Only show for form, not success screen */}
        {!isFieldCreated && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4 rounded-b-lg sm:rounded-b-2xl">
            {children.userRole === "owner" ? (
              <button
                type="submit"
                disabled={isCreating}
                onClick={formik.handleSubmit}
                className="w-full sm:w-auto sm:ml-auto flex justify-center items-center px-6 py-3 bg-mainColor text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium rounded-[45px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin me-2"></i>
                    Creating...
                  </>
                ) : (
                  <>
                    Create Field 
                    <i className="fa-solid fa-check ms-2"></i>
                  </>
                )}
              </button>
            ) : (
              <div className="w-full sm:w-auto sm:ml-auto flex justify-center items-center bg-gray-100 border border-gray-300 text-gray-500 px-6 py-3 rounded-[45px] font-medium">
                <i className="fa-solid fa-lock me-2"></i>
                Only farm owners can create fields
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  ) : null;
};

export default AddNewField;
