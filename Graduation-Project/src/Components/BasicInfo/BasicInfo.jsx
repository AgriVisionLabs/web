import React from 'react';
import { useContext } from 'react';
import { AllContext } from '../../Context/All.context';
import Menu from "../../Components/Menu/Menu";
import { useState } from "react";
import { useEffect } from "react";

const BasicInfo = () => {
    let {outClick,setBasicInfo,setTeam}=useContext(AllContext);
    let [onList,setOnList]=useState(false);
    function openList(){
        let element=document.querySelector("form div.forms  i").classList;
        let element2=document.querySelector("form div.forms div.list").classList;
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
    return (
        <section className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70  font-manrope backdrop-blur-[blur(5)] absolute z-50 w-[100%]" onClick={(e)=>{
            if(e.target===e.currentTarget){
                outClick()
                }}}>
                
                <div className=" w-[600px] h-[680px]   border-2 rounded-2xl bg-white flex  flex-col items-center">
                <div className="w-[90%] mt-5 text-[22px]  flex justify-end">
                    <i className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300 " onClick={()=>{
                        setBasicInfo(false);
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
                    <div className="w-[100px] h-[1.6px] rounded-full bg-mainColor opacity-[0.3]"></div>
                    <div className=" flex flex-col items-center ">
                    <div className="w-[35px] h-[35px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full opacity-[0.3]"><p className="">2</p>
                    </div>
                    <p className="mt-2">Team</p>
                    </div>
                    <div className="w-[100px] h-[1.6px] rounded-full bg-mainColor opacity-[0.3]"></div>
                    <div className=" flex flex-col items-center ">
                    <div className="w-[35px] h-[35px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full opacity-[0.3]"><p className="">3</p>
                    </div>
                    <p className="mt-2">Review</p>
                    </div>
                </div>
                </div>
                <form action="" className="w-[75%] my-5 flex flex-col text-[18px]">
                    <div className="">
                        <label htmlFor="" className='ms-1'>Farm Name</label>
                        <input type="text" placeholder='Enter Farm Name' className='formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-[#0d121c21] '/>
                    </div>
                    
                    <div className="">
                        <label htmlFor="" className='ms-1'>Farm Size (acres)</label>
                        <input type="text" placeholder='Enter Farm Size' className='formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-[#0d121c21] '/>
                    </div>
                    <div className="">
                        <label htmlFor="" className='ms-1'>Farm Location</label>
                        <input type="text" placeholder='Enter Farm Location' className='formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-[#0d121c21] '/>
                    </div>
                    <div className="forms    transition-all duration-500  relative   ">
                                    <label htmlFor=""  className=''>Soil Type</label>
                                    <div className="flex justify-between  items-center rounded-xl border-2 mt-2 px-2 py-2 mb-[4px] border-[#0d121c21]  ">
                                        
                                        <p className="text-[16px] font-[400] select-none px-2 text-[#9F9F9F]">Soil Type</p>
                                        <i className=" fa-solid" onClick={(e)=>{
                                            openList()
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
                    
                    <button className="btn self-end rounded-lg py-4 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium mt-12" onClick={()=>{
                        setBasicInfo(false);
                        setTeam(true);
                    }}>Next <i className="fa-solid fa-angle-right ms-3"></i></button>
                    
                </form>
                </div>
                
            </section>)
}


export default BasicInfo;
