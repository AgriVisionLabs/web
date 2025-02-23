import imgLogoIcon from "../../assets/logo/AgrivisionLogo.svg"
import imgPersonalIcon from "../../assets/images/image 6.png"
import { LayoutDashboard,Tractor,ListChecks,FireExtinguisher,Thermometer,ChartNoAxesCombined,Settings,LogOut, Link } from 'lucide-react';
import { useContext, useRef, useState } from "react";
import { useEffect } from "react";
import 'react-slidy/lib/styles.css';
import Dashboard from "../Dashboard/Dashboard";
import FarmsAndFields from "../FarmsAndFields/FarmsAndFields";
import { AllContext } from '../../Context/All.context';
import { userContext } from "../../Context/User.context";
import { useNavigate } from "react-router-dom";
const Home = () => {
    let {OnMenu, setOnmenu}=useContext(AllContext);
    let {logOut}=useContext(userContext)
    let [onOpenPage,setOnOpenPage]=useState(0);
    const navigate=useNavigate();
function active(e,n){
        // let e1=document.getElementsByClassName("activePage1").firstElementChild;
        // console.log(e.target);
        let elements=document.querySelectorAll("main div div div.activePage1 div");
        let elements2=document.querySelectorAll("main div div div.activePage2 div");
        let count=-1
        if(n==1){
            for(const element of elements){
                count++;
                if(element!=e.target.parentElement&&element!=e.target){
                    element.classList.remove("text-mainColor");
                    elements2[count].classList.remove("text-mainColor");
                    elements2[count].classList.remove("font-[500]")
                }else if(element==e.target.parentElement||element==e.target){
                    setOnOpenPage(count);
                    element.classList.add("text-mainColor");
                    elements2[count].classList.add("text-mainColor");
                    elements2[count].classList.add("font-[500]")
                }
            }
        }
        else{
            for(const element of elements2){
                count++;
                if(element!=e.target.parentElement){
                    element.classList.remove("text-mainColor");
                    element.classList.remove("font-[500]");
                    elements[count].classList.remove("text-mainColor");
                }else{
                    setOnOpenPage(count);
                    element.classList.add("text-mainColor");
                    element.classList.add("font-[500]");
                    elements[count].classList.add("text-mainColor");
                }
            }
        
    }
}
function menuResponsive(){
    let menuRes=document.querySelector("main");

    if(OnMenu){
        menuRes.lastElementChild.classList.remove("w-[81%]")
        menuRes.lastElementChild.classList.add("w-[92%]")
        
        
    }else{
        menuRes.lastElementChild.classList.remove("w-[92%]")
        menuRes.lastElementChild.classList.add("w-[81%]")
        
    }
}
function OpenMenuList(){
    let element=document.querySelector("main div.menuList");
    let element2=document.querySelector("main div.menuList div.log-out");
    if(!OnMenu){
        //text-transparent border-e-2
        //log-out
        // element.classList.add("text-transparent");
        element2.classList.add("border-t-0");
        element.classList.remove("border-t-2");
        element.classList.add("w-0");
        element.classList.remove("w-[100%]");
        setOnmenu(true);
    }else{
        // element.classList.remove("text-transparent");
        element.classList.add("border-t-2");
        element2.classList.remove("border-t-0");
        element.classList.add("w-[100%]");
        element.classList.remove("w-0");
        setOnmenu(false);
        }
}

useEffect(()=>{
    menuResponsive()
},[OnMenu,onOpenPage,])

    return (
        
        <>
        
        <section className="Home " title="Home">
            <nav className=" h-[48px] z-50  fixed order-5  right-0 left-0 flex justify-between items-center  bg-[#F7F7F7] px-2 md:px-[25px] py-[10px]  text-[21px] border-b-2 border-[#0d121c21] transition-all duration-500">
                    <div className="menu&Icon flex  items-center lg:space-x-5 ">
                        <i className="fa-solid fa-bars hover:text-mainColor w-0 overflow-hidden  lg:w-5 transition-all duration-500" onClick={()=>{
                            OpenMenuList()
                        }}></i>
                        <img src={imgLogoIcon} alt="" className="w-[115px]" />
                    </div>
                    <div className="PersonalِِAccount&notifications  flex  items-center space-x-5">
                    <i className="fa-solid fa-bell hover:text-mainColor"></i>
                    <img src={imgPersonalIcon} alt="" className="w-7" />
                    </div>
            </nav>
            <main className={`text-[#0D121C] transition-all duration-500 `}
            
            >
                <div className="transition-all  duration-500">
                    <div  className="sidebar  w-auto  z-50 order-8 fixed top-[48px] bottom-0  me-6  text-[#0D121C]  font-[400]  grid grid-cols-6 ">
                        
                        <div className="bg-[#F7F7F7] flex  col-span-2 flex-col justify-between border-[#0d121c21] border-e-2 lg:border-0 h-[100%]">
                            <div className="px-3 xl:ps-6 xl:pe-5 pt-12 activePage1 transition-all duration-300" onClick={(e)=>{active(e,1)}}>
                                <div className="flex cursor-pointer  hover:text-[#1E6930] py-2 text-mainColor">
                                    <LayoutDashboard className=" transition-all duration-300 "/>
                                </div>
                                
                                <div className="flex cursor-pointer  hover:text-[#1E6930] py-2" >
                                    <Tractor className=" transition-all duration-300"/>
                                </div>
                                <div className="flex cursor-pointer  hover:text-[#1E6930] py-2">
                                    <ListChecks className=" transition-all duration-300"/>
                                </div>
                                <div className="flex cursor-pointer  hover:text-[#1E6930] py-2">
                                    <FireExtinguisher className=" transition-all duration-300"/>
                                </div>
                                <div className="flex cursor-pointer  hover:text-[#1E6930] py-2">
                                    <Thermometer className=" transition-all duration-300"/>
                                </div>
                                <div className="flex cursor-pointer  hover:text-[#1E6930] py-2">
                                    <ChartNoAxesCombined className=" transition-all duration-300"/>
                                </div>
                                <div className="flex cursor-pointer  hover:text-[#1E6930] py-2">
                                    <Settings className=" transition-all duration-300"/>
                                </div>
                            </div>
                            <div className="flex px-3 lg:ps-6 lg:pe-5 text-[16px]  hover:text-[#1E6930] pt-3 border-t-2 transition-all duration-300 ">
                            <div  className="flex pb-3 pt-2 cursor-pointer " onClick={()=>{
                                logOut()
                                navigate("/Login");
                            }}>
                                <LogOut className=" transition-all duration-300 "/>
                            </div>
                            </div>
                        </div>
                        <div  className={`bg-[#F7F7F7] menuList transition-[width]  hidden  lg:flex  duration-500 overflow-hidden col-span-4 flex-col justify-between h-[100%]   border-[#0d121c21] lg:border-e-2`}>
                            <div className="pt-12 activePage2 pe-2 "  onClick={(e)=>{active(e,2)}}>
                                <div className="flex cursor-pointer   text-[16px]  hover:text-[#1E6930] py-2 text-mainColor font-[500]">
                                <p className="">Dashboard</p>
                                </div>
                                <div className="flex cursor-pointer    text-[16px]  hover:text-[#1E6930] py-2">
                                    <p className="">Farms and fields</p>
                                </div>
                                <div className="flex cursor-pointer    text-[16px]  hover:text-[#1E6930] py-2">
                                    <p className="">Tasks</p>
                                </div>
                                <div className="flex cursor-pointer    text-[16px]  hover:text-[#1E6930] py-2">
                                    <p className="">Irrigation</p>
                                </div>
                                <div className="flex cursor-pointer    text-[15px]  hover:text-[#1E6930] py-2">
                                    <p className="">Sensors and devices</p>
                                </div>
                                <div className="flex cursor-pointer    text-[16px]  hover:text-[#1E6930] py-2">
                                    <p className="">Analytics</p>
                                </div>
                                <div className="flex cursor-pointer    text-[16px]  hover:text-[#1E6930] py-2">
                                    <p className="">Settings</p>
                                </div>
                            </div>
                            <div className="log-out text-[16px]  hover:text-[#1E6930] pt-3 border-t-2 ">
                            <div  className="  w-[100%] pb-3 pt-2 ">
                                <p className="cursor-pointer font-medium" onClick={()=>{
                                    logOut()
                                    navigate("/Login");
                                }}>Log out</p>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                    {
                        onOpenPage==0?<Dashboard/>:
                        onOpenPage==1?<FarmsAndFields/>:""
                        
                    }
            </main>
                
        </section>
        
        </>
    );
}


export default Home;
