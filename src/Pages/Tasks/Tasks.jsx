import { motion } from "framer-motion";
import {
  Calendar,
  CircleCheckBig,
  Edit,
  EllipsisVertical,
  Eye,
  FileText,
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
import axios from "@axiosInstance";
import DateDisplay from "../../Components/DateDisplay/DateDisplay";
import toast from "react-hot-toast";
import EditTask from "../../Components/EditTask/EditTask";
const Tasks = () => {
  let { getPart, baseUrl,index,setIndex  } = useContext(AllContext);
  let { token } = useContext(userContext);
  let [partsDetection,setPartsDetection] =useState("All Tasks");
  let [Farms, setFarms] = useState([]);
  // let [index, setIndex] = useState(0);
  let [taskId, setTaskId] = useState();
  let [DisplayTask, setDisplayTask] = useState(null);
  let [CreateTask, setCreateTask] = useState(null);
  let [editTask, setEditTask] = useState(null);
  let [FarmNames, setFarmNames] = useState([]);
  let [tasks, setTasks] = useState([]);
  let [search, setSearch] = useState(1);
  
  let Priority = ["Low", "Medium", "High"];
  let PriorityColor = ["#25C462", "#F4731C", "#F04444"];

  async function getFarms() {
    console.log(token);
    try {
      const options = {
        url: `${baseUrl}/Farms`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      if (data) {
        setFarmNames(
          data.map((farm) => {
            return farm.name;
          })
        );
        setFarms(data);
        // console.log(data);
      }
    } catch (error) {
      if(error.response.data){
        if(error.response.data.errors.length>0){toast.error(error.response.data.errors[0].description);}
        else{toast.error("There is an error");}
      }else{console.log(error)}
    }
  }
  useEffect(() => {
    getFarms();
  }, []);

  async function getTasks() {
    try {
      const options = {
        url: `${baseUrl}/farms/${Farms[index].farmId}/Tasks`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      console.log("getTask",data)
      setTasks(data);
    } catch (error) {
      // toast.error("Incorrect email or password "+error);
      console.log(error);
    }
  }
  useEffect(() => {
    getTasks();
  }, [index,Farms]);

  async function DeleteTask(farmId, taskId) {
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
      console.log(error);
    }
  }
  async function CompleteTask(farmId, taskId) {
    try {
      const options = {
        url: `${baseUrl}/farms/${farmId}/Tasks/${taskId}/complete`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let { data } = await axios(options);
      console.log("CompleteTask", data);
      getTasks();

    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      {Farms.length!=0? (
        <div className="transition-all duration-500 ">
          <div className="flex justify-between items-center mb-[20px]">
            <p className="text-[23px] font-semibold capitalize">Tasks</p>
            <div className="flex justify-center">
              <button
                className={`py-2 px-5 border-[1px] border-transparent rounded-[45px] text-[15px] text-[#FFFFFF]    ${["Owner","Maneger"].includes(Farms[index].roleName)?"bg-mainColor  hover:text-mainColor hover:border-mainColor  hover:bg-transparent":" bg-mainColor/40 cursor-default"} transition-all duration-300 font-medium`}
                onClick={() => {
                  if(["Owner","Maneger"].includes(Farms[index].roleName)){
                  setCreateTask(true);}
                }}
              >
                <div className="flex justify-center items-center space-x-[10px]">
                  <Plus size={19} />
                  <p className=" capitalize">new task</p>
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
          {tasks.length!=0?<>
          <div
            className="flex items-center w-fit h-[70px] rounded-[10px] bg-[rgba(217,217,217,0.3)] space-x-[20px] px-[10px] text-[14px] md:text-[15px]      font-medium mb-[52px]"
            id="parts"
            onClick={(e) => {
              getPart(e.target);
            }}
          >
            <p
              className="py-[12px] px-[12px] bg-[#FFFFFF] text-mainColor rounded-[10px] cursor-pointer "
              onClick={() => {
                setPartsDetection("All Tasks");
                setSearch(1)
              }}
            >
              All Tasks
            </p>
            <p
              className="py-[12px] px-[12px]   rounded-[10px] cursor-pointer text-[#9F9F9F]"
              onClick={() => {
                setPartsDetection("My Tasks");
                setSearch(2)
              }}
            >
              My Tasks
            </p>
            <p
              className="py-[12px] px-[12px]   rounded-[10px] cursor-pointer text-[#9F9F9F]"
              onClick={() => {
                setPartsDetection("completed tasks");
                setSearch(3)
              }}
            >
              completed tasks
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  gap-[28px] font-manrope">
            {tasks?.filter((task)=> ((search==1&&task.createdById==localStorage.getItem("userId"))||(search==2&&task.completedAt!=null)||search==2)).map((task, taskIndex) => {
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
                  className="rounded-[15px] border-[1px]  border-[rgba(13,18,28,0.25)]"
                >
                  <div className=" font-manrope">
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
                      <p className=" font-semibold capitalize">
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
                      <div className="flex justify-between items-center space-x-2  font-medium  ">
                        <UserRound  size={20} />
                        <p className="text-black font-semibold">
                          {task.createdBy}
                        </p>
                      </div>
                    </div>
                    <div className="border-t-[1px] border-[rgba(13,18,28,0.25)] py-[24px] mt-[24px]">
                      <div className="px-[24px] flex justify-between items-center  text-[#0D121C]">
                        {/* <Eye
                          size={23}
                          className="bg- cursor-pointer "
                          onClick={() => {
                            setTaskId(task.id);
                            setDisplayTask(true);

                            // setSchedule("ShowSensorUnit")
                          }}
                        /> */}
                        <CircleCheckBig
                            size={23}
                            className={` ${Farms[index].roleName=="Worker"?"cursor-pointer text-[#25C462]":"cursor-default text-[#25c4625c]"}`}
                            onClick={() => {
                              if(Farms[index].roleName=="Worker"){CompleteTask(task.farmId, task.id);}
                            }}
                          />
                        <div className=" flex items-center space-x-3">
                          {/* <Trash2
                            size={23}
                            className=" cursor-pointer text-[#dc3636]"
                            onClick={() => {
                              DeleteTask(task.farmId, task.id);
                            }}
                          /> */}
                          <div className=" relative ">
                            <EllipsisVertical className=" cursor-pointer" onClick={(e)=>{e.currentTarget.nextElementSibling.classList.toggle("hidden")}}/>
                            <div className=" absolute -left-14 top-8 flex-1  rounded-[15px] text-[#0D121C] bg-[#FFFFFF] border border-[#0d121c4f] py-[4px] px-[8px] hidden w-[150px] ">
                              <div className="flex items-center space-x-2 py-[5px] cursor-pointer" onClick={() => {
                                    setTaskId(task.id);
                                    setDisplayTask(true);
                                  }}>
                                <FileText
                                  strokeWidth={1.5}
                                  size={20}
                                  className=" "
                                  />
                                  <p className="">View details</p>
                              </div>
                              <div className={`flex items-center space-x-2 py-[5px] ${["Owner","Maneger"].includes(Farms[index].roleName)?" cursor-pointer":"text-[#4f4d4dbb] cursor-default"}`} onClick={() => {
                                    if(["Owner","Maneger"].includes(Farms[index].roleName)){setTaskId(task.id);
                                    setEditTask(true)}
                                  }} >
                                <Edit
                                  strokeWidth={1.5}
                                  size={20}
                                  className=" X "
                                  />
                                  <p className="">Edit</p>
                              </div>
                              <div className={`flex items-center space-x-2 py-[5px] ${["Owner","Maneger"].includes(Farms[index].roleName)?" cursor-pointer text-[#dc3636]":"text-[#4f4d4dbb] cursor-default"}`}onClick={() => {
                                    if(["Owner","Maneger"].includes(Farms[index].roleName)){DeleteTask(task.farmId, task.id);}
                                  }}>
                                <Trash2
                                  strokeWidth={1.5}
                                  size={20}
                                  className=" "
                                  
                                />
                                <p className="">Delete</p>
                              </div>
                            </div>
                          </div>                          
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          </>:
          <div className="h-[40px]  flex justify-center items-center">
        <p className="text-[17px] text-[#333333] w-[480px] text-center font-medium">You don’t have any tasks yet</p>
      </div>}
      {DisplayTask ? (
            <div className="fixed z-50 inset-0 ">
              <ShowTask
                setDisplayTask={setDisplayTask}
                taskId={taskId}
                farmData={Farms[index]}
              />
            </div>
          ) : null}
      {CreateTask ? (
            <div className="fixed z-50 inset-0">
              <NewTask setCreateTask={setCreateTask} farmData={Farms[index]}  getTasks={getTasks} />
            </div>
          ) : null}
          {editTask ? (
            <div className="fixed z-50 inset-0">
              <EditTask setEditTask={setEditTask} taskId={taskId} farmData={Farms[index]}  getTasks={getTasks} />
            </div>
          ) : null}
        </div>
      ) :<div className="h-[80%]  flex justify-center items-center">
        <p className="text-[17px] text-[#333333] w-[480px] text-center font-medium">You don’t have any farms yet</p>
      </div>}
    </>
  );
};

export default Tasks;
