import { Calendar, Camera, CircleAlert, CircleCheckBig, Leaf, User} from "lucide-react";
import { useContext, useState } from "react";
import MenuElement from "../MenuElement/MenuElement";
import { AllContext } from "../../Context/All.context";
import { Line } from "rc-progress";
import { motion } from "framer-motion";
import NewDetection from "../NewDetection/NewDetection";
import AfterDetection from "../AfterDetection/AfterDetection";

const DiseaseDetection = () => {
        let {onListDisDet,setOnListDisDet,detection,setDetection,setDetectionPage,getPart}=useContext(AllContext)
        let [partsDetection,setPartsDetection]=useState("All Fields");
        var forms=[1,2,3,4,5];
        const cards=[1,2,3,4];
    return (<>
                <div className="  px-3 ">
                    <div className=" mt-[70px] mb-[35px] flex items-center space-x-[15px]">
                        <p className="text-[28px] text-[#0D121C] font-semibold font-manrope ">Disease Detection</p>
                        <CircleAlert strokeWidth={3} size={25}/>
                    </div>
                    <div className=" flex space-x-[20px] mb-[44px]">
                        <MenuElement Items={forms} name={"green farm"} width={300+"px"} onList={onListDisDet} setOnList={setOnListDisDet}/>
                        <form action="" className="">
                            <input type="text" placeholder="Search Fields or crops ..." className=" text-[14px] sm:text-[16px]   text-[#616161] font-[400] font-manrope h-[45px]  py-[8px] px-[22px] rounded-[8px] border-[1px] border-[#D9D9D9] w-[200px] sm:w-[300px] md:w-[400px] focus:outline-mainColor" />
                        </form>
                    </div>
                    <div className="flex items-center w-fit h-[70px] rounded-[10px] bg-[rgba(217,217,217,0.3)] space-x-[20px] px-[10px] text-[14px] sm:text-[16px]   font-medium mb-[52px]" id="parts" onClick={(e)=>{
                        getPart(e.target)
                    }}>
                        <p className="py-[12px] px-[12px] bg-[#FFFFFF] text-mainColor rounded-[10px] cursor-pointer" onClick={()=>{setPartsDetection("All Fields")}}>All Fields</p>
                        <p className="py-[12px] px-[12px]   rounded-[10px] cursor-pointer" onClick={()=>{setPartsDetection("Healthy")}}>Healthy</p>
                        <p className="py-[12px] px-[12px]   rounded-[10px] cursor-pointer" onClick={()=>{setPartsDetection("At Risk")}}>At Risk</p>
                        <p className="py-[12px] px-[12px]   rounded-[10px] cursor-pointer" onClick={()=>{setPartsDetection("Infected")}}>Infected</p>

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-[28px] font-manrope">
                                {cards.map((index)=>{
                                        return <motion.div
                                        key={index}
                                        initial={{ x: 300, y: -50, opacity: 0 }}
                                        animate={{ x: 0, y: 0, opacity: 1 }}
                                        transition={{
                                            delay: index * 0.5,
                                            duration: 0.8,
                                            type: "spring",
                                            bounce: 0.4,
                                        }}
                                            className="rounded-[15px] border-[1px] border-[rgba(13,18,28,0.25)]"
                                        >
                                            <div className="p-[24px]" onClick={()=>{setDetectionPage("DiseaseDetectionOverviewpage")}}>
                                                <div className="mb-[20px] flex justify-between items-center">
                                                <h3 className="text-[20px] font-bold capitalize">field {index + 1}</h3>
                                                <h3 className="bg-[#25C462] rounded-[15px] px-[12px] py-[4px] text-[16px] font-semibold text-[#FFFFFF] capitalize">healthy</h3>
                                                </div>
                                                <div className="flex items-center space-x-[8px]">
                                                <Leaf className="text-mainColor" />
                                                <p className="text-[18px] text-[#9F9F9F] font-semibold">corn</p>
                                                </div>
                                                <div className="mt-2">
                                                <div className="flex justify-between items-center text-[17px] font-medium my-[12px]">
                                                    <p className="capitalize">crop health</p>
                                                    <p>{95}%</p>
                                                </div>
                                                <Line percent={95} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full rounded-lg" />
                                                </div>
                                                <div className="text-[17px] font-medium my-[24px] border-b-[1px] border-[#9F9F9F]">
                                                <h3 className="capitalize">recent detections</h3>
                                                <div className="mt-[12px] pb-[24px] space-y-[12px]">
                                                    {[1, 2, 3].map((_, i) => (
                                                    <div key={i} className="flex justify-between items-center">
                                                        <div className="flex items-center space-x-[8px]">
                                                        <CircleCheckBig size={20} strokeWidth={1.5} className="text-[#25C462]" />
                                                        <p className="text-[16px] capitalize">15 mar, 2025</p>
                                                        </div>
                                                        <h3 className="bg-[#25C462] rounded-[15px] px-[12px] py-[4px] text-[16px] font-semibold text-[#FFFFFF] capitalize">healthy</h3>
                                                    </div>
                                                    ))}
                                                </div>
                                                </div>
                                                <div className="text-[#9F9F9F] space-y-[18px]">
                                                <div className="flex items-center space-x-[7px]">
                                                    <Calendar />
                                                    <p className="capitalize">last: 15 mar, 2025</p>
                                                </div>
                                                <div className="flex items-center space-x-[7px]">
                                                    <User />
                                                    <p className="capitalize">by: hussein mohamed</p>
                                                </div>
                                                </div>
                                            </div>
                                            <div className="border-t-[1px] border-[#9F9F9F] flex justify-center py-[15px]">
                                                <button className="py-[12px] px-[20px] border-[1px] border-transparent rounded-[45px] bg-mainColor text-[16px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium" onClick={()=>{
                                                    setDetection("NewDetection")
                                                }}>
                                                    <div className="flex justify-center items-center space-x-[11px]">
                                                        <Camera size={19} />
                                                        <p className="">new detection</p>
                                                    </div>
                                                </button>
                                            </div>
                                        </motion.div>
                                    })
                                }
                            
                    </div>
                    {detection=="NewDetection"?<div className=' fixed z-50 inset-0  transition-all duration-200 flex justify-center items-center bg-black bg-opacity-70 '><NewDetection/></div>:""}
                    {detection=="afterDetection"?<div className=' fixed z-50 inset-0  transition-all duration-200 flex justify-center items-center bg-black bg-opacity-70 '><AfterDetection/></div>:""}
                </div>
            </>
    );
}

export default DiseaseDetection;
