import { X, Info } from "lucide-react";
import MenuElement from "../MenuElement/MenuElement";
import { useContext, useState } from "react";
import { date, object, string } from "yup";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect } from "react";
import { userContext } from "../../Context/User.context";
import { AllContext } from "../../Context/All.context";
import toast from "react-hot-toast";

const NewTask = (children) => {
  let { baseUrl } = useContext(AllContext);
  let { token, userId } = useContext(userContext);
  let [onList1, setOnList1] = useState();
  let [onList2, setOnList2] = useState();
  let [onList3, setOnList3] = useState();
  let [onList4, setOnList4] = useState();
  let [Fields, setFields] = useState([]);
  let [FieldNames, setFieldNames] = useState(null);
  let [index, setIndex] = useState(null);
  let [indexPriority, setIndexPriority] = useState(0);
  let [indexCategory, setIndexCategory] = useState(0);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [members, setMembers] = useState([]);
  const [memberNames, setMemberNames] = useState([]);
  const [memberIndex, setMemberIndex] = useState(0);
  let Priority = ["Low", "Medium", "High"];
  let Category = [
    "Irrigation",
    "Fertilization",
    "PlantingOrHarvesting",
    "Maintenance",
    "Inspection",
    "PestAndHealthControl",
  ];
  const validationSchema = object({
    assignedToId: string().nullable(),
    title: string()
      .required("Title is required.")
      .max(200, "Title must not exceed 200 characters.")
      .test('not-empty', 'Title is required.', function(value) {
        return value && value.trim().length > 0;
      }),
    description: string()
      .max(1000, "Description must not exceed 1000 characters."),
    dueDate: date()
      .test('is-future', 'Due date must be in the future.', function(value) {
        if (!value) return true; // Allow empty date
        return new Date(value) > new Date();
      }),
    itemPriority: string()
      .required("Priority is required.")
      .oneOf(["Low", "Medium", "High"], "Invalid priority value."),
    category: string()
      .required("Category is required.")
      .oneOf([
        "Irrigation",
        "Fertilization", 
        "PlantingOrHarvesting",
        "Maintenance",
        "Inspection",
        "PestAndHealthControl"
      ], "Invalid category value."),
  });

  async function getFields() {
    if (!token) {
      console.error("No token available for authentication");
      return;
    }

    try {
      const options = {
        url: `${baseUrl}/farms/${children.farmData.farmId}/Fields`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      setFields(data);
      if (data) {
        setIndex(0);
        setFieldNames(
          data.map((field) => {
            return field.name;
          })
        );
      }
    } catch (error) {
      console.error("Error fetching fields:", error);
    }
  }

  async function getMembers() {
    if (!token) {
      console.error("No token available for authentication");
      return;
    }

    try {
      const options = {
        url: `${baseUrl}/farms/${children.farmData.farmId}/members`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      
      if (data && data.length > 0) {
        // Get current user's role
        const currentUserRole = children.farmData.roleName?.toLowerCase();
        
        // Filter members based on role restrictions
        const filteredMembers = data.filter((member) => {
          // Convert both IDs to strings for comparison to handle mixed types
          const memberIdStr = String(member.memberId);
          const userIdStr = String(userId);
          
          // CRITICAL: Users cannot assign tasks to themselves - no exceptions
          if (memberIdStr === userIdStr) {
            return false;
          }
          
          const memberRole = member.roleName?.toLowerCase();
          
          // CRITICAL: Experts should never appear in the dropdown (no one can assign tasks to experts)
          if (memberRole === "expert") {
            return false;
          }
          
          // Role-based filtering
          if (currentUserRole === "manager") {
            // Managers can only assign tasks to workers
            return memberRole === "worker";
          }
          
          if (currentUserRole === "owner") {
            // Owners can assign to managers and workers, but NOT to other owners (to prevent confusion)
            return memberRole === "manager" || memberRole === "worker";
          }
          
          // Workers and other roles cannot create tasks (this should be prevented at UI level)
          return false;
        });
        setMembers(filteredMembers);
        
        // Always add "Not assigned" option at the beginning
        const memberOptions = filteredMembers.length > 0 
          ? ["Not assigned", ...filteredMembers.map((member) => `${member.firstName} ${member.lastName} - ${member.roleName}`)]
          : ["Not assigned"];
        setMemberNames(memberOptions);
      } else {
        setMembers([]);
        setMemberNames(["Not assigned"]);
      }
      
      setMemberIndex(0); // Default to "Not assigned"
    } catch (error) {
      console.error("Error fetching members:", error);
      // Fallback to "Not assigned" only if fetch fails
      setMembers([]);
      setMemberNames(["Not assigned"]);
      setMemberIndex(0);
    }
  }
  useEffect(() => {
    getFields();
    getMembers();
  }, []);

  // Helper function to get user-friendly error messages
  const getErrorMessage = (errorCode, defaultMessage) => {
    const errorMessages = {
      // Task-related errors
      "TaskItemErrors.CannotAssignToElevatedRoles": "You cannot assign tasks to users with higher roles than yourself.",
      "TaskItemErrors.CannotAssignTaskToSelf": "You cannot assign tasks to yourself.",
      "TaskItemErrors.CannotAssignTaskToExpert": "You cannot assign tasks to experts.",
      "TaskItemErrors.DuplicateTitle": "A task with this title already exists in this field.",
      "TaskItemErrors.TaskItemNotFound": "The specified task was not found.",
      "TaskItemErrors.UnauthorizedAction": "You are not authorized to perform this action.",
      "TaskItemErrors.AlreadyClaimed": "This task has already been claimed by another user.",
      "TaskItemErrors.TaskCannotBeCompletedUnclaimed": "This task cannot be completed as it hasn't been claimed.",
      "TaskItemErrors.TaskCannotBeCompletedByAnotherUser": "You cannot complete a task assigned to another user.",
      "TaskItemErrors.TaskAlreadyCompleted": "This task has already been completed.",
      // Inventory-related errors
      "InventoryItemErrors.DuplicateName": "An inventory item with this name already exists.",
      "InventoryItemErrors.ItemNotFound": "The specified inventory item was not found.",
      "InventoryItemErrors.InsufficientInventoryQuantity": "Insufficient inventory quantity available.",
    };
    
    return errorMessages[errorCode] || defaultMessage;
  };

  async function sendNewTask(values) {
    if (!token) {
      console.error("No token available for authentication");
      return;
    }

    setServerError("");
    setIsSubmitting(true);

    try {
      // Convert string values to enum integers for backend
      const processedValues = { ...values };
      
      // Convert priority string to enum integer
      const priorityMap = { "Low": 0, "Medium": 1, "High": 2 };
      if (processedValues.itemPriority && typeof processedValues.itemPriority === 'string') {
        processedValues.itemPriority = priorityMap[processedValues.itemPriority];
      }
      
      // Convert category string to enum integer
      const categoryMap = {
        "Irrigation": 0,
        "Fertilization": 1,
        "PlantingOrHarvesting": 2,
        "Maintenance": 3,
        "Inspection": 4,
        "PestAndHealthControl": 5
      };
      if (processedValues.category && typeof processedValues.category === 'string') {
        processedValues.category = categoryMap[processedValues.category];
      }

      // Handle assignedToId specially - it can be null and should be included
      const filteredValues = Object.fromEntries(
        Object.entries(processedValues).filter(
          ([key, value]) => {
            if (key === "assignedToId") return true; // Always include assignedToId even if null
            return value !== "" && value !== null && value !== undefined;
          }
        )
      );
      
      console.log("=== TASK CREATION DEBUG ===");
      console.log("Original form values:", values);
      console.log("Processed values:", processedValues);
      console.log("Filtered values being sent:", filteredValues);
      console.log("Selected member info:", {
        memberIndex,
        selectedMember: memberIndex > 0 ? members[memberIndex - 1] : null,
        assignedToId: filteredValues.assignedToId
      });
      console.log("=== END DEBUG ===");
      
      const option = {
        url: `${baseUrl}/farms/${children.farmData.farmId}/fields/${Fields[index].id}/Tasks`,
        method: "POST",
        data: filteredValues,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let data = await axios(option);
      if (data) {
        toast.success("Task created successfully!");
        children.setCreateTask(null);
        children.display();
      }
    } catch (error) {
      console.error("Error creating new task:", error);
      
      if (error.response) {
        const { status, data: errorData } = error.response;
        let errorMessage = "An unexpected error occurred. Please try again.";
        
        // Handle specific HTTP status codes
        switch (status) {
          case 400: // Bad Request - Validation errors
            if (errorData.errors) {
              // Extract validation error messages
              const errorMessages = Object.values(errorData.errors).flat();
              errorMessage = errorMessages.join(', ');
            } else if (errorData.title) {
              errorMessage = errorData.title;
            } else if (errorData.detail) {
              errorMessage = errorData.detail;
            } else {
              errorMessage = "Please check your input and try again.";
            }
            break;
            
          case 401: // Unauthorized
            errorMessage = getErrorMessage("TaskItemErrors.UnauthorizedAction", "You are not authorized to perform this action.");
            break;
            
          case 403: // Forbidden
            // Check for specific forbidden error codes
            if (errorData.code || errorData.title) {
              const code = errorData.code || errorData.title;
              errorMessage = getErrorMessage(code, "You don't have permission to perform this action.");
            } else {
              errorMessage = "You don't have permission to perform this action.";
            }
            break;
            
          case 404: // Not Found
            if (errorData.code || errorData.title) {
              const code = errorData.code || errorData.title;
              errorMessage = getErrorMessage(code, "The requested resource was not found.");
            } else {
              errorMessage = "The requested resource was not found.";
            }
            break;
            
          case 409: // Conflict
            if (errorData.code || errorData.title) {
              const code = errorData.code || errorData.title;
              errorMessage = getErrorMessage(code, "A conflict occurred while processing your request.");
            } else {
              errorMessage = "A conflict occurred while processing your request.";
            }
            break;
            
          case 500: // Internal Server Error
            errorMessage = "A server error occurred. Please try again later.";
            break;
            
          default:
            // Try to extract any specific error code from the response
            if (errorData.code) {
              errorMessage = getErrorMessage(errorData.code, errorMessage);
            } else if (errorData.title) {
              errorMessage = errorData.title;
            } else if (errorData.detail) {
              errorMessage = errorData.detail;
            }
        }
        
        setServerError(errorMessage);
        toast.error(errorMessage);
      } else {
        // Network error or other non-response error
        const errorMessage = "Unable to connect to the server. Please check your connection and try again.";
        setServerError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  }
  const formik = useFormik({
    initialValues: {
      assignedToId: null,
      title: "",
      description: "",
      dueDate: "",
      itemPriority: "Low", // Default to first priority
      category: "Irrigation", // Default to first category
    },
    validationSchema,
    onSubmit: sendNewTask,
    enableReinitialize: true, // Allow form to reinitialize when values change
  });
  useEffect(() => {
    // Use formik.setFieldValue to properly update form state
    formik.setFieldValue("itemPriority", Priority[indexPriority]);
    formik.setFieldValue("category", Category[indexCategory]);
    
    // Set assignedToId based on selected member (filtered members array)
    let assignedToId = null;
    if (memberIndex === 0) {
      assignedToId = null; // Not assigned
    } else if (members.length > 0 && memberIndex <= members.length) {
      assignedToId = members[memberIndex - 1]?.memberId || null;
    } else {
      assignedToId = null; // Fallback to not assigned
    }
    
    formik.setFieldValue("assignedToId", assignedToId);
    
    // Debug logging
    console.log("Member selection changed:");
    console.log("- Member index:", memberIndex);
    console.log("- Available members:", members);
    console.log("- Selected member:", memberIndex > 0 ? members[memberIndex - 1] : null);
    console.log("- Assigned to ID:", assignedToId);
    console.log("- Current formik assignedToId:", formik.values.assignedToId);
  }, [indexPriority, indexCategory, memberIndex, members]);

  // Clear server error when form values change
  useEffect(() => {
    if (serverError) {
      setServerError("");
    }
  }, [formik.values.title, formik.values.description, formik.values.dueDate, formik.values.assignedToId, formik.values.itemPriority, formik.values.category]);

  return (
    <section
      className="flex justify-center items-center bg-black bg-opacity-70 font-manrope fixed inset-0 z-50 p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          children.setCreateTask(null);
        }
      }}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg sm:rounded-2xl border-2 font-manrope">
        {/* Header - Sticky */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-8 py-4 rounded-t-lg sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-xl sm:text-2xl font-semibold capitalize text-[#0D121C]">
                Create New Task
              </h1>
              <p className="text-sm sm:text-base text-[#616161] font-medium">
                Add a new task to the selected farm.
              </p>
            </div>
            <button
              onClick={() => children.setCreateTask(null)}
              className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <X size={24} className="text-gray-600 hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-4 sm:px-8 py-6">
          <form
            className="space-y-6"
            onSubmit={formik.handleSubmit}
          >
            {/* Task Title */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="taskTitle"
                  className="text-base sm:text-lg text-[#0D121C] font-semibold"
                >
                  Task Title
                </label>
                <div className="relative group">
                  <Info size={16} className="text-gray-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Required • Max 200 characters
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
              <input
                type="text"
                id="taskTitle"
                className={`w-full border-2 ${formik.touched.title && formik.errors.title ? 'border-red-500 text-red-500' : 'border-[#9F9F9F]'} rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-mainColor`}
                placeholder="Enter a descriptive title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-red-500 text-sm">{formik.errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="description"
                  className="text-base sm:text-lg text-[#0D121C] font-semibold"
                >
                  Description
                </label>
                <div className="relative group">
                  <Info size={16} className="text-gray-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Optional • Max 1000 characters
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
              <textarea
                id="description"
                rows={4}
                className={`w-full border-2 ${formik.touched.description && formik.errors.description ? 'border-red-500 text-red-500' : 'border-[#9F9F9F]'} rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-mainColor resize-y`}
                placeholder="Provide details about the task"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-500 text-sm">{formik.errors.description}</p>
              )}
            </div>

            {/* Form Grid - Responsive Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Field Selection */}
              <div className="space-y-2">
                <label className="text-base sm:text-lg text-[#0D121C] font-semibold">
                  Field
                </label>
                <MenuElement
                  Items={FieldNames ? FieldNames : []}
                  nameChange={FieldNames ? FieldNames[index] : null}
                  setIndex={setIndex}
                  index={index}
                  onList={onList1}
                  width="100%"
                  setOnList={setOnList1}
                  Pformat={"text-[#0D121C] font-[400] text-sm sm:text-base"}
                />
              </div>

              {/* Assign To */}
              <div className="space-y-2">
                <label className="text-base sm:text-lg text-[#0D121C] font-semibold">
                  Assign To
                </label>
                <MenuElement
                  Items={memberNames}
                  nameChange={memberNames[memberIndex] || "Not assigned"}
                  setIndex={setMemberIndex}
                  index={memberIndex}
                  onList={onList4}
                  width="100%"
                  setOnList={setOnList4}
                  Pformat={"text-[#0D121C] font-[400] text-sm sm:text-base"}
                />
                {/* Role-based assignment info */}
                {children.farmData.roleName?.toLowerCase() === "manager" && (
                  <p className="text-xs text-gray-500">
                    As a manager, you can only assign tasks to workers.
                  </p>
                )}
                {children.farmData.roleName?.toLowerCase() === "owner" && (
                  <p className="text-xs text-gray-500">
                    You can assign tasks to managers and workers.
                  </p>
                )}
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-base sm:text-lg text-[#0D121C] font-semibold">
                    Priority
                  </label>
                  <div className="relative group">
                    <Info size={16} className="text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      Required • Low, Medium, or High
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                </div>
                <MenuElement
                  Items={Priority}
                  nameChange={Priority[indexPriority]}
                  setIndex={setIndexPriority}
                  index={indexPriority}
                  onList={onList2}
                  width="100%"
                  setOnList={setOnList2}
                  Pformat={"text-[#0D121C] font-[400] text-sm sm:text-base"}
                />
                {formik.touched.itemPriority && formik.errors.itemPriority && (
                  <p className="text-red-500 text-sm">{formik.errors.itemPriority}</p>
                )}
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="dueDate" className="text-base sm:text-lg text-[#0D121C] font-semibold">
                    Due Date
                  </label>
                  <div className="relative group">
                    <Info size={16} className="text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      Optional • Must be in the future
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                </div>
                <input
                  type="datetime-local"
                  id="dueDate"
                  className={`w-full border-2 ${formik.touched.dueDate && formik.errors.dueDate ? 'border-red-500 text-red-500' : 'border-[#9F9F9F]'} rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-mainColor`}
                  name="dueDate"
                  value={formik.values.dueDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.dueDate && formik.errors.dueDate && (
                  <p className="text-red-500 text-sm">{formik.errors.dueDate}</p>
                )}
              </div>

              {/* Category - Full width on mobile, spans both columns */}
              <div className="sm:col-span-2 space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-base sm:text-lg text-[#0D121C] font-semibold">
                    Category
                  </label>
                  <div className="relative group">
                    <Info size={16} className="text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      Required • Task category type
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                </div>
                <div className="sm:max-w-sm">
                  <MenuElement
                    Items={Category}
                    nameChange={Category[indexCategory]}
                    setIndex={setIndexCategory}
                    index={indexCategory}
                    onList={onList3}
                    width="100%"
                    setOnList={setOnList3}
                    Pformat={"text-[#0D121C] font-[400] text-sm sm:text-base"}
                  />
                </div>
                {formik.touched.category && formik.errors.category && (
                  <p className="text-red-500 text-sm">{formik.errors.category}</p>
                )}
              </div>
            </div>

            {/* Server Error Display */}
            {serverError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm font-medium">{serverError}</p>
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions - Sticky */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-8 py-4 rounded-b-lg sm:rounded-b-2xl">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => children.setCreateTask(null)}
              className="order-2 sm:order-1 py-3 px-6 border border-[#616161] rounded-lg text-[#333333] text-sm sm:text-base hover:bg-mainColor hover:text-white hover:border-mainColor transition-all duration-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={formik.handleSubmit}
              className="order-1 sm:order-2 py-3 px-6 border border-transparent rounded-lg bg-mainColor text-sm sm:text-base text-white hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="flex justify-center items-center gap-3">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Task</span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewTask;

