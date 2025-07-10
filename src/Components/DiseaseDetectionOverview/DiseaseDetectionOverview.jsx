import {
  Calendar,
  Camera,
  ChevronLeft,
  CircleCheckBig,
  Leaf,
  Search,
  User,
  Image,
  Eye,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Line } from "rc-progress";
import { useContext, useEffect, useState } from "react";
import { AllContext } from "../../Context/All.context";
import { motion } from "framer-motion";
import TimeOnly from "../TimeOnly/TimeOnly";
import DateDisplay from "../DateDisplay/DateDisplay";
import NewDetection from "../NewDetection/NewDetection";
import AfterDetection from "../AfterDetection/AfterDetection";
import Fields from "../../Pages/Fields/Fields";

const DiseaseDetectionOverview = (children) => {
  let { setDetectionPage, getPart } = useContext(AllContext);
  let [partsDetectionOverview, setPartsDetectionOverview] =useState("All Fields");
  let healthStatus=[{name:"Healthy",color:"#25C462"},{name:"At Risk",color:"#EBB212"},{name:"Infected",color:"#E13939"}]
  let isHealthy=[{name:"Healthy",color:"#25C462"},{name:"Infected",color:"#E13939"}]
  console.log("diseaseDetections",children.diseaseDetections,"field",children.field)
  let [page, setPage] =useState(null);
  let [Imagecheck, setImagecheck] = useState("");
  let [DataAfterDetection, setDataAfterDetection] = useState();
    // let {name ,cropName}=children.field
    // let {createdBy ,createdOn}=children.diseaseDetections[0]
  
  return (
    children.diseaseDetections&&children.field?<section className="font-manrope">
      <div className="flex space-x-[50px] items-center">
        <ChevronLeft
          size={40}
          className="text-[#616161] cursor-pointer hover:text-black transition-all duration-150"
          onClick={() => {
            setDetectionPage("DiseaseDetectionpage");
          }}
        />
        <div className="">
          <h1 className="text-[22px] font-semibold capitalize">{children.field.name}</h1>
          <div className="flex items-center space-x-[11px]">
            <Leaf className="text-mainColor  " />
            <h2 className="text-[#616161] text-[20px] font-semibold capitalize">
              {children.field.cropName}
            </h2>
          </div>
        </div>
      </div>
      <div className="mt-[30px] mb-[20px]">
        <div className="grid lg:grid-cols-3 gap-[40px]">
          <div className="col-span-2 min-h-[230px] border-[1px] border-[#9F9F9F] rounded-[15px] p-[15px]">
            <h3 className=" text-[#0D121C] text-[19px] font-semibold capitalize ">
              {" "}
              field Overview
            </h3>
            <div className="mt-[20px]">
              <div className="flex justify-between items-center text-[17px] text-[#0D121C] font-semibold my-[12px]">
                <p className="capitalize">{children.field.cropName} health</p>
                <p>{95}%</p>
              </div>
              <Line
                percent={95}
                strokeLinecap="round"
                strokeColor="#1E6930"
                className="h-[6.5px] text-mainColor w-full rounded-lg"
              />
            </div>
            <div className="grid lg:grid-cols-2 items-center mt-[20px] gap-y-[20px] lg:text-[17px]  text-[#616161] font-medium">
              <div className="flex items-center space-x-[10px]">
                <Calendar strokeWidth={1.8} size={22} />
                <p className=" capitalize">last inspection: <DateDisplay dateStr={children.diseaseDetections[0]?.createdOn}/></p>
              </div>
              <div className="flex items-center space-x-[10px]">
                <User strokeWidth={1.8} size={22} />
                <p className=" capitalize">{children.diseaseDetections[0]?children.diseaseDetections[0].createdBy:"No one"}</p>
              </div>
              <div className="flex items-center space-x-[10px]">
                <Search
                  className="rotate-[100deg]"
                  strokeWidth={1.8}
                  size={22}
                />
                <p className=" capitalize">total detection: {children.diseaseDetections?.length}</p>
              </div>
              <div className="flex items-center space-x-[10px]">
                {children.diseaseDetections[0]?.healthStatus==0?<CircleCheckBig
                  size={23}
                  strokeWidth={1.5}
                  className={`text-[${isHealthy[children.stateOverview?0:1].color}]`}
                  />:children.diseaseDetections[0]?.healthStatus==1?<XCircle
                  size={23}
                  strokeWidth={1.5}
                  className={`text-[${isHealthy[children.stateOverview?0:1].color}]`}
                  />:null}
                <p className=" capitalize">current status: {isHealthy[children.stateOverview?0:1].name}</p>
              </div>
            </div>
          </div>
          <div className="col-span-2 lg:col-span-1 min-h-[230px] border-[1px] border-[#9F9F9F] rounded-[15px] p-[15px]">
            <h3 className=" text-[#0D121C] text-[19px] font-semibold capitalize ">
              {" "}
              Actions
            </h3>
            <div className="mt-[35px] space-y-[25px]">
              <button
                type="button"
                className="py-[12px] px-[20px] border-[1px] w-full border-transparent rounded-[45px] bg-mainColor text-[17px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium"
                onClick={() => {}}
              >
                <div className="flex justify-center items-center space-x-[11px] w-full" onClick={()=>{
                  setPage("NewDetection")
                }}>
                  <Camera size={22} />
                  <p className=" capitalize">new detection</p>
                </div>
              </button>
              <button
                type="button"
                className="py-[12px] px-[20px] border-[1px] w-full rounded-[45px] text-mainColor text-[18px] border-mainColor  hover:bg-mainColor hover:text-[#FFFFFF]  transition-all duration-300 font-medium"
                onClick={() => {}}
              >
                <div className="flex justify-center items-center space-x-[11px] w-full">
                  <Leaf size={19} />
                  <p className=" capitalize">manage field</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="flex justify-between items-center">
          <h4 className="text-[19px] text-[#0D121C] font-medium capitalize">
            detection history
          </h4>
          <div className="flex items-center space-x-[18px] ">
            <h4 className="text-[19px] text-[#616161] font-medium capitalize">
              filter:{" "}
            </h4>
            <div
              className="flex items-center w-fit h-[70px] rounded-[10px] bg-[rgba(217,217,217,0.3)] space-x-[20px] px-[10px] text-[14px] sm:text-[15px]   font-medium "
              id="parts"
              onClick={(e) => {
                getPart(e.target);
              }}
            >
              <p
                className="py-[12px] px-[12px] bg-[#FFFFFF] text-mainColor rounded-[10px] cursor-pointer"
                onClick={() => {
                  setPartsDetectionOverview("All Fields");
                }}
              >
                All Fields
              </p>
              <p
                className="py-[12px] px-[12px]   rounded-[10px] cursor-pointer"
                onClick={() => {
                  setPartsDetectionOverview("Healthy");
                }}
              >
                Healthy
              </p>
              <p
                className="py-[12px] px-[12px]   rounded-[10px] cursor-pointer"
                onClick={() => {
                  setPartsDetectionOverview("At Risk");
                }}
              >
                At Risk
              </p>
              <p
                className="py-[12px] px-[12px]   rounded-[10px] cursor-pointer"
                onClick={() => {
                  setPartsDetectionOverview("Infected");
                }}
              >
                Infected
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-[30px] mt-[30px]">
          {children.diseaseDetections.map((item,index) => {
            return (
              <motion.div
                key={index}
                initial={{ x: 0, y: -50, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{
                  delay: index * 0.5,
                  duration: 0.8,
                  type: "spring",
                  bounce: 0.4,
                }}
              >
                <div
                  key={index}
                  className="flex items-center h-[80px] w-full rounded-[15px] border-[1px] border-[#9F9F9F] text-[16px] text-[#616161] font-medium "
                >
                  <div className="flex w-full justify-between items-center px-[30px]">
                    <div className="flex items-center space-x-[10px] ">
                      {item.healthStatus==0?<CircleCheckBig
                                size={26}
                                strokeWidth={1.5}
                                className={`text-[${healthStatus[item.healthStatus].color}]`}
                                />:item.healthStatus==1?
                                <AlertCircle
                                size={26}
                                strokeWidth={1.5}
                                className={`text-[${healthStatus[item.healthStatus].color}]`}
                                />:
                                <XCircle
                                size={26}
                                strokeWidth={1.5}
                                className={`text-[${healthStatus[item.healthStatus].color}]`}
                                />}
                      <div className="capitalize">
                        <p className="text-[#0D121C]">{healthStatus[item.healthStatus].name}</p>
                        <p className=""><DateDisplay dateStr={item.createdOn}/></p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-[10px] ">
                      <User strokeWidth={1.8} size={24} />
                      <p className=" capitalize">{item.createdBy}</p>
                    </div>
                    <div className="flex items-center space-x-[10px]">
                      <Image strokeWidth={1.8} size={24} />
                      <p className=" capitalize">image available</p>
                    </div>
                    <div className="flex items-center space-x-[30px]">
                      <h3 className={`bg-[${healthStatus[item.healthStatus].color}] rounded-[15px] px-[12px] py-[4px]  text-[#FFFFFF] capitalize`}>
                        {healthStatus[item.healthStatus].name}
                      </h3>
                      <Eye strokeWidth={1.8} size={24} onClick={()=>{
                        setDataAfterDetection(item)
                        setPage("AfterDetection")
                      }}/>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      { page =="NewDetection"?
      <div className=" fixed z-50 inset-0  transition-all duration-200 flex justify-center items-center bg-black bg-opacity-70 ">
        <NewDetection
                farmId={children.field.farmId}
                fieldId={children.field.id}
                Imagecheck={Imagecheck}
                setImagecheck={setImagecheck}
                setDataAfterDetection={setDataAfterDetection}
                page={page} setPage={setPage}
              />
        </div>:
        page =="AfterDetection"?<div className=" fixed z-50 inset-0  transition-all duration-200 flex justify-center items-center bg-black bg-opacity-70 ">
          <AfterDetection page={page} setPage={setPage} DataAfterDetection={DataAfterDetection} />
          </div>:null
          }
    </section>:null
  );
};
//<Fields farmId={clickFarm} />
export default DiseaseDetectionOverview;
