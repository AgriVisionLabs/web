import { X, Calendar, MapPin, CircleCheckBig, User, Clock, Hand, UserRound } from "lucide-react";
import imageProfile from "../../assets/images/image 6.png";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { userContext } from "../../Context/User.context";
import DateDisplay from "../DateDisplay/DateDisplay";
import { AllContext } from "../../Context/All.context";
import toast from "react-hot-toast";

const ShowTask = (children) => {
  let { baseUrl } = useContext(AllContext);
  let { token, userId } = useContext(userContext);
  let [taskData, setTaskData] = useState();
  let Priority = ["Low", "Medium", "High"];
  let PriorityColor = ["#25C462", "#F4731C", "#F04444"];
  let Categories = [
    "Irrigation",
    "Fertilization", 
    "Planting/Harvesting",
    "Maintenance",
    "Inspection",
    "Pest & Health Control"
  ];
  
  // Display names for categories (for UI)
  const getCategoryDisplayName = (categoryName) => {
    if (categoryName === "PlantingOrHarvesting") return "Planting/Harvesting";
    if (categoryName === "PestAndHealthControl") return "Pest & Health Control";
    return categoryName;
  };
  let completedOrNot = [
    { color: "#0D121C", bg: "" },
    { color: "#25C462", bg: "" },
  ];

  async function getTasks() {
    if (!token) {
      console.error("No token available for authentication");
      return;
    }

    try {
      const options = {
        url: `${baseUrl}/farms/${children.farmData.farmId}/Tasks/${children.taskId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      setTaskData(data);
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  }
  useEffect(() => {
    getTasks();
  }, []);

  async function CompleteTask(farmId, taskId) {
    if (!token) {
      console.error("No token available for authentication");
      return;
    }

    try {
      const options = {
        url: `${baseUrl}/farms/${farmId}/Tasks/${taskId}/complete`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios(options);
      getTasks();
      toast.success("Task completed.");
    } catch (error) {
      if (error.status === 409) {
        toast.error("Unassigned and unclaimed tasks cannot be completed.");
      }
      console.error("Error completing task:", error);
    }
  }

  async function ClaimTask(farmId, taskId) {
    if (!token) {
      console.error("No token available for authentication");
      return;
    }

    try {
      const options = {
        url: `${baseUrl}/farms/${farmId}/Tasks/${taskId}/claim`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios(options);
      
      // Refresh task data to show updated assignment
      await getTasks();
      
      // Refresh parent component to update task list
      if (children.display) {
        children.display();
      }
      
      toast.success("Task claimed successfully. You can now complete it.");
    } catch (error) {
      console.error("Error claiming task:", error);
      
      // Handle specific error cases
      if (error.response) {
        const { status } = error.response;
        switch (status) {
          case 400:
            toast.error("This task cannot be claimed.");
            break;
          case 403:
            toast.error("You don't have permission to claim this task.");
            break;
          case 409:
            toast.error("This task has already been claimed or assigned.");
            break;
          default:
            toast.error("Failed to claim task. Please try again.");
        }
      } else {
        toast.error("Failed to claim task. Please try again.");
      }
    }
  }
  return (
    <>
      {taskData ? (
        <section
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 font-manrope z-50 p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              children.setDisplayTask(null);
            }
          }}
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg sm:rounded-2xl border-2 font-manrope">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-lg sm:rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-xl font-semibold text-[#0D121C] capitalize truncate">
                    {taskData.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#616161] font-medium mt-1">
                    Created on <DateDisplay dateStr={taskData.createdAt} /> by{" "}
                    {taskData.createdBy}
                  </p>
                </div>
                <button
                  onClick={() => children.setDisplayTask(null)}
                  className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2"
                >
                  <X size={24} className="text-gray-600 hover:text-red-500 transition-colors" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 sm:px-6 py-6 space-y-6">
              {/* Description */}
              <div className="bg-[#F4F4F4] rounded-lg p-4 max-h-24 overflow-y-auto">
                <p className="text-sm sm:text-base font-medium break-words">
                  {taskData.description || "No description provided"}
                </p>
              </div>

              {/* Task Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-bold text-[#616161]">Field</p>
                  <div className="flex items-center space-x-2 font-semibold">
                    <MapPin size={16} className="flex-shrink-0" />
                    <p className="text-sm text-[#0D121C] truncate">
                      {children.farmData.name} - {taskData.fieldName}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-bold text-[#616161]">Category</p>
                  <div className="flex items-center space-x-2 font-semibold">
                    <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></div>
                    <p className="text-sm text-[#0D121C]">
                      {Categories[taskData.category]}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-bold text-[#616161]">Due Date</p>
                  <div className="flex items-center space-x-2 font-semibold">
                    <Calendar size={16} className="flex-shrink-0" />
                    <p className="text-sm text-[#0D121C]">
                      {taskData.dueDate ? <DateDisplay dateStr={taskData.dueDate} /> : "No due date"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-bold text-[#616161]">Priority</p>
                  <div
                    className="inline-flex items-center space-x-2 font-semibold rounded-lg px-3 py-1"
                    style={{ backgroundColor: PriorityColor[taskData.itemPriority] }}
                  >
                    <p className="text-sm text-white capitalize">
                      {Priority[taskData.itemPriority]}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <p className="text-sm font-bold text-[#616161]">Status</p>
                  <div className="inline-flex items-center space-x-2 font-semibold rounded-lg border-2 border-[#0d121c61] px-3 py-1">
                    <p
                      className={`text-sm ${
                        taskData.completedAt ? 'text-[#25C462]' : 'text-[#0D121C]'
                      } capitalize`}
                    >
                      {taskData.completedAt ? "completed" : "not completed"}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Timeline Section */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="text-base font-semibold text-[#0D121C]">Timeline</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                    <span className="text-[#616161] font-medium">Created:</span>
                    <span className="text-[#0D121C] text-xs sm:text-sm">
                      <DateDisplay dateStr={taskData.createdAt} /> by {taskData.createdBy}
                    </span>
                  </div>
                  {taskData.assignedTo && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <span className="text-[#616161] font-medium">Assigned:</span>
                      <span className="text-[#0D121C] text-xs sm:text-sm">
                        <DateDisplay dateStr={taskData.assignedAt} /> to {taskData.assignedTo}
                      </span>
                    </div>
                  )}
                  {taskData.claimedBy && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <span className="text-[#616161] font-medium">Claimed:</span>
                      <span className="text-[#0D121C] text-xs sm:text-sm">
                        <DateDisplay dateStr={taskData.claimedAt} /> by {taskData.claimedBy}
                      </span>
                    </div>
                  )}
                  {taskData.completedAt && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <span className="text-[#616161] font-medium">Completed:</span>
                      <span className="text-[#0D121C] text-xs sm:text-sm">
                        <DateDisplay dateStr={taskData.completedAt} />
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Assignment Section */}
              <div className="border-t border-b border-[#9F9F9F] py-4">
                <h3 className="text-[#616161] text-base font-semibold mb-3">
                  {taskData.assignedTo ? "Assigned To" : taskData.claimedBy ? "Claimed By" : "Assignment Status"}
                </h3>
                <div className="flex items-center space-x-4">
                  <img src={imageProfile} alt="" className="w-10 h-10 rounded-full flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="capitalize text-[#0D121C] text-base font-bold truncate">
                      {taskData.assignedTo || taskData.claimedBy || "Not assigned"}
                    </p>
                    <p className="text-[#616161] text-sm font-medium capitalize">
                      {taskData.assignedTo ? "Assigned Member" : taskData.claimedBy ? "Claimed Member" : "Unassigned"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              <div className="space-y-4">
                <h3 className="text-[#616161] text-base font-semibold">Actions</h3>
                
                {/* Status Messages */}
                {(() => {
                  // Task is assigned to someone else
                  if (taskData.assignedToId && taskData.assignedToId !== userId) {
                    return (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-yellow-800 text-sm font-medium">
                          This task is assigned to {taskData.assignedTo}. Only the assigned person can mark it as complete.
                        </p>
                      </div>
                    );
                  }
                  
                  // Task is assigned to current user
                  if (taskData.assignedToId === userId) {
                    return (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-blue-800 text-sm font-medium">
                          This task is assigned to you. You can mark it as complete.
                        </p>
                      </div>
                    );
                  }
                  
                  // Task is claimed by someone else
                  if (!taskData.assignedToId && taskData.claimedById && taskData.claimedById !== userId) {
                    return (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <p className="text-orange-800 text-sm font-medium">
                          This task has been claimed by {taskData.claimedBy}. Only they can complete it now.
                        </p>
                      </div>
                    );
                  }
                  
                  // Task is claimed by current user
                  if (!taskData.assignedToId && taskData.claimedById === userId) {
                    return (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-green-800 text-sm font-medium">
                          You have claimed this task. You can now complete it.
                        </p>
                      </div>
                    );
                  }
                  
                  // Task is claimable by current user (not assigned, not claimed, not created by user)
                  if (!taskData.assignedToId && !taskData.claimedById && taskData.createdById !== userId) {
                    return (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-blue-800 text-sm font-medium">
                          This task is not assigned to anyone. You can claim it to work on it.
                        </p>
                      </div>
                    );
                  }
                  
                  // Task is created by current user but not assigned or claimed
                  if (!taskData.assignedToId && !taskData.claimedById && taskData.createdById === userId) {
                    return (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-gray-600 text-sm font-medium">
                          This task is not assigned to anyone. As the creator, you cannot claim your own task.
                        </p>
                      </div>
                    );
                  }
                  
                  return null;
                })()}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4 rounded-b-lg sm:rounded-b-2xl">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Complete button - Only for assigned user OR claimer (not completed) */}
                {!taskData.completedAt && (
                  (taskData.assignedToId === userId) || 
                  (!taskData.assignedToId && taskData.claimedById === userId)
                ) && (
                  <button
                    type="button"
                    className="flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-lg bg-mainColor text-white hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium"
                    onClick={() => {
                      CompleteTask(taskData.farmId, taskData.id);
                    }}
                  >
                    <CircleCheckBig size={16} />
                    <span>Mark Complete</span>
                  </button>
                )}
                
                {/* Claimed by someone else - Show disabled state */}
                {!taskData.assignedToId && taskData.claimedById && taskData.claimedById !== userId && !taskData.completedAt && (
                  <button
                    type="button"
                    disabled
                    className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed font-medium"
                  >
                    <Hand size={16} />
                    <span>Claimed by {taskData.claimedBy}</span>
                  </button>
                )}
                
                {/* Assigned to someone else - Show disabled state */}
                {taskData.assignedToId && taskData.assignedToId !== userId && !taskData.completedAt && (
                  <button
                    type="button"
                    disabled
                    className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed font-medium"
                  >
                    <UserRound size={16} />
                    <span>Assigned to {taskData.assignedTo}</span>
                  </button>
                )}
                
                {/* Claim button - Only for unassigned, unclaimed tasks (not by creator) */}
                {!taskData.assignedToId && !taskData.claimedById && !taskData.completedAt && taskData.createdById !== userId && (
                  <button
                    type="button"
                    className="flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-lg bg-blue-600 text-white hover:bg-transparent hover:text-blue-600 hover:border-blue-600 transition-all duration-300 font-medium"
                    onClick={() => {
                      ClaimTask(taskData.farmId, taskData.id);
                    }}
                  >
                    <Hand size={16} />
                    <span>Claim Task</span>
                  </button>
                )}

                {/* Cancel button */}
                <button
                  type="button"
                  className="order-last sm:order-none flex items-center justify-center py-3 px-4 border border-[#616161] rounded-lg text-[#333333] hover:bg-mainColor hover:text-white hover:border-mainColor transition-all duration-300 font-semibold"
                  onClick={() => {
                    children.setDisplayTask(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};

export default ShowTask;
