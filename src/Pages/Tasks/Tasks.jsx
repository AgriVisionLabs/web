import { motion } from "framer-motion";
import {
  Calendar,
  CircleCheckBig,
  Eye,
  MapPin,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AllContext } from "../../Context/All.context";
import MenuElement from "../../Components/MenuElement/MenuElement";
import ShowTask from "../../Components/ShowTask/ShowTask";
import NewTask from "../../Components/NewTask/NewTask";
import { userContext } from "../../Context/User.context";
import axios from "axios";
import DateDisplay from "../../Components/DateDisplay/DateDisplay";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";

const Tasks = () => {
  const { getPart, baseUrl } = useContext(AllContext);
  const { token } = useContext(userContext);
  const [partsDetection, setPartsDetection] = useState("All Tasks");
  const [Farms, setFarms] = useState([]);
  const [index, setIndex] = useState(0);
  const [taskId, setTaskId] = useState();
  const [DisplayTask, setDisplayTask] = useState(null);
  const [CreateTask, setCreateTask] = useState(null);
  const [FarmNames, setFarmNames] = useState([]);
  const [tasks, setTasks] = useState([]);
  const Priority = ["Low", "Medium", "High"];
  const PriorityColor = ["#25C462", "#F4731C", "#F04444"];

  const [completedTasks, setCompletedTasks] = useState([]);

  async function getFarms() {
    if (!token) {
      console.error("No token available for authentication");
      return;
    }

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
      setFarms(data);
      console.log({ Farms });

      if (data) {
        setFarmNames(
          data.map((farm) => {
            return farm.name;
          })
        );
      }
    } catch (error) {
      console.error("Error fetching farms:", error);
    }
  }
  useEffect(() => {
    getFarms();
  }, []);

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

      setTasks(data);

      setCompletedTasks(data.filter((item) => item.completedAt !== null));
      console.log(completedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  useEffect(() => {
    if (Farms.length) {
      getTasks();
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
  return (
    <>
      <Helmet>
        <title>Tasks</title>
      </Helmet>
      {Farms.length > 0 ? (
        <div className="transition-all duration-500">
          <div className="flex justify-between items-center mb-[20px]">
            <p className="text-[23px] font-semibold capitalize">Tasks</p>
            <div className="flex justify-center">
              <button
                className="py-2 px-5 border-[1px] border-transparent rounded-[45px] bg-mainColor text-[15px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium"
                onClick={() => {
                  setCreateTask(true);
                }}
              >
                <div className="flex justify-center items-center space-x-[10px]">
                  <Plus size={19} />
                  <p className="capitalize">new task</p>
                </div>
              </button>
            </div>
          </div>
          <div className="flex space-x-[20px] mb-[20px]">
            <MenuElement
              Items={FarmNames}
              nameChange={FarmNames[index]}
              setIndex={setIndex}
              index={index}
              width={218 + "px"}
              Pformat={"text-[#0D121C] font-[400]"}
            />
          </div>
          <div
            className="flex items-center w-fit h-[70px] rounded-[10px] bg-[rgba(217,217,217,0.3)] space-x-[20px] px-[10px] text-[14px] md:text-[15px] font-medium mb-[52px]"
            id="parts"
            onClick={(e) => {
              getPart(e.target);
            }}
          >
            <p
              className="py-[12px] px-[12px] bg-[#FFFFFF] text-mainColor rounded-[10px] cursor-pointer"
              onClick={() => {
                setPartsDetection("All Tasks");
              }}
            >
              All Tasks
            </p>
            <p
              className="py-[12px] px-[12px] rounded-[10px] cursor-pointer text-[#9F9F9F]"
              onClick={() => {
                setPartsDetection("My Tasks");
              }}
            >
              My Tasks
            </p>
            <p
              className="py-[12px] px-[12px] rounded-[10px] cursor-pointer text-[#9F9F9F]"
              onClick={() => {
                setPartsDetection("completed tasks");
              }}
            >
              completed tasks
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[28px] font-manrope">
            {/* {partsDetection === "completed tasks" ? completedTasks : tasks} */}
            {tasks.length > 0 ? (
              (partsDetection === "completed tasks"
                ? completedTasks
                : tasks
              ).map((task, taskIndex) => {
                return (
                  <motion.div
                    key={taskIndex}
                    initial={{ x: 300, y: 0, opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: 1 }}
                    transition={{
                      delay: taskIndex * 0.5,
                      duration: 0.8,
                      type: "spring",
                      bounce: 0.4,
                    }}
                    className="rounded-[15px] border-[1px] border-[rgba(13,18,28,0.25)]"
                  >
                    <div className="font-manrope">
                      <div className="pt-[24px] px-[24px] mb-[20px] flex justify-between items-center">
                        <div className="flex items-center space-x-[10px]">
                          <h3 className="text-[17px] font-semibold capitalize">
                            {task.title}
                          </h3>
                        </div>
                        <h3
                          className={`bg-[${
                            PriorityColor[task.itemPriority]
                          }] rounded-[15px] px-[12px] py-[4px] text-[13px] font-semibold text-[#FFFFFF] capitalize`}
                        >
                          {Priority[task.itemPriority]}
                        </h3>
                      </div>
                      <div className="px-[24px] flex items-center space-x-[8px] text-[16px] text-[#9F9F9F]">
                        <MapPin size={20} className="" />
                        <p className="font-semibold capitalize">
                          {FarmNames[index]} - {task.fieldName}
                        </p>
                      </div>
                      <div className="flex px-[24px] text-[16px] col-span-3 space-x-[8px] h-[100px] mt-5">
                        <p className="text-black font-semibold">
                          {task.description}
                        </p>
                      </div>
                      <div className="mt-2 px-[28px] flex justify-between items-center text-[16px] text-[#332b2b] font-manrope">
                        <div className="space-x-2 flex align-middle">
                          <Calendar size={20} />
                          <p className="text-black font-semibold">
                            <DateDisplay dateStr={task.createdAt} />
                          </p>
                        </div>
                        <div className="flex justify-between items-center space-x-2 font-medium">
                          <UserRound size={20} />
                          <p className="text-black font-semibold">
                            {task.createdBy}
                          </p>
                        </div>
                      </div>
                      <div className="border-t-[1px] border-[rgba(13,18,28,0.25)] py-[24px] mt-[24px]">
                        <div className="px-[24px] flex justify-between items-center text-[#0D121C]">
                          <Eye
                            size={23}
                            className="cursor-pointer"
                            onClick={() => {
                              setTaskId(task.id);
                              setDisplayTask(true);
                              // setSchedule("ShowSensorUnit")
                            }}
                          />
                          <div className="flex items-center space-x-3">
                            <Trash2
                              size={23}
                              className="cursor-pointer text-[#dc3636]"
                              onClick={() => {
                                DeleteTask(task.farmId, task.id);
                              }}
                            />
                            <CircleCheckBig
                              size={23}
                              className="cursor-pointer text-[#25C462]"
                              onClick={() => {
                                CompleteTask(task.farmId, task.id);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <p className="text-lg font-medium w-full text-center">No Tasks</p>
            )}
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
        </div>
      ) : (
        <p>No Farms</p>
      )}
    </>
  );
};

export default Tasks;
