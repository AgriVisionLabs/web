import { useContext, useEffect, useState } from "react";
import { AllContext } from "../../Context/All.context";
import { userContext } from "../../Context/User.context";
import MenuElementCrop from "../MenuElement/MenuElementCrop";
import { useFormik } from "formik";
import axios from "axios";
import { string, number, object } from "yup";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const EditField = ({ field, farmId, onClose, onSave }) => {
  const { baseUrl } = useContext(AllContext);
  const { token } = useContext(userContext);
  const [cropsData, setCropsData] = useState([]);
  const [cropIndex, setCropIndex] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formError, setFormError] = useState("");

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
        
        // Find and set the current crop index
        if (field && data.length > 0) {
          const currentCropIndex = data.findIndex(crop => crop.id === field.cropType);
          if (currentCropIndex !== -1) {
            setCropIndex(currentCropIndex);
          }
        }
      } catch (error) {
        console.error("Error fetching crops:", error);
        toast.error("Failed to load crop types");
      }
    }

    getCrops();
  }, [field]);

  const fieldSchema = object({
    name: string()
      .required("Field Name is required")
      .min(3, "Field Name must be at least 3 characters")
      .max(100, "Field Name can't be longer than 100 characters"),

    area: number()
      .required("Field Size is required")
      .min(0.25, "The field area must be at least 0.25 acres"),

    cropType: number().required("Crop Type is required"),
  });

  // Formik setup
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: field?.name || "",
      area: field?.area || 0,
      cropType: field?.cropType || 0,
    },
    validationSchema: fieldSchema,
    onSubmit: async (values) => {
      await updateField(values);
    },
  });

  // Update field function
  async function updateField(values) {
    setIsUpdating(true);
    setFormError("");
    
    try {
      const options = {
        url: `${baseUrl}/farms/${farmId}/Fields/${field.id}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          name: values.name,
          area: values.area,
          cropType: cropIndex,
        },
      };
      
      await axios(options);
      toast.success("Field updated successfully!");
      onSave(); // Refresh parent component
      onClose(); // Close the edit modal
      
    } catch (error) {
      console.error("Error updating field:", error);
      
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 400:
            setFormError(data.title || "Please check your input and try again.");
            break;
          case 403:
            setFormError("You don't have permission to edit this field.");
            break;
          case 409:
            setFormError("A field with this name already exists in this farm.");
            break;
          default:
            setFormError("Failed to update field. Please try again.");
        }
      } else {
        setFormError("Network error. Please check your connection and try again.");
      }
      toast.error("Failed to update field");
    } finally {
      setIsUpdating(false);
    }
  }

  if (!field || cropsData.length === 0) {
    return (
      <div className="h-[200px] rounded-md text-[18px] font-medium space-y-3 mx-3 mt-20 flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainColor"></div>
        <p className="text-[#808080]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-[blur(5)] fixed z-50 w-[100%] px-2 inset-0">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{
          duration: 0.4,
          ease: [0.23, 1, 0.32, 1],
        }}
        className="w-[650px] h-[660px] border-2 rounded-2xl bg-white flex flex-col items-center"
      >
        <div className="w-[90%] mt-5 text-[22px] flex justify-end">
          <i
            className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300 cursor-pointer"
            onClick={onClose}
          ></i>
        </div>

        {/* Header */}
        <div className="flex flex-col justify-center items-center mt-6 mb-6">
          <div className="capitalize mb-4 text-[20px] font-semibold text-mainColor">
            Edit Field: {field.name}
          </div>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="w-[85%] my-3 flex flex-col justify-between text-[17px] flex-grow"
        >
          <div className="flex flex-col gap-4 my-3">
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
                name="name"
                placeholder="Enter Field Name (3-100 characters)"
                className={`formControl mx-0 rounded-xl text-[15px] py-4 w-full transition-colors duration-200 ${
                  formik.touched.name && formik.errors.name
                    ? 'border-red-500 text-red-500 border-2 placeholder-red-400'
                    : 'border-[#0d121c21] focus:border-mainColor'
                }`}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
              )}
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
                name="area"
                placeholder="Enter Field Size (min 0.25 acres)"
                step="0.01"
                min="0.25"
                className={`formControl mx-0 rounded-xl text-[15px] py-4 w-full transition-colors duration-200 ${
                  formik.touched.area && formik.errors.area
                    ? 'border-red-500 text-red-500 border-2'
                    : 'border-[#0d121c21] focus:border-mainColor'
                }`}
                value={formik.values.area}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.area && formik.errors.area && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.area}</p>
              )}
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

          {/* Buttons */}
          <div className="flex justify-between items-center mt-6 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="py-2.5 px-6 rounded-xl bg-mainColor text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium disabled:opacity-50 transition-colors duration-200"
            >
              {isUpdating ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  Updating...
                </>
              ) : (
                "Update Field"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditField; 