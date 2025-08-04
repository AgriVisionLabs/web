import { useContext, useState, useEffect } from "react";
import { X } from "lucide-react";
import { useFormik } from "formik";
import { object, string, number } from "yup";
import { AllContext } from "../../Context/All.context";
import { userContext } from "../../Context/User.context";
import MenuElement from "../MenuElement/MenuElement";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const EditAutomationRule = ({ automationRule, fields, onClose, onUpdate }) => {
  const { baseUrl } = useContext(AllContext);
  const { token, userData } = useContext(userContext);
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [formError, setFormError] = useState("");
  const [typeIndex, setTypeIndex] = useState(0);
  const [fieldIndex, setFieldIndex] = useState(0);
  const [sensorTypeIndex, setSensorTypeIndex] = useState(0);
  const [selectedDays, setSelectedDays] = useState([]);

  const validationSchema = object({
    name: string()
      .required("Rule name is required")
      .min(3, "Rule name must be at least 3 characters")
      .max(100, "Rule name cannot exceed 100 characters"),
  });

  const typeOptions = ["Threshold", "Scheduled"];
  const sensorTypeOptions = ["Soil Moisture", "Temperature", "Humidity", "Light"];
  const fieldNames = fields ? fields.map(field => field.name) : [];
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Convert days flags to array
  const convertDaysToArray = (activeDays) => {
    if (!activeDays) return [];
    const days = [];
    const flags = [1, 2, 4, 8, 16, 32, 64]; // Monday to Sunday
    flags.forEach((flag, index) => {
      if (activeDays & flag) {
        days.push(index);
      }
    });
    return days;
  };

  // Convert array to days flags
  const convertArrayToDays = (daysArray) => {
    const flags = [1, 2, 4, 8, 16, 32, 64]; // Monday to Sunday
    return daysArray.reduce((sum, dayIndex) => sum + flags[dayIndex], 0);
  };

  const handleDayToggle = (dayIndex) => {
    setSelectedDays(prev => 
      prev.includes(dayIndex) 
        ? prev.filter(d => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  async function updateAutomationRule(values) {
    setIsUpdating(true);
    setFormError("");
    
    try {
      // Validate name field
      if (!values.name || values.name.trim() === "") {
        setFormError("Rule name is required.");
        setIsUpdating(false);
        return;
      }

      let requestBody;

      if (typeIndex === 0) { // Threshold rule
        if (!values.minThresholdValue || values.minThresholdValue === "") {
          setFormError("Min threshold value is required for threshold-based rules.");
          setIsUpdating(false);
          return;
        }
        
        requestBody = {
          name: values.name,
          isEnabled: automationRule.isEnabled, // Keep current enabled state
          type: 0, // AutomationRuleType.Threshold
          minThresholdValue: parseFloat(values.minThresholdValue),
          maxThresholdValue: values.maxThresholdValue ? parseFloat(values.maxThresholdValue) : null,
          targetSensorType: 0, // Always 0 as specified
          startTime: null,
          endTime: null,
          activeDays: null
        };
      } else { // Scheduled rule
        const activeDaysSum = convertArrayToDays(selectedDays);
        if (activeDaysSum === 0) {
          setFormError("At least one day must be selected for scheduled rules.");
          setIsUpdating(false);
          return;
        }
        
        if (!values.startTime || !values.endTime) {
          setFormError("Start time and end time are required for scheduled rules.");
          setIsUpdating(false);
          return;
        }
        
        requestBody = {
          name: values.name,
          isEnabled: automationRule.isEnabled, // Keep current enabled state
          type: 1, // AutomationRuleType.Scheduled
          minThresholdValue: null,
          maxThresholdValue: null,
          targetSensorType: null,
          startTime: values.startTime,
          endTime: values.endTime,
          activeDays: activeDaysSum
        };
      }
      
      const selectedField = fields[fieldIndex];
      if (!selectedField) {
        setFormError("Please select a valid field.");
        setIsUpdating(false);
        return;
      }

      console.log("=== UPDATE AUTOMATION RULE DEBUG ===");
      console.log("Form values:", values);
      console.log("Request body:", requestBody);
      console.log("Selected field:", selectedField);
      console.log("Type index:", typeIndex);
      console.log("Sensor type index:", sensorTypeIndex);
      console.log("Selected days:", selectedDays);
      console.log("=== END DEBUG ===");

      const options = {
        url: `${baseUrl}/farms/${automationRule.farmId}/fields/${selectedField.id}/AutomationRules/${automationRule.id}`,
        method: "PUT",
        data: requestBody,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      let { data } = await axios(options);
      console.log("updateAutomationRule", data);
      toast.success("Automation rule updated successfully!");
      if (onUpdate) {
        onUpdate();
      }
      onClose();
    } catch (error) {
      console.error("Error updating automation rule:", error);
      
      if (error.response) {
        const { status, data } = error.response;
        const errorCode = data.title || data.error || data.message;
        
        switch (status) {
          case 400:
            setFormError(data.title || "Please check your input and try again.");
            break;
          case 404:
            setFormError("The automation rule was not found.");
            break;
          case 409:
            setFormError("An automation rule with this name already exists.");
            break;
          default:
            setFormError("Failed to update automation rule. Please try again.");
        }
      } else {
        setFormError("Network error. Please check your connection and try again.");
      }
      toast.error("Failed to update automation rule");
    } finally {
      setIsUpdating(false);
    }
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: automationRule.name || "",
      minThresholdValue: automationRule.minThresholdValue || "",
      maxThresholdValue: automationRule.maxThresholdValue || "",
      startTime: automationRule.startTime || "",
      endTime: automationRule.endTime || "",
    },
    validationSchema,
    onSubmit: updateAutomationRule,
  });

  // Initialize form values
  useEffect(() => {
    if (automationRule) {
      console.log("=== INITIALIZING EDIT AUTOMATION RULE ===");
      console.log("Automation rule data:", automationRule);
      console.log("Fields data:", fields);
      console.log("=== END INITIALIZATION ===");
      
      // Set type index based on rule type
      setTypeIndex(automationRule.activeDays !== null ? 1 : 0);
      
      // Set field index
      if (fields && automationRule.fieldId) {
        const index = fields.findIndex(field => field.id === automationRule.fieldId);
        setFieldIndex(index >= 0 ? index : 0);
      }
      
      // Set sensor type index for threshold rules
      if (automationRule.targetSensorType !== null) {
        setSensorTypeIndex(automationRule.targetSensorType);
      }
      
      // Set selected days for scheduled rules
      if (automationRule.activeDays !== null) {
        setSelectedDays(convertDaysToArray(automationRule.activeDays));
      }
    }
  }, [automationRule, fields]);

  // Clear form errors when switching rule types
  useEffect(() => {
    setFormError("");
    console.log("Type index changed to:", typeIndex);
  }, [typeIndex]);

  // Debug field index changes
  useEffect(() => {
    console.log("Field index changed to:", fieldIndex);
  }, [fieldIndex]);

  // Debug sensor type index changes
  useEffect(() => {
    console.log("Sensor type index changed to:", sensorTypeIndex);
  }, [sensorTypeIndex]);

  return (
    <section
      className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-[blur(5)] absolute z-50 w-[100%]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
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
        className="w-[650px] px-[40px] min-h-[500px] border-2 rounded-2xl bg-white p-[20px]"
      >
        <X
          size={33}
          className="ms-auto cursor-pointer hover:text-red-500 transition-all duration-150"
          onClick={onClose}
        />
        <div className="text-center mt-[16px] space-y-[15px]">
          <h1 className="text-[24px] text-mainColor font-medium capitalize">
            Edit Automation Rule
          </h1>
          <p className="text-[22px] text-[#616161] font-medium">
            Edit automation rule settings
          </p>
        </div>
        <form
          action=""
          className="w-[100%] mt-[30px] flex flex-col justify-between pe-[10px] text-[18px] font-s flex-grow"
          onSubmit={formik.handleSubmit}
        >
          <div className="flex flex-col space-y-[20px]">
            <div className="flex flex-col space-y-[8px]">
              <label htmlFor="name" className="text-[#1f1f1f96] font-medium">
                Rule Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`p-[12px] border-2 rounded-lg focus:outline-none focus:border-mainColor transition-all duration-300 ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500"
                    : "border-[#0d121c21]"
                }`}
                placeholder="Enter rule name"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-sm">{formik.errors.name}</div>
              )}
            </div>

            <div className="flex flex-col space-y-[8px]">
              <label className="text-[#1f1f1f96] font-medium">Rule Type</label>
              <MenuElement
                Items={typeOptions}
                nameChange={typeOptions[typeIndex]}
                setIndex={setTypeIndex}
                width="100%"
                className="py-[12px] border-2 border-[#0d121c21] rounded-lg"
              />
            </div>

            <div className="flex flex-col space-y-[8px]">
              <label className="text-[#1f1f1f96] font-medium">Field</label>
              <MenuElement
                Items={fieldNames}
                nameChange={fieldNames[fieldIndex]}
                setIndex={setFieldIndex}
                width="100%"
                className="py-[12px] border-2 border-[#0d121c21] rounded-lg"
              />
            </div>

            {typeIndex === 0 ? (
              // Threshold rule fields
              <>
                <div className="flex flex-col space-y-[8px]">
                  <label className="text-[#1f1f1f96] font-medium">Sensor Type</label>
                  <MenuElement
                    Items={sensorTypeOptions}
                    nameChange={sensorTypeOptions[sensorTypeIndex]}
                    setIndex={setSensorTypeIndex}
                    width="100%"
                    className="py-[12px] border-2 border-[#0d121c21] rounded-lg"
                  />
                </div>
                
                <div className="flex flex-col space-y-[8px]">
                  <label htmlFor="minThresholdValue" className="text-[#1f1f1f96] font-medium">
                    Min Threshold Value
                  </label>
                  <input
                    type="number"
                    id="minThresholdValue"
                    name="minThresholdValue"
                    value={formik.values.minThresholdValue}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="p-[12px] border-2 border-[#0d121c21] rounded-lg focus:outline-none focus:border-mainColor transition-all duration-300"
                    placeholder="Enter minimum threshold value"
                  />
                </div>
                
                <div className="flex flex-col space-y-[8px]">
                  <label htmlFor="maxThresholdValue" className="text-[#1f1f1f96] font-medium">
                    Max Threshold Value (Optional)
                  </label>
                  <input
                    type="number"
                    id="maxThresholdValue"
                    name="maxThresholdValue"
                    value={formik.values.maxThresholdValue}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="p-[12px] border-2 border-[#0d121c21] rounded-lg focus:outline-none focus:border-mainColor transition-all duration-300"
                    placeholder="Enter maximum threshold value"
                  />
                </div>
              </>
            ) : (
              // Scheduled rule fields
              <>
                <div className="flex flex-col space-y-[8px]">
                  <label htmlFor="startTime" className="text-[#1f1f1f96] font-medium">
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formik.values.startTime}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="p-[12px] border-2 border-[#0d121c21] rounded-lg focus:outline-none focus:border-mainColor transition-all duration-300"
                  />
                </div>
                
                <div className="flex flex-col space-y-[8px]">
                  <label htmlFor="endTime" className="text-[#1f1f1f96] font-medium">
                    End Time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formik.values.endTime}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="p-[12px] border-2 border-[#0d121c21] rounded-lg focus:outline-none focus:border-mainColor transition-all duration-300"
                  />
                </div>
                
                <div className="flex flex-col space-y-[8px]">
                  <label className="text-[#1f1f1f96] font-medium">Active Days</label>
                  <div className="grid grid-cols-7 gap-2">
                    {daysOfWeek.map((day, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleDayToggle(index)}
                        className={`p-2 text-sm rounded-lg border-2 transition-all duration-300 ${
                          selectedDays.includes(index)
                            ? "bg-mainColor text-white border-mainColor"
                            : "bg-white text-[#1f1f1f96] border-[#0d121c21]"
                        }`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {formError && (
            <div className="text-red-500 text-sm mt-4 text-center">{formError}</div>
          )}

          <div className="flex justify-between mt-[30px]">
            <button
              type="button"
              onClick={onClose}
              className="px-[30px] py-[12px] border-2 border-[#0d121c21] rounded-lg text-[#1f1f1f96] hover:bg-gray-100 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className={`px-[30px] py-[12px] rounded-lg text-white transition-all duration-300 ${
                isUpdating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-mainColor hover:bg-mainColor/90"
              }`}
            >
              {isUpdating ? "Updating..." : "Update Rule"}
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  );
};

export default EditAutomationRule; 