import imgPersonalIcon from "../../assets/images/image 6.png"
import { useState } from "react";
import { Line} from 'rc-progress';
import 'react-slidy/lib/styles.css';
import Slider from "../../Components/Slider/Slider";
import { motion } from "framer-motion";
import MenuElement from "../../Components/MenuElement/MenuElement";
const Dashboard = () => {
let [onList,setOnList]=useState(false);
var forms=[1,2,3,4,5];
    return (
        
        <>
                <div className=" mt-12    order-7 overflow-hidden   transition-all duration-500">
                    <div className="formGroup flex justify-between items-baseline  mb-5  md:px-4 transition-all duration-500">
                        <MenuElement Items={forms} name={"Hussein’s Farm 1"}  Pformat={"text-[18px] font-[400]"} className={"w-[230px] xl:w-[290px] "} onList={onList} setOnList={setOnList} />
                        
                        <div className="typeOfUser border-2 border-[#0d121c21] rounded-xl text-[12px] font-semibold py-1 px-3  h-min">
                            <p className="font-[500] text-[14px] ">Owner</p>
                        </div>
                    </div>
                    <div className=" grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-6 md:px-4 py-2 ">
                        
                        {[1,2,3,4].map((index)=>{
                                    return <motion.div
                                    key={index}
                                    initial={{ x: 0, y: -50, opacity: 0 }}
                                    animate={{ x: 0, y: 0, opacity: 1 }}
                                    transition={{
                                        delay: index * 0.35,
                                        duration: 0.8,
                                        type: "spring",
                                        bounce: 0.4,
                                    }}
                                        className="rounded-[15px] border-[1px] border-[rgba(13,18,28,0.25)]"
                                    >
                                        <div className=" shadow-md px-3 py-2 rounded-xl border-[1px]  border-[#0d121c00] ">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-mainColor font-[500] text-[16px]">Field 1</p>
                                                    <div className="pt-1 px-3 border-2 rounded-2xl border-[#0d121c21] ">active</div>
                                                </div>
                                                <div className="mt-2">
                                                    <p className="font-[600] text-[21px] my-2">Corn</p>
                                                    <Line percent={65} strokeLinecap="round" strokeColor="#1E6930"  className="h-[6.5px] text-mainColor w-full rounded-lg"/>
                                                    <p className="pt-2 pb-2 font-[400] ">progress: {65}%</p>
                                                
                                            </div>
                                        </div>
                                    </motion.div>
                                })
                            }
                    </div>
                    <div className="grid  lg:grid-cols-2 md:px-4  gap-7 mt-10">
                        <div className=" shadow-md px-3 py-4  rounded-xl border-2  border-[#0d121c21] ">
                                <p className=" font-[500] text-[20px] mb-5">Alerts & Notifications</p>
                                <div className="mt-2 flex space-x-3 items-baseline text-gray-700">
                                    <i className="fa-solid fa-triangle-exclamation text-[#ff0000a6]"></i>
                                    <p className=" font-[400] ">Disease detected in sector B-Green Acres</p>
                                
                                </div>
                                <div className="mt-2 flex space-x-3 items-baseline text-gray-700">
                                    <i className="fa-solid fa-triangle-exclamation text-[#ffad33d0]"></i>
                                    <p className=" font-[400] ">low soil moisture in sector c-sun set fields</p>
                                
                                </div>
                                <div className="mt-2 flex space-x-3 items-baseline text-gray-700">
                                    <i className="fa-solid fa-triangle-exclamation text-[#0000ffa1]"></i>
                                    <p className=" font-[400] ">irrigation system maintenance due-valley view</p>
                                
                                </div>
                        </div>
                        <div className="shadow-md px-3 py-4   rounded-xl border-2   border-[#0d121c21] ">
                                <p className=" font-[500] text-[20px] mb-5">Weather Forecast</p>
                                <div className="  gap-5 text-[16px] font-semibold ">
                                    <Slider/>
                                </div>
                                
                        </div>
                        
                    </div>
                    <div className="mt-10">
                        <p className=" font-[500] text-[20px] mb-5 px-5">Key Performance indicators</p>
                        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:px-4 py-2 ">
                            <div className=" shadow-md px-3 py-2 rounded-xl border-2  border-[#0d121c21] ">
                                <div className="flex justify-between items-center">
                                    <p className="text-mainColor font-[500] text-[16px]">Temperature</p>
                                    <i className="fa-solid fa-temperature-high"></i>
                                </div>
                                <div className="mt-2">
                                    <p className="font-[600] text-[20px] my-2">Good</p>
                                    <Line percent={65} strokeLinecap="round" strokeColor="#1E6930"  className="h-[6.5px] mb-4 text-mainColor w-full rounded-lg"/>
                                    
                                
                            </div>
                            </div>
                            <div className=" shadow-md px-3 py-2 rounded-xl border-2  border-[#0d121c21] ">
                                    <div className="flex justify-between items-center">
                                        <p className="text-mainColor font-[500] text-[16px]">moisture level</p>
                                        <i className="fa-solid fa-droplet"></i>
                                    </div>
                                    <div className="mt-2">
                                        <p className="font-[600] text-[20px] my-2">Optimal</p>
                                        <Line percent={65} strokeLinecap="round" strokeColor="#1E6930"  className="h-[6.5px] mb-4 text-mainColor w-full rounded-lg"/>
                                        
                                    
                                </div>
                            </div>
                            <div className=" shadow-md px-3 py-2 rounded-xl border-2  border-[#0d121c21] ">
                                    <div className="flex justify-between items-center">
                                        <p className="text-mainColor font-[500] text-[16px]">crop growth</p>
                                        <i className="fa-solid fa-arrow-trend-up"></i>
                                    </div>
                                    <div className="mt-2">
                                        <p className="font-[600] text-[20px] my-2">On Track</p>
                                        <Line percent={65} strokeLinecap="round" strokeColor="#1E6930"  className="h-[6.5px] mb-4 text-mainColor w-full rounded-lg"/>
                                        
                                    
                                </div>
                            </div>
                            <div className=" shadow-md px-3 py-2 rounded-xl border-2  border-[#0d121c21] ">
                                    <div className="flex justify-between items-center">
                                        <p className="text-mainColor font-[500] text-[16px]">yield forecast</p>
                                        <i className="fa-solid fa-temperature-empty"></i>
                                    </div>
                                    <div className="mt-2">
                                        <p className="font-[600] text-[20px] my-2">4.2 tons/acre</p>
                                        <Line percent={65} strokeLinecap="round" strokeColor="#1E6930"  className="h-[6.5px] mb-4 text-mainColor w-full rounded-lg"/>
                                        
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid  lg:grid-cols-2 md:px-4  gap-7 mt-10">
                        <div className=" shadow-md px-3 py-4  rounded-xl border-2 space-y-4 border-[#0d121c21] ">
                                <p className=" font-[500] text-[21px] mb-5 capitalize ">recent activity</p>
                                <div className="mt-2 flex  space-x-5 leading-5 place-items-start ">
                                    <img src={imgPersonalIcon} alt="" className="w-[30px]" />
                                    <div className="">
                                    <p className=" font-[400] ">Updated irrigation schedule for Sector A</p>
                                    <p className=" font-manrope font-[500] text-[#9F9F9F] text-[14px]">2 hours ago</p>
                                    </div>
                                
                                </div>
                                <div className="mt-2 flex space-x-5 leading-5 place-items-start text-gray-700">
                                    <img src={imgPersonalIcon} alt="" className="w-[30px]" />
                                    <div className="">
                                    <p className=" font-[400] ">Reported equipment malfunction in Barn 2</p>
                                    <p className=" font-manrope font-[500] text-[#9F9F9F] text-[14px]">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="mt-2 flex place-items-start space-x-5 leading-5  text-gray-700">
                                    <img src={imgPersonalIcon} alt="" className="w-[30px] " />
                                    <div className="">
                                    <p className=" font-[400] ">Completed harvest in Field 3</p>
                                    <p className=" font-manrope font-[500] text-[#9F9F9F] text-[14px]">2 hours ago</p>
                                    </div>
                                </div>
                        </div>
                        <div className="shadow-md px-3 py-4  rounded-xl border-2   border-[#0d121c21] ">
                                <p className=" font-[500] text-[21px] mb-5 capitalize">to-do list</p>
                                <div className=" flex  mb-3  items-center space-x-3  mt-4 ">
                                        <input type="checkbox" id="data1" className=" w-[21px] h-[21px] rounded-lg accent-mainColor"  />
                                        <div className=" flex-grow flex justify-between ">
                                        <label htmlFor="data1" className="text-[17px] " >Schedule equipment maintenance</label>
                                        <div className="typeOfUser border-2 border-[#0d121c21] rounded-xl text-[12px] font-semibold py-1 px-3  h-min">
                                            <p className="capitalize">today</p>
                                        </div>
                                        </div>
                                </div>
                                <div className=" flex  items-center space-x-3 mt-4  ">
                                        <input type="checkbox" id="data1" className=" w-[21px] h-[21px] rounded-lg accent-mainColor"  />
                                        <div className=" flex-grow flex justify-between ">
                                        <label htmlFor="data1" className="text-[17px] " >Schedule equipment maintenance</label>
                                        <div className="typeOfUser border-2 border-[#0d121c21] rounded-xl text-[12px] font-semibold py-1 px-3  h-min">
                                            <p className="capitalize">Owner</p>
                                        </div>
                                        </div>
                                </div>
                                <div className=" flex  items-center space-x-3 mt-4  ">
                                        <input type="checkbox" id="data1" className=" w-[21px] h-[21px] rounded-lg accent-mainColor"  />
                                        <div className=" flex-grow flex justify-between ">
                                        <label htmlFor="data1" className="text-[17px] " >Schedule equipment maintenance</label>
                                        <div className="typeOfUser border-2 border-[#0d121c21] rounded-xl text-[12px] font-semibold py-1 px-3  h-min">
                                            <p className="capitalize">Owner</p>
                                        </div>
                                        </div>
                                </div>
                                <div className=" flex  items-center space-x-3 mt-4  ">
                                        <input type="checkbox" id="data1" className=" w-[21px] h-[21px] rounded-lg accent-mainColor"  />
                                        <div className=" flex-grow flex justify-between ">
                                        <label htmlFor="data1" className="text-[17px] " >Schedule equipment maintenance</label>
                                        <div className="typeOfUser border-2 border-[#0d121c21] rounded-xl text-[12px] font-semibold py-1 px-3  h-min">
                                            <p className="capitalize">Owner</p>
                                        </div>
                                        </div>
                                </div>

                                
                        </div>
                        
                    </div>
                </div>
            
        
        </>
    );
}
export default Dashboard;
