import React from 'react';
import { useContext } from 'react';
import { AllContext } from '../../Context/All.context';
// import Menu from "../../Components/Menu/Menu";
// import { useState } from "react";
// import { useEffect } from "react";
const Review = () => {
    let {outClick,setReview,setTeam}=useContext(AllContext);
    // let [onList,setOnList]=useState(false);
    // function openList(){
    //     let element=document.querySelector("form div.forms  i").classList;
    //     let element2=document.querySelector("form div.forms div.list").classList;
    //     if(onList){
    //         setOnList(false);
    //         element.remove("fa-angle-down");
    //         element.add("fa-angle-up");
    //         element2.remove("hidden");
    //         element2.remove("border-transparent");
    //         element2.remove("h-0");
    //         element2.add("h-36");
    //         element2.add("border-2");
    //         element2.add("border-[#0d121c21]")
            
    //     }else{
    //         setOnList(true);
    //         element.remove("fa-angle-up");
    //         element.add("fa-angle-down");
    //         element2.add("hidden");
    //         element2.remove("h-36");
    //         element2.add("border-transparent");
    //         element2.add("h-0");
    //         element2.remove("border-2");
    //         element2.remove("border-[#0d121c21]")
    //     }
    // }
    // useEffect(()=>{
    //     openList()
    // },[]);
    // var forms=[1,2,3,4,5];
    return (
        <section className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70  font-manrope backdrop-blur-[blur(5)] absolute z-50 w-[100%]" onClick={(e)=>{
            if(e.target===e.currentTarget){
                outClick()
                }}}>
                
                <div className=" w-[600px] h-[680px] border-2 rounded-2xl bg-white flex  flex-col items-center">
                <div className="w-[90%] mt-5 text-[22px]  flex justify-end">
                    <i className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300 " onClick={()=>{
                        setReview(false);
                    }} ></i>
                </div>
                <div className="flex flex-col justify-center items-center mt-8 mb-5">
                <div className=" capitalize mb-5 text-[20px] font-semibold text-mainColor">add new farm</div>
                <div className="w-[100%] rounded-xl flex gap-4  items-center">
                    <div className=" flex flex-col items-center ">
                    <div className="w-[35px] h-[35px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full"><p className="">1</p>
                    </div>
                    <p className="mt-2">Basic Info</p>
                    </div>
                    <div className="w-[100px] h-[1.6px] rounded-full bg-mainColor "></div>
                    <div className=" flex flex-col items-center ">
                    <div className="w-[35px] h-[35px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full "><p className="">2</p>
                    </div>
                    <p className="mt-2   ">Team</p>
                    </div>
                    <div className="w-[100px] h-[1.6px] rounded-full bg-mainColor "></div>
                    <div className=" flex flex-col items-center ">
                    <div className="w-[35px] h-[35px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full"><p className="">3</p>
                    </div>
                    <p className="mt-2">Review</p>
                    </div>
                </div>
                </div>
                <form action="" className="w-[85%] my-5 flex-grow  flex flex-col justify-between  text-[18px]">
                    <div className="flex flex-col  ">
                        <p className="text-[20px] font-semibold capitalize text-[#0b0b0bd8] mb-4 ">farm Details </p>
                        <div className="  grid grid-cols-2 mx-3 ">
                            <div className="mb-3 font-medium">
                                <p className=" capitalize text-mainColor mb-2 text-[19px]">farm name</p>
                                <p className="text-[17px]">Green Farm</p>
                            </div>
                            <div className="mb-3 font-medium">
                                <p className=" capitalize text-mainColor mb-2 text-[19px]">farm size</p>
                                <p className="text-[17px]">900 acres</p>
                            </div>
                            <div className="mb-3 font-medium">
                                <p className=" capitalize text-mainColor mb-2 text-[19px]">location</p>
                                <p className="text-[17px]">ismailia</p>
                            </div>
                            <div className="mb-3 font-medium">
                                <p className=" capitalize text-mainColor mb-2 text-[19px]">soil type</p>
                                <p className="text-[17px]">Clay soil</p>
                            </div>

                        </div>
                    </div>
                    <div className=" flex-grow ">
                        <p className="text-[20px] text-[#0b0b0bd8] font-semibold my-3">Team Members</p>
                        <div className="flex justify-between items-center bg-[#1e693021] py-3 px-5 my-1 rounded-lg">
                            <p className="capitalize">Hussein Mohamed</p>
                            <div className="flex items-baseline space-x-4">
                                <p className=" capitalize ">manager</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <i className="fa-solid fa-angle-left hover:text-mainColor  transition-all duration-300  cursor-pointer text-[22px] " onClick={()=>{
                            setReview(false)
                            setTeam(true)
                        }} ></i>
                        <button className="btn self-end rounded-lg py-4 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium ">Create Farm</button>
                    </div>
                    
                </form>
                </div>
                
            </section>)
}
export default Review;
