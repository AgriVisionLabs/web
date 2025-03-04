import imgLogoIcon from "../../assets/logo/AgrivisionLogo.svg"
import imgPersonalIcon from "../../assets/images/image 6.png"
import { LayoutDashboard,Tractor,ListChecks,FireExtinguisher,Thermometer,ChartNoAxesCombined,Settings,LogOut } from 'lucide-react';
import Menu from "../../Components/Menu/Menu";
import { useState } from "react";
import { useEffect } from "react";
import { Line, Circle } from 'rc-progress';
import 'react-slidy/lib/styles.css';
import Slider from "../../Components/Slider/Slider";
Slider
const Dashboard = () => {
//     let [OnMenu, setOnmenu] = useState(false);
//     // let [onActive,setOnActive] =useState(0);
//     function active(e,n){
//         // let e1=document.getElementsByClassName("activePage1").firstElementChild;
//         // console.log(e.target);
//         let elements=document.querySelectorAll("main div div div.activePage1 div");
//         let elements2=document.querySelectorAll("main div div div.activePage2 div");
//         let count=-1
//         if(n==1){
//             for(const element of elements){
//                 count++;
//                 if(element!=e.target.parentElement){
//                     element.classList.remove("text-mainColor");
//                     elements2[count].classList.remove("text-mainColor");
//                     elements2[count].classList.remove("font-[500]")
//                 }else{
//                     element.classList.add("text-mainColor");
//                     elements2[count].classList.add("text-mainColor");
//                     elements2[count].classList.add("font-[500]")
//                 }
//             }
//         }
//         else{
//             for(const element of elements2){
//                 count++;
//                 if(element!=e.target.parentElement){
//                     element.classList.remove("text-mainColor");
//                     element.classList.remove("font-[500]");
//                     elements[count].classList.remove("text-mainColor");
//                 }else{
//                     element.classList.add("text-mainColor");
//                     element.classList.add("font-[500]");
//                     elements[count].classList.add("text-mainColor");
//                 }
//             }
        
//     }
// } 
let [onList,setOnList]=useState(false);
function openList(){
    let element=document.querySelector("main div div  i").classList;
    let element2=document.querySelector("main div div.list").classList;
    if(onList){
        setOnList(false);
        element.remove("fa-angle-down");
        element.add("fa-angle-up");
        element2.remove("border-transparent");
        element2.remove("h-0");
        element2.add("h-32");
        element2.add("border-2");
        element2.add("border-[#0d121c21]")
        
    }else{
        setOnList(true);
        element.remove("fa-angle-up");
        element.add("fa-angle-down");
        element2.remove("h-32");
        element2.add("border-transparent");
        element2.add("h-0");
        element2.remove("border-2");
        element2.remove("border-[#0d121c21]")
    }
}
useEffect(()=>{
    openList()
},[]);
var forms=[1,2,3,4,5];
// function mnueResponsive(){
//     let meunRes=document.querySelector("main");
    
//     if(OnMenu){
//         meunRes.firstElementChild.classList.remove("col-span-2")
//         meunRes.lastElementChild.classList.remove("col-span-10")
//         meunRes.firstElementChild.classList.add("col-span-1")
//         meunRes.lastElementChild.classList.add("col-span-11")
        
//     }else{
//         meunRes.firstElementChild.classList.remove("col-span-1")
//         meunRes.lastElementChild.classList.remove("col-span-11")
//         meunRes.firstElementChild.classList.add("col-span-2")
//         meunRes.lastElementChild.classList.add("col-span-10")
//     }
// }
// const containerStyle = {
//     width: '250px',
//     color:"green"
//   };
// function OpenMenuList(){
//     let element=document.querySelector("main div.menuList");
//     if(!OnMenu){
//         element.classList.add("w-0");
//         element.classList.remove("w-[100%]");
//         setOnmenu(true);
//     }else{
//         element.classList.add("w-[100%]");
//         element.classList.remove("w-0");
//         setOnmenu(false);
//         }
// }
// useEffect(()=>{
//     mnueResponsive()
// },[OnMenu])
// useEffect(()=>{
//     openList()
// },[]);
// function createMenu(){
//     let userForm=document.querySelector("main div div div.forms");
//     console.log(userForm)
//     for(let form of forms){
//         userForm.a;
        
//     }
// }

    return (
        
        <>
        
        <section className="Dashboard  ms-auto   transition-all duration-500 ps-3 ">
            
            <main className="py-10 ">
                <div className=" mt-12    order-7 overflow-hidden   transition-all duration-500">
                    <div className="formGroup flex justify-between items-baseline  mb-5  md:px-4 transition-all duration-500">
                        <div className="forms    transition-all duration-500 w-[230px] xl:w-[290px] relative   ">
                            {/* <select name="forms" id="forms" className="w-[280px]    py-1  ">
                                <option value="" disabled selected hidden>Hussein’s Farm 1</option> */}
                                    <div className="flex justify-between  items-center rounded-lg border-2 px-5 py-2 mb-[4px] border-[#0d121c21] ">
                                        
                                        <p className="text-[18px] font-[400] ">Hussein’s Farm 1</p>
                                        <i className=" fa-solid" onClick={(e)=>{
                                            openList(e)
                                        }}></i>
                                        
                                    </div>
                                    
                                    <div className="list     transition-all duration-500 overflow-hidden rounded-lg  bg-[#ffffff] z-10 absolute left-0 right-0 ">
                                    <div className="">
                                    {
                                        forms.map((e)=><Menu childern={e}/>)
                                        
                                        
                                    }
                                    </div>
                                    </div>
                                
                        </div>
                        <div className="typeOfUser border-2 border-[#0d121c21] rounded-xl text-[12px] font-semibold py-1 px-3  h-min">
                            <p className="font-[500] text-[14px] ">Owner</p>
                        </div>
                    </div>
                    <div className=" grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-6 md:px-4 py-2 ">
                        <div className=" shadow-md px-3 py-2 rounded-xl border-2  border-[#0d121c21] ">
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
                        <div className=" shadow-md px-3 py-2 rounded-xl border-2  border-[#0d121c21] ">
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
                        <div className=" shadow-md px-3 py-2 rounded-xl border-2  border-[#0d121c21] ">
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
                        <div className=" shadow-md px-3 py-2 rounded-xl border-2  border-[#0d121c21] ">
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
                                    <p className=" font-[400] ">Updated irrigation schedule for Sector A</p>
                                    <p className=" font-manrope font-[500] text-[#9F9F9F] text-[14px]">2 hours ago</p>
                                    </div>
                                
                                </div>
                                <div className="mt-2 flex space-x-5 leading-5 place-items-start text-gray-700">
                                    <img src={imgPersonalIcon} alt="" className="w-[30px]" />
                                    <div className="">
                                    <p className=" font-[400] ">Reported equipment malfunction in Barn 2</p>
                                    <p className=" font-manrope font-[500] text-[#9F9F9F] text-[14px]">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="mt-2 flex place-items-start space-x-5 leading-5  text-gray-700">
                                    <img src={imgPersonalIcon} alt="" className="w-[30px] " />
                                    <div className="">
                                    <p className=" font-[400] ">Completed harvest in Field 3</p>
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
                    
            </main>
                
        </section>
        
        </>
    );
}
//grid mx-auto grid-flow-row grid-cols-12  text-[#0D121C] transition-all duration-500
export default Dashboard;
