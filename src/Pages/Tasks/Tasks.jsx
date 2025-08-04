import { motion } from "framer-motion";
import {
  Calendar,
  CircleCheckBig,
  Edit3,
  Eye,
  Hand,
  MapPin,
  Plus,
  Trash2,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AllContext } from "../../Context/All.context";
import MenuElement from "../../Components/MenuElement/MenuElement";
import ShowTask from "../../Components/ShowTask/ShowTask";
import NewTask from "../../Components/NewTask/NewTask";
import EditTask from "../../Components/EditTask/EditTask";
import { userContext } from "../../Context/User.context";
import axios from "axios";
import DateDisplay from "../../Components/DateDisplay/DateDisplay";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";

const Tasks = () => {
  const { getPart, baseUrl } = useContext(AllContext);
  const { token, userId } = useContext(userContext);
  const [partsDetection, setPartsDetection] = useState("All Tasks");
  const [Farms, setFarms] = useState([]);
  const [index, setIndex] = useState(0);
  const [taskId, setTaskId] = useState();
  const [DisplayTask, setDisplayTask] = useState(null);
  const [CreateTask, setCreateTask] = useState(null);
  const [EditTaskModal, setEditTaskModal] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [FarmNames, setFarmNames] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoadingFarms, setIsLoadingFarms] = useState(true);
  const Priority = ["Low", "Medium", "High"];
  const PriorityColor = ["#25C462", "#F4731C", "#F04444"];

  const [completedTasks, setCompletedTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [claimableTasks, setClaimableTasks] = useState([]);

  async function getFarms() {
    if (!token) {
      console.error("No token available for authentication");
      setIsLoadingFarms(false);
      return;
    }

    setIsLoadingFarms(true);
    try {
      const options = {
        url: `${baseUrl}/Farms`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      console.log({ data });

      // Filter out farms where user is an expert (experts cannot access tasks)
      const filteredFarms = data
        ? data.filter((farm) => farm.roleName?.toLowerCase() !== "expert")
        : [];

      setFarms(filteredFarms);
      console.log({ Farms: filteredFarms });

      if (filteredFarms.length > 0) {
        setFarmNames(
          filteredFarms.map((farm) => {
            return farm.name;
          })
        );
      }
    } catch (error) {
      console.error("Error fetching farms:", error);
      setFarms([]);
    } finally {
      setIsLoadingFarms(false);
    }
  }
  useEffect(() => {
    if (token) {
      getFarms();
    } else {
      setIsLoadingFarms(false);
    }
  }, [token]);

  async function getTasks() {
    if (!token || !Farms.length) {
      console.error("No token or farm data available");
      return;
    }

    console.log(Farms[index].farmId);

    try {
      const options = {
        url: `${baseUrl}/farms/${Farms[index].farmId}/Tasks`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      console.log(data);

      const currentUserRole = Farms[index]?.roleName?.toLowerCase();

      // Check if user is expert - experts cannot access tasks
      if (currentUserRole === "expert") {
        setTasks([]);
        setCompletedTasks([]);
        setMyTasks([]);
        setClaimableTasks([]);
        return;
      }

      // If user is a worker, only show tasks assigned to them and claimable tasks
      if (currentUserRole === "worker") {
        // Tasks assigned to the worker
        const assignedTasks = data
          ? data.filter((item) => item.assignedToId === userId)
          : [];
        
        // Claimable tasks (no assignedToId, not completed, not created by worker)
        const claimableTasks = data
          ? data.filter((item) => 
              !item.assignedToId && 
              !item.completedAt && 
              item.createdById !== userId
            )
          : [];

        setTasks([...assignedTasks, ...claimableTasks]);
        setCompletedTasks(
          assignedTasks.filter((item) => item.completedAt !== null)
        );
        setMyTasks(assignedTasks);
        setClaimableTasks(claimableTasks);
      } else if (currentUserRole === "owner" || currentUserRole === "manager") {
        // Owners and managers can see all tasks
        setTasks(data || []);
        setCompletedTasks(
          data ? data.filter((item) => item.completedAt !== null) : []
        );
        setMyTasks(
          data ? data.filter((item) => item.assignedToId === userId) : []
        );
        setClaimableTasks(
          data
            ? data.filter((item) => 
                !item.assignedToId && 
                !item.completedAt && 
                item.createdById !== userId
              )
            : []
        );
      }

      console.log("User role:", currentUserRole);
      console.log("All tasks:", data);
      console.log(
        "My tasks (assigned to current user):",
        data ? data.filter((item) => item.assignedToId === userId) : []
      );
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
      setCompletedTasks([]);
      setMyTasks([]);
      setClaimableTasks([]);
    }
  }

  useEffect(() => {
    if (Farms.length) {
      getTasks();

      // Set default tab based on user role
      const currentUserRole = Farms[index]?.roleName?.toLowerCase();
      if (currentUserRole === "worker") {
        setPartsDetection("All Tasks"); // Workers start with all tasks (their assigned tasks)
      } else {
        setPartsDetection("All Tasks"); // Others start with all tasks
      }
    }
  }, [Farms, index]);

  async function DeleteTask(farmId, taskId) {
    if (!token) {
      console.error("No token available for authentication");
      return;
    }

    try {
      const options = {
        url: `${baseUrl}/farms/${farmId}/Tasks/${taskId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios(options);
      getTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }
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
      const res = await axios(options);
      console.log(res);
      toast.success("Task completed.");

      getTasks();
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
      toast.success("Task claimed successfully. You can now complete it.");
      getTasks();
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

  // Handle edit task - Open edit modal
  function handleEditTask(task) {
    // Verify user is the creator
    if (task.createdById !== userId) {
      toast.error("You can only edit tasks you created.");
      return;
    }

    console.log("Opening edit modal for task:", {
      id: task.id,
      title: task.title,
      createdById: task.createdById,
      currentUserId: userId,
    });

    setTaskToEdit(task);
    setEditTaskModal(true);
  }

  // Handle edit task completion
  function handleEditTaskComplete() {
    setEditTaskModal(false);
    setTaskToEdit(null);
    getTasks(); // Refresh tasks list
  }

  // Show loading state
  if (isLoadingFarms) {
    return (
      <div className="transition-all duration-500 px-2 sm:px-3 lg:px-0">
        <Helmet>
          <title>Tasks</title>
        </Helmet>
        <div className="flex flex-col items-center justify-center py-16 sm:py-20">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-mainColor border-t-transparent"></div>
          </div>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Loading farms...
          </p>
        </div>
      </div>
    );
  }

  // Check if user is expert and show appropriate message
  if (Farms.length > 0 && Farms.every(farm => farm.roleName?.toLowerCase() === "expert")) {
    return (
      <div className="transition-all duration-500 px-2 sm:px-3 lg:px-0">
        <Helmet>
          <title>Tasks</title>
        </Helmet>
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <TriangleAlert
              size={32}
              className="sm:w-10 sm:h-10 text-gray-400"
            />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            Access Restricted
          </h3>
          <p className="text-sm text-gray-500 max-w-sm px-4">
            Experts don't have access to the tasks page. Please contact your farm manager for task assignments.
          </p>
        </div>
      </div>
    );
  }

  // Show no farms message
  if (Farms.length === 0 && !isLoadingFarms) {
    return (
      <div className="transition-all duration-500 px-2 sm:px-3 lg:px-0">
        <Helmet>
          <title>Tasks</title>
        </Helmet>
        <div className="h-[200px] rounded-md text-[18px] font-medium space-y-3 border-2 border-dashed border-[#0d121c21] mx-3 mt-20 flex flex-col justify-center items-center">
          <TriangleAlert size={48} className="text-yellow-500 mb-2" />
          <p className="text-[#808080]">No Accessible Farms</p>
          <p className="text-[#1f1f1f96] text-[16px] text-center px-4">
            No farms available for task management. You need owner or manager access to manage tasks.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Tasks</title>
      </Helmet>
      {Farms.length > 0 ? (
        <div className="transition-all duration-500 px-2 sm:px-3 lg:px-0">
          {/* Header Section - Mobile Responsive */}
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 items-start md:justify-between md:items-center mb-4 sm:mb-5 lg:mb-[20px]">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 justify-between md:items-center md:gap-x-12">
              <h1 className="text-lg sm:text-xl lg:text-[23px] font-semibold capitalize">
                Tasks
              </h1>
              <MenuElement
                Items={FarmNames}
                nameChange={FarmNames[index]}
                setIndex={setIndex}
                index={index}
                width={200 + "px"}
                className={"py-[6px]"}
                Pformat="text-[#0D121C] font-[400]"
              />
            </div>
            {/* Only show New Task button for owners and managers */}
            {["owner", "manager"].includes(
              Farms[index]?.roleName?.toLowerCase()
            ) && (
              <button
                className="w-full md:w-auto py-3 px-4 border border-transparent rounded-full bg-mainColor text-sm lg:text-[15px] text-white hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium"
                onClick={() => {
                  setCreateTask(true);
                }}
              >
                <div className="flex justify-center items-center space-x-2">
                  <Plus size={18} className="lg:w-[19px] lg:h-[19px]" />
                  <span className="capitalize">New Task</span>
                </div>
              </button>
            )}
          </div>

          {/* Tab Navigation - Mobile First */}
          <div className="mb-6 sm:mb-8 lg:mb-[52px]">
            <div className="overflow-x-auto pb-2">
              <div
                className="flex items-center gap-2 sm:gap-3 lg:gap-[20px] min-w-max px-1"
                id="parts"
                onClick={(e) => {
                  getPart(e.target);
                }}
              >
                <button
                  className={`flex-shrink-0 py-2 px-3 sm:py-3 sm:px-4 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium ${
                    partsDetection === "All Tasks"
                      ? "bg-mainColor text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setPartsDetection("All Tasks");
                  }}
                >
                  {Farms[index]?.roleName?.toLowerCase() === "worker"
                    ? "My"
                    : "All"}{" "}
                  ({tasks.length})
                </button>

                {/* Show My Tasks tab only for non-workers */}
                {Farms[index]?.roleName?.toLowerCase() !== "worker" && (
                  <button
                    className={`flex-shrink-0 py-2 px-3 sm:py-3 sm:px-4 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium ${
                      partsDetection === "My Tasks"
                        ? "bg-mainColor text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      setPartsDetection("My Tasks");
                    }}
                  >
                    Mine ({myTasks.length})
                  </button>
                )}

                <button
                  className={`flex-shrink-0 py-2 px-3 sm:py-3 sm:px-4 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium ${
                    partsDetection === "Claimable"
                      ? "bg-mainColor text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setPartsDetection("Claimable");
                  }}
                >
                  Claimable ({claimableTasks.length})
                </button>

                <button
                  className={`flex-shrink-0 py-2 px-3 sm:py-3 sm:px-4 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium ${
                    partsDetection === "completed tasks"
                      ? "bg-mainColor text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setPartsDetection("completed tasks");
                  }}
                >
                  Done ({completedTasks.length})
                </button>
              </div>
            </div>
          </div>

          {/* Tasks Grid - Mobile Optimized */}
          <div className="space-y-3">
            {(() => {
              let displayTasks = [];
              if (partsDetection === "completed tasks") {
                displayTasks = completedTasks;
              } else if (partsDetection === "My Tasks") {
                displayTasks = myTasks;
              } else if (partsDetection === "Claimable") {
                displayTasks = claimableTasks;
              } else {
                displayTasks = tasks; // "All Tasks" or "My Tasks" for workers
              }

              return displayTasks.length > 0 ? (
                displayTasks.map((task, taskIndex) => {
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: taskIndex * 0.02,
                        duration: 0.2,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      className="border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow duration-200 cursor-pointer"
                      onClick={(e) => {
                        if (!e.target.closest("button")) {
                          setTaskId(task.id);
                          setDisplayTask(true);
                        }
                      }}
                    >
                      <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                        {/* Left Section - Task Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {task.title}
                            </h3>
                            <span
                              className="px-2 py-1 rounded-full text-xs font-medium text-white flex-shrink-0"
                              style={{
                                backgroundColor:
                                  PriorityColor[task.itemPriority],
                              }}
                            >
                              {Priority[task.itemPriority]}
                            </span>
                            {task.completedAt ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex-shrink-0">
                                Completed
                              </span>
                            ) : (
                              (() => {
                                // Check if task is overdue (not completed and due date has passed)
                                const isOverdue =
                                  task.dueDate &&
                                  new Date(task.dueDate) < new Date();

                                if (isOverdue) {
                                  return (
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex-shrink-0">
                                      Overdue
                                    </span>
                                  );
                                } else if (task.assignedToId) {
                                  return (
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 flex-shrink-0">
                                      {task.assignedToId === userId
                                        ? "Assigned to you"
                                        : "Assigned"}
                                    </span>
                                  );
                                } else if (task.claimedById) {
                                  return (
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 flex-shrink-0">
                                      {task.claimedById === userId
                                        ? "Claimed by you"
                                        : "Claimed"}
                                    </span>
                                  );
                                } else {
                                  return (
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex-shrink-0">
                                      Available
                                    </span>
                                  );
                                }
                              })()
                            )}
                          </div>

                          <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              <span>
                                {FarmNames[index]} - {task.fieldName}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <DateDisplay dateStr={task.createdAt} />
                            </div>
                            <div className="flex items-center gap-1">
                              <UserRound size={14} />
                              <span>{task.createdBy}</span>
                            </div>
                          </div>

                          <p
                            className="text-sm text-gray-700"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {task.description}
                          </p>
                        </div>

                        {/* Right Section - Actions */}
                        <div className="flex items-center md:gap-2 md:ml-4">
                          {/* View button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setTaskId(task.id);
                              setDisplayTask(true);
                            }}
                            className="p-2 text-gray-500 hover:text-mainColor hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Task"
                          >
                            <Eye size={18} />
                          </button>

                          {/* Edit - Only for creators */}
                          {task.createdById === userId && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTask(task);
                              }}
                              className="p-2 text-gray-500 hover:text-mainColor hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit Task"
                            >
                              <Edit3 size={18} />
                            </button>
                          )}

                          {/* Delete - Only for creators */}
                          {task.createdById === userId && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                DeleteTask(task.farmId, task.id);
                              }}
                              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Task"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}

                          {/* Claim - Only for unassigned, unclaimed tasks (not by creator) */}
                          {!task.assignedToId &&
                            !task.claimedById &&
                            !task.completedAt &&
                            task.createdById !== userId && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  ClaimTask(task.farmId, task.id);
                                }}
                                className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Claim Task"
                              >
                                <Hand size={18} />
                              </button>
                            )}

                          {/* Complete - Only for assigned user OR claimer (not completed) */}
                          {!task.completedAt &&
                            ((task.assignedToId === userId) ||
                              (!task.assignedToId && task.claimedById === userId)) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  CompleteTask(task.farmId, task.id);
                                }}
                                className="p-2 text-gray-500 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                                title="Complete Task"
                              >
                                <CircleCheckBig size={18} />
                              </button>
                            )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="h-[200px] rounded-md text-[18px] font-medium space-y-3 border-2 border-dashed border-[#0d121c21] mx-3 mt-20 flex flex-col justify-center items-center">
                  <TriangleAlert size={48} className="text-yellow-500 mb-2" />
                  <p className="text-[#808080]">
                    {partsDetection === "My Tasks"
                      ? "No Tasks Assigned"
                      : partsDetection === "completed tasks"
                      ? "No Completed Tasks"
                      : partsDetection === "Claimable"
                      ? "No Claimable Tasks"
                      : Farms[index]?.roleName?.toLowerCase() === "worker"
                      ? "No Tasks Assigned"
                      : "No Tasks Available"}
                  </p>
                  <p className="text-[#1f1f1f96] text-[16px] text-center px-4">
                    {partsDetection === "My Tasks"
                      ? "No tasks have been assigned to you yet."
                      : partsDetection === "completed tasks"
                      ? "No completed tasks found for this farm."
                      : partsDetection === "Claimable"
                      ? "All tasks have been assigned or completed."
                      : Farms[index]?.roleName?.toLowerCase() === "worker"
                      ? "No tasks have been assigned to you yet."
                      : "No tasks found. Create your first task to get started."}
                  </p>
                </div>
              );
            })()}
          </div>
          {DisplayTask ? (
            <div className="fixed z-50 inset-0">
              <ShowTask
                setDisplayTask={setDisplayTask}
                taskId={taskId}
                farmData={Farms[index]}
              />
            </div>
          ) : null}
          {CreateTask ? (
            <div className="fixed z-50 inset-0">
              <NewTask
                setCreateTask={setCreateTask}
                farmData={Farms[index]}
                display={getTasks}
              />
            </div>
          ) : null}
          {EditTaskModal && taskToEdit ? (
            <div className="fixed z-50 inset-0">
              <EditTask
                task={taskToEdit}
                farmData={Farms[index]}
                setEditTaskModal={setEditTaskModal}
                onClose={() => {
                  setEditTaskModal(false);
                  setTaskToEdit(null);
                }}
                onUpdate={handleEditTaskComplete}
                display={getTasks}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default Tasks;
