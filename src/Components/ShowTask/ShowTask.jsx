import { X, Calendar, MapPin, CircleCheckBig } from "lucide-react";
import imageProfile from "../../assets/images/image 6.png";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { userContext } from "../../Context/User.context";
import DateDisplay from "../DateDisplay/DateDisplay";
import { AllContext } from "../../Context/All.context";
import toast from "react-hot-toast";

const ShowTask = (children) => {
  let { baseUrl } = useContext(AllContext);
  let { token } = useContext(userContext);
  let [taskData, setTaskData] = useState();
  let Priority = ["Low", "Medium", "High"];
  let PriorityColor = ["#25C462", "#F4731C", "#F04444"];
  let completedOrNot = [
    { color: "#0D121C", bg: "bg-[#fcfbfb00]" },
    { color: "#f5f5f7", bg: "bg-[#25C462]" },
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
  return (
    <>
      {taskData ? (
        <section
          className="inset-0 flex justify-center items-center bg-black bg-opacity-70 font-manrope absolute z-50 w-[100%]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              children.setDisplayTask(null);
            }
          }}
        >
          <div className="w-[700px] px-[40px] h-[730px] overflow-hidden border-2 rounded-2xl bg-white pt-[40px] pb-[10px] text-[#0D121C] font-manrope">
            <X
              size={33}
              className="ms-auto cursor-pointer hover:text-red-500 transition-all duration-150"
              onClick={() => {
                children.setDisplayTask(null);
              }}
            />
            <div className="mt-[16px] space-y-[8px] mb-[5px]">
              <h1 className="text-[25px] font-semibold capitalize">
                {taskData.title}
              </h1>
              <p className="text-[15px] text-[#616161] font-semibold">
                Created on <DateDisplay dateStr={taskData.createdAt} /> by{" "}
                {taskData.createdBy}.
              </p>
            </div>
            <div className="bg-[#F4F4F4] rounded-[15px] my-[18px] p-[24px] h-[80px] overflow-y-auto">
              <p className="text-[18px] capitalize font-medium">
                {taskData.description}
              </p>
            </div>
            <div className="grid grid-cols-2 space-y-[10px]">
              <div className="space-y-[8px]">
                <p className="text-[17px] font-bold text-[#616161]">Field</p>
                <div className="flex items-center space-x-2 font-semibold">
                  <MapPin />
                  <p className="text-[17px] text-[#0D121C]">
                    {children.farmData.name} - {taskData.fieldName}
                  </p>
                </div>
              </div>
              <div className="space-y-[8px]">
                <p className="text-[17px] font-bold text-[#616161]">Due Date</p>
                <div className="flex items-center space-x-2 font-semibold">
                  <Calendar />
                  <p className="text-[17px] text-[#0D121C]">
                    <DateDisplay dateStr={taskData.dueDate} />
                  </p>
                </div>
              </div>
              <div className="space-y-[8px]">
                <p className="text-[17px] font-bold text-[#616161]">Status</p>
                <div className="flex items-center space-x-2 font-semibold rounded-[15px] border-[2px] border-[#0d121c61] w-fit px-[12px] py-[4px]">
                  <p
                    className={`text-[17px] text-[${
                      completedOrNot[taskData.completedAt ? 1 : 0].color
                    }] ${
                      completedOrNot[taskData.completedAt ? 1 : 0].bg
                    } capitalize`}
                  >
                    {taskData.completedAt ? "completed" : "not completed"}
                  </p>
                </div>
              </div>
              <div className="space-y-[8px]">
                <p className="text-[17px] font-bold text-[#616161]">Priority</p>
                <div
                  className={`flex items-center space-x-2 font-semibold rounded-[15px] bg-[${
                    PriorityColor[taskData.itemPriority]
                  }] w-fit px-[12px] py-[4px]`}
                >
                  <p className="text-[17px] text-white capitalize">
                    {Priority[taskData.itemPriority]}
                  </p>
                </div>
              </div>
            </div>
            <div className="py-[18px] border-t-[2px] border-b-[2px] border-[#9F9F9F] my-[24px]">
              <h3 className="text-[#616161] text-[18px] font-semibold">
                Assigned To
              </h3>
              <div className="flex items-center space-x-[20px] my-[8px] px-[24px]">
                <img src={imageProfile} alt="" className="w-[50px]" />
                <div className="">
                  <p className="capitalize text-[#0D121C] text-[18px] font-bold">
                    {taskData.createdBy}
                  </p>
                  <p className="text-[#616161] text-[18px] font-medium capitalize">
                    manager
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-[8px]">
              <h3 className="text-[#616161] text-[18px] font-semibold mb-4">
                Actions
              </h3>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="py-[10px] px-[15px] border-[1px] border-transparent rounded-[12px] bg-mainColor text-[17px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium"
                  onClick={() => {
                    CompleteTask(taskData.farmId, taskData.id);
                  }}
                >
                  <div className="flex justify-center items-center space-x-[11px]">
                    <CircleCheckBig />
                    <p className="">Mark Complete</p>
                  </div>
                </button>
                <button
                  type="button"
                  className="py-[10px] px-[15px] border-[1px] border-[#616161] rounded-[12px] text-[#333333] text-[17px] hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-semibold"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      children.setDisplayTask(null);
                    }
                  }}
                >
                  <div className="flex justify-center items-center space-x-[11px]">
                    <p className="">Cancel</p>
                  </div>
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
