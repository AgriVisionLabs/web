/* eslint-disable react/prop-types */
import { X, Info } from "lucide-react";
import MenuElement from "../MenuElement/MenuElement";
import { useContext, useState, useEffect } from "react";
import { date, object, string } from "yup";
import axios from "axios";
import { useFormik } from "formik";
import { userContext } from "../../Context/User.context";
import { AllContext } from "../../Context/All.context";
import toast from "react-hot-toast";

const EditTask = ({
  task,
  farmData,
  onClose,
  onUpdate,
  display,
  setEditTaskModal,
}) => {
  let { baseUrl } = useContext(AllContext);
  let { token, userId } = useContext(userContext);
  let [onList1, setOnList1] = useState();
  let [onList2, setOnList2] = useState();
  let [onList3, setOnList3] = useState();
  let [onList4, setOnList4] = useState();
  let [Fields, setFields] = useState([]);
  let [FieldNames, setFieldNames] = useState(null);
  let [index, setIndex] = useState(0);
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
      .test("not-empty", "Title is required.", function (value) {
        return value && value.trim().length > 0;
      }),
    description: string().max(
      1000,
      "Description must not exceed 1000 characters."
    ),
    dueDate: date().test(
      "is-future",
      "Due date must be in the future.",
      function (value) {
        if (!value) return true; // Allow empty date
        return new Date(value) > new Date();
      }
    ),
    itemPriority: string()
      .required("Priority is required.")
      .oneOf(["Low", "Medium", "High"], "Invalid priority value."),
    category: string()
      .required("Category is required.")
      .oneOf(
        [
          "Irrigation",
          "Fertilization",
          "PlantingOrHarvesting",
          "Maintenance",
          "Inspection",
          "PestAndHealthControl",
        ],
        "Invalid category value."
      ),
  });

  // Initialize form values based on existing task data
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  async function getFields() {
    if (!token) {
      console.error("No token available for authentication");
      return;
    }

    try {
      const options = {
        url: `${baseUrl}/farms/${farmData.farmId}/Fields`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      setFields(data);
      if (data) {
        // Find the index of the current task's field
        const currentFieldIndex = data.findIndex(
          (field) => field.id === task.fieldId
        );
        setIndex(currentFieldIndex >= 0 ? currentFieldIndex : 0);
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
        url: `${baseUrl}/farms/${farmData.farmId}/members`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);

      if (data && data.length > 0) {
        const currentUserRole = farmData.roleName?.toLowerCase();

        const filteredMembers = data.filter((member) => {
          const memberIdStr = String(member.memberId);
          const userIdStr = String(userId);

          if (memberIdStr === userIdStr) {
            return false;
          }

          const memberRole = member.roleName?.toLowerCase();

          if (memberRole === "expert") {
            return false;
          }

          if (currentUserRole === "manager") {
            return memberRole === "worker";
          }

          if (currentUserRole === "owner") {
            return memberRole === "manager" || memberRole === "worker";
          }

          return false;
        });

        setMembers(filteredMembers);

        // Set up member names with "Not assigned" option
        const memberDisplayNames = [
          "Not assigned",
          ...filteredMembers.map(
            (member) =>
              `${member.firstName} ${member.lastName} - ${member.roleName}`
          ),
        ];
        setMemberNames(memberDisplayNames);

        // Find current assignment
        if (task.assignedToId) {
          const assignedMemberIndex = filteredMembers.findIndex(
            (member) => String(member.memberId) === String(task.assignedToId)
          );
          setMemberIndex(
            assignedMemberIndex >= 0 ? assignedMemberIndex + 1 : 0
          );
        } else {
          setMemberIndex(0); // Not assigned
        }
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembers([]);
      setMemberNames(["Not assigned"]);
      setMemberIndex(0);
    }
  }

  async function updateTask(values) {
    setIsSubmitting(true);
    setServerError("");

    try {
      // Set assignedToId based on selected member
      let assignedToId = null;
      if (memberIndex === 0) {
        assignedToId = null; // Not assigned
      } else if (members.length > 0 && memberIndex <= members.length) {
        assignedToId = members[memberIndex - 1]?.memberId || null;
      }

      // Convert priority string to number (0=Low, 1=Medium, 2=High)
      const priorityMap = { Low: 0, Medium: 1, High: 2 };
      const priorityValue = priorityMap[Priority[indexPriority]];

      // Prepare the request body with all required fields
      const requestBody = {
        title: values.title,
        description: values.description,
        assignedToId: assignedToId,
        dueDate: values.dueDate,
        itemPriority: priorityValue,
      };

      console.log("=== TASK UPDATE DEBUG ===");
      console.log("Original task:", task);
      console.log("Form values:", values);
      console.log("Request body being sent:", requestBody);
      console.log(
        "Priority mapping:",
        Priority[indexPriority],
        "->",
        priorityValue
      );
      console.log("=== END DEBUG ===");

      const option = {
        url: `${baseUrl}/farms/${farmData.farmId}/Tasks/${task.id}`,
        method: "PUT",
        data: requestBody,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let { data } = await axios(option);
      if (data) {
        toast.success("Task updated successfully!");
        if (onUpdate) {
          onUpdate();
        }
        onClose();
      }
    } catch (error) {
      console.error("Error updating task:", error);

      if (error.response) {
        const { status, data: errorData } = error.response;
        let errorMessage = "An unexpected error occurred. Please try again.";

        switch (status) {
          case 400:
            if (errorData.errors) {
              const errorMessages = Object.values(errorData.errors).flat();
              errorMessage = errorMessages.join(", ");
            } else if (errorData.title) {
              errorMessage = errorData.title;
            } else if (errorData.detail) {
              errorMessage = errorData.detail;
            } else {
              errorMessage = "Please check your input and try again.";
            }
            break;

          case 401:
            errorMessage = "You are not authorized to perform this action.";
            break;

          case 403:
            errorMessage = "You don't have permission to update this task.";
            break;

          case 404:
            errorMessage = "Task not found. It may have been deleted.";
            break;

          default:
            errorMessage = "Failed to update task. Please try again.";
        }

        setServerError(errorMessage);
        toast.error(errorMessage);
      } else {
        setServerError(
          "Network error. Please check your connection and try again."
        );
        toast.error(
          "Network error. Please check your connection and try again."
        );
      }
    } finally {
      setIsSubmitting(false);
      setEditTaskModal(null);
      display();
    }
  }

  const formik = useFormik({
    initialValues: {
      assignedToId: task.assignedToId || null,
      title: task.title || "",
      description: task.description || "",
      dueDate: formatDateForInput(task.dueDate) || "",
      itemPriority: task.itemPriority || "Low",
      category: task.category || "Irrigation",
    },
    validationSchema,
    onSubmit: updateTask,
    enableReinitialize: true,
  });

  useEffect(() => {
    getFields();
    getMembers();

    // Set initial priority and category indices
    const priorityIndex = Priority.findIndex((p) => p === task.itemPriority);
    setIndexPriority(priorityIndex >= 0 ? priorityIndex : 0);

    const categoryIndex = Category.findIndex((c) => c === task.category);
    setIndexCategory(categoryIndex >= 0 ? categoryIndex : 0);
  }, []);

  useEffect(() => {
    formik.setFieldValue("itemPriority", Priority[indexPriority]);
    formik.setFieldValue("category", Category[indexCategory]);

    let assignedToId = null;
    if (memberIndex === 0) {
      assignedToId = null;
    } else if (members.length > 0 && memberIndex <= members.length) {
      assignedToId = members[memberIndex - 1]?.memberId || null;
    }
    formik.setFieldValue("assignedToId", assignedToId);
  }, [indexPriority, indexCategory, memberIndex, members]);

  return (
    <section
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 font-manrope backdrop-blur-sm z-50 p-4 sm:p-6"
      onClick={(e) => {
        if (e.target == e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg sm:rounded-2xl border-2 font-manrope">
        {/* Header - Sticky */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-8 py-4 rounded-t-lg sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-semibold text-mainColor">
                Edit Task
              </h1>
              <p className="text-sm sm:text-base text-[#616161] font-medium mt-1">
                Update task details and assignment
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-4"
            >
              <X
                size={24}
                className="text-gray-600 hover:text-red-500 transition-colors"
              />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-8 py-6">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Field Selection */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-base sm:text-lg text-[#0D121C] font-semibold">
                  Field
                </label>
                <div className="relative group">
                  <Info size={16} className="text-gray-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Required • Select field for task
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
              {FieldNames && (
                <MenuElement
                  Items={FieldNames}
                  nameChange={FieldNames[index]}
                  setIndex={setIndex}
                  index={index}
                  onList={onList1}
                  width="100%"
                  setOnList={setOnList1}
                  Pformat={"text-[#0D121C] font-[400] text-sm sm:text-base"}
                />
              )}
            </div>

            {/* Assignment */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-base sm:text-lg text-[#0D121C] font-semibold">
                  Assign To
                </label>
                <div className="relative group">
                  <Info size={16} className="text-gray-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    Optional • Assign task to team member
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
              {memberNames.length > 0 && (
                <MenuElement
                  Items={memberNames}
                  nameChange={memberNames[memberIndex]}
                  setIndex={setMemberIndex}
                  index={memberIndex}
                  onList={onList4}
                  width="100%"
                  setOnList={setOnList4}
                  Pformat={"text-[#0D121C] font-[400] text-sm sm:text-base"}
                />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="title"
                    className="text-base sm:text-lg text-[#0D121C] font-semibold"
                  >
                    Title
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
                  id="title"
                  className={`w-full border-2 ${
                    formik.touched.title && formik.errors.title
                      ? "border-red-500 text-red-500"
                      : "border-[#9F9F9F]"
                  } rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-mainColor`}
                  placeholder="Enter task title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-red-500 text-sm">{formik.errors.title}</p>
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
                      Required • Task priority level
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
                  <p className="text-red-500 text-sm">
                    {formik.errors.itemPriority}
                  </p>
                )}
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="dueDate"
                    className="text-base sm:text-lg text-[#0D121C] font-semibold"
                  >
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
                  className={`w-full border-2 ${
                    formik.touched.dueDate && formik.errors.dueDate
                      ? "border-red-500 text-red-500"
                      : "border-[#9F9F9F]"
                  } rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-mainColor`}
                  name="dueDate"
                  value={formik.values.dueDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.dueDate && formik.errors.dueDate && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.dueDate}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
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
                {formik.touched.category && formik.errors.category && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.category}
                  </p>
                )}
              </div>
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
                className={`w-full border-2 ${
                  formik.touched.description && formik.errors.description
                    ? "border-red-500 text-red-500"
                    : "border-[#9F9F9F]"
                } rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-mainColor resize-none`}
                placeholder="Enter task description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-500 text-sm">
                  {formik.errors.description}
                </p>
              )}
            </div>

            {/* Server Error Display */}
            {serverError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm font-medium">
                  {serverError}
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions - Sticky */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-8 py-4 rounded-b-lg sm:rounded-b-2xl">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="order-2 sm:order-1 py-3 px-6 border border-[#616161] rounded-lg text-[#333333] text-sm sm:text-base hover:bg-mainColor hover:text-white hover:border-mainColor transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={formik.handleSubmit}
              disabled={isSubmitting}
              className="order-1 sm:order-2 flex-1 sm:flex-none py-3 px-8 border border-transparent rounded-lg bg-mainColor text-sm sm:text-base text-white hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-mainColor disabled:hover:text-white disabled:hover:border-transparent"
            >
              {isSubmitting ? "Updating..." : "Update Task"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditTask;
