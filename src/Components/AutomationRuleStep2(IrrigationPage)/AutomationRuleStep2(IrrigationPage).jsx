import { Check, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AllContext } from "../../Context/All.context";
import MenuElement from "../MenuElement/MenuElement";
import { userContext } from "../../Context/User.context";
import { number, object, string } from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";
const AutomationRuleStep2IrrigationPage = (children) => {
  let { setControlIrrigationPage, baseUrl } = useContext(AllContext);
  let { token } = useContext(userContext);
  let [onList, setOnList] = useState(false);
  let [sensorTypeList, setSensorTypeList] = useState(false);
  let type = ["Threshold", "Schedule"];
  let sensorTypes = ["SoilMoisture", "Temperature", "Humidity", "Light"];
  let [typeId, setTypeId] = useState(0);
  let [sensorTypeId, setSensorTypeId] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // let [dataAuto,setDataAuto]=useState({
  //     name:"",
  //     type:"",
  //     minThresholdValue:null,
  //     maxThresholdValue:null,
  //     targetSensorType:null,
  //     startTime:null,
  //     endTime:null,
  //     activeDays:null,
  // });
  function format() {
    if (typeId === 1) {
      return {
        startTime: null,
        endTime: null,
        activeDays: null,
        targetSensorType: null,
      };
    } else {
      return {
        minThresholdValue: null,
        maxThresholdValue: null,
        targetSensorType: 0,
      };
    }
  }
  let [Days, setDays] = useState({
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  });
  function sumDaysValue() {
    return Object.values(Days).reduce((acc, curr) => acc + (curr || 0), 0);
  }

  const validationSchema = object({
    name: string()
      .required("Rule name is required")
      .min(3, "Rule name must be at least 3 characters")
      .max(100, "Rule name cannot be more than 100 characters"),
  });
  async function sendAutomationRule(values) {
    setIsSubmitting(true);
    setFormError("");
    
    try {
      let requestBody;
      
      if (typeId === 0) { // Threshold rule
        if (values.minThresholdValue === null || values.minThresholdValue === undefined || values.minThresholdValue === "") {
          setFormError("Min threshold value is required for threshold-based rules.");
          setIsSubmitting(false);
          return;
        }
        
        requestBody = {
          name: values.name,
          isEnabled: true, // New rules are enabled by default
          type: 0, // AutomationRuleType.Threshold
          minThresholdValue: parseFloat(values.minThresholdValue),
          maxThresholdValue: values.maxThresholdValue ? parseFloat(values.maxThresholdValue) : null,
          targetSensorType: 0, // Always send 0 for sensor type
          startTime: null,
          endTime: null,
          activeDays: null
        };
      } else { // Scheduled rule
        const activeDaysSum = sumDaysValue();
        if (activeDaysSum === 0) {
          setFormError("At least one day must be selected for scheduled rules.");
          setIsSubmitting(false);
          return;
        }
        
        if (!values.startTime || !values.endTime) {
          setFormError("Start time and end time are required for scheduled rules.");
          setIsSubmitting(false);
          return;
        }
        
        requestBody = {
          name: values.name,
          isEnabled: true, // New rules are enabled by default
          type: 1, // AutomationRuleType.Scheduled
          minThresholdValue: null,
          maxThresholdValue: null,
          targetSensorType: null,
          startTime: values.startTime,
          endTime: values.endTime,
          activeDays: activeDaysSum
        };
      }
      
      const options = {
        url: `${baseUrl}/farms/${children.farmId}/fields/${children.field.id}/AutomationRules`,
        method: "POST",
        data: requestBody,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      };
      
      await axios(options);
      toast.success("Automation rule added successfully!");
      setControlIrrigationPage(null);
      children.getAutomation();
    } catch (error) {
      console.error("Error adding automation rule:", error);
      
      if (error.response) {
        const { status, data } = error.response;
        console.log("Error response:", data);
        const errorCode = data.title || data.error || data.message;
        
        switch (status) {
          case 400:
            // Display validation errors if available
            if (data.errors) {
              const errorMessages = Object.values(data.errors).flat();
              setFormError(errorMessages.join('. '));
            } else {
              setFormError(data.title || data.message || "Please check your input and try again.");
            }
            break;
          case 409:
            setFormError("An automation rule with this name already exists.");
            break;
          default:
            setFormError(`Failed to add automation rule. Status: ${status}, Error: ${data.title || data.message || 'Unknown error'}`);
        }
      } else {
        setFormError("Network error. Please check your connection and try again.");
      }
      toast.error("Failed to add automation rule");
    } finally {
      setIsSubmitting(false);
    }
  }
  const formik = useFormik({
    initialValues: {
      name: "",
      minThresholdValue: "",
      maxThresholdValue: "",
      startTime: "",
      endTime: "",
    },
    validationSchema,
    onSubmit: sendAutomationRule,
  });

  // Clear form errors when switching rule types
  useEffect(() => {
    setFormError("");
  }, [typeId]);
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
                Add New Automation Rule
              </h1>
              <p className="text-sm sm:text-base text-[#616161] font-medium mt-1">
                Add or edit an automation rule
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
            
            {/* Rule Name */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm sm:text-base font-medium">Rule Name</label>
                <div className="relative group">
                  <i className="fa-solid fa-info-circle text-gray-400 hover:text-gray-600 cursor-help text-sm"></i>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Rule name must be 3-100 characters long
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
              <input
                type="text"
                placeholder="Enter a name for the rule"
                className={`w-full px-4 py-3 sm:py-4 border rounded-lg text-sm sm:text-base transition-colors duration-200 ${
                  formik.touched.name && formik.errors.name
                    ? 'border-red-500 text-red-500 border-2 placeholder-red-400'
                    : 'border-gray-300 focus:border-mainColor focus:outline-none'
                }`}
                name="name"
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

            {/* Rule Type */}
            <div>
              <label className="block text-sm sm:text-base font-medium mb-2">
                Rule Type
              </label>
              <MenuElement
                Items={type}
                nameChange={type[typeId]}
                index={typeId}
                setIndex={setTypeId}
                onList={onList}
                width="100%"
                name="Select Rule Type"
                setOnList={setOnList}
                Pformat="text-[#616161]"
              />
            </div>

            {/* Conditional Fields Based on Rule Type */}
            {typeId == 1 ? (
              <div className="space-y-4">
                {/* Start Time */}
                <div>
                  <label className="block text-sm sm:text-base font-medium mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    placeholder="00:00"
                    className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg text-sm sm:text-base focus:border-mainColor focus:outline-none"
                    name="startTime"
                    value={String(formik.values.startTime)}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm sm:text-base font-medium mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    placeholder="00:00"
                    className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg text-sm sm:text-base focus:border-mainColor focus:outline-none"
                    name="endTime"
                    value={formik.values.endTime}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>

                {/* Days Selection */}
                <div>
                  <label className="block text-sm sm:text-base font-medium mb-3">
                    Days
                  </label>
                  <div className="flex justify-between gap-2 text-sm sm:text-base font-semibold">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 flex justify-center items-center cursor-pointer transition-all duration-200 ${
                        Days.Mon > 0 ? 'bg-mainColor text-white border-mainColor' : 'bg-white text-gray-700 hover:border-mainColor'
                      }`}
                      onClick={() => {
                        if (Days.Mon == 0) {
                          setDays((prev) => ({ ...prev, Mon: 1 }));
                        } else {
                          setDays((prev) => ({ ...prev, Mon: 0 }));
                        }
                      }}
                    >
                      M
                    </div>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 flex justify-center items-center cursor-pointer transition-all duration-200 ${
                        Days.Tue > 0 ? 'bg-mainColor text-white border-mainColor' : 'bg-white text-gray-700 hover:border-mainColor'
                      }`}
                      onClick={() => {
                        if (Days.Tue == 0) {
                          setDays((prev) => ({ ...prev, Tue: 2 }));
                        } else {
                          setDays((prev) => ({ ...prev, Tue: 0 }));
                        }
                      }}
                    >
                      T
                    </div>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 flex justify-center items-center cursor-pointer transition-all duration-200 ${
                        Days.Wed > 0 ? 'bg-mainColor text-white border-mainColor' : 'bg-white text-gray-700 hover:border-mainColor'
                      }`}
                      onClick={() => {
                        if (Days.Wed == 0) {
                          setDays((prev) => ({ ...prev, Wed: 4 }));
                        } else {
                          setDays((prev) => ({ ...prev, Wed: 0 }));
                        }
                      }}
                    >
                      W
                    </div>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 flex justify-center items-center cursor-pointer transition-all duration-200 ${
                        Days.Thu > 0 ? 'bg-mainColor text-white border-mainColor' : 'bg-white text-gray-700 hover:border-mainColor'
                      }`}
                      onClick={() => {
                        if (Days.Thu == 0) {
                          setDays((prev) => ({ ...prev, Thu: 8 }));
                        } else {
                          setDays((prev) => ({ ...prev, Thu: 0 }));
                        }
                      }}
                    >
                      T
                    </div>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 flex justify-center items-center cursor-pointer transition-all duration-200 ${
                        Days.Fri > 0 ? 'bg-mainColor text-white border-mainColor' : 'bg-white text-gray-700 hover:border-mainColor'
                      }`}
                      onClick={() => {
                        if (Days.Fri == 0) {
                          setDays((prev) => ({ ...prev, Fri: 16 }));
                        } else {
                          setDays((prev) => ({ ...prev, Fri: 0 }));
                        }
                      }}
                    >
                      F
                    </div>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 flex justify-center items-center cursor-pointer transition-all duration-200 ${
                        Days.Sat > 0 ? 'bg-mainColor text-white border-mainColor' : 'bg-white text-gray-700 hover:border-mainColor'
                      }`}
                      onClick={() => {
                        if (Days.Sat == 0) {
                          setDays((prev) => ({ ...prev, Sat: 32 }));
                        } else {
                          setDays((prev) => ({ ...prev, Sat: 0 }));
                        }
                      }}
                    >
                      S
                    </div>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 flex justify-center items-center cursor-pointer transition-all duration-200 ${
                        Days.Sun > 0 ? 'bg-mainColor text-white border-mainColor' : 'bg-white text-gray-700 hover:border-mainColor'
                      }`}
                      onClick={() => {
                        if (Days.Sun == 0) {
                          setDays((prev) => ({ ...prev, Sun: 64 }));
                        } else {
                          setDays((prev) => ({ ...prev, Sun: 0 }));
                        }
                      }}
                    >
                      S
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Start Irrigation Threshold */}
                <div>
                  <label className="block text-sm sm:text-base font-medium mb-2">
                    Start irrigation threshold
                  </label>
                  <input
                    type="number"
                    placeholder="50"
                    className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg text-sm sm:text-base focus:border-mainColor focus:outline-none"
                    name="minThresholdValue"
                    value={formik.values.minThresholdValue}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>

                {/* Stop Irrigation Threshold */}
                <div>
                  <label className="block text-sm sm:text-base font-medium mb-2">
                    Stop irrigation threshold
                  </label>
                  <input
                    type="number"
                    placeholder="80"
                    className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg text-sm sm:text-base focus:border-mainColor focus:outline-none"
                    name="maxThresholdValue"
                    value={formik.values.maxThresholdValue}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer - Sticky */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4 rounded-b-lg sm:rounded-b-2xl">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none py-3 px-6 sm:px-8 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-gray-50 hover:border-mainColor hover:text-mainColor transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                setControlIrrigationPage("Step1AutomationRule");
              }}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none py-3 px-6 sm:px-8 border border-transparent rounded-lg bg-mainColor text-sm sm:text-base text-white hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={formik.handleSubmit}
            >
              <div className="flex justify-center items-center space-x-2">
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Adding...</span>
                  </>
                ) : (
                  <span>Add</span>
                )}
              </div>
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AutomationRuleStep2IrrigationPage;
