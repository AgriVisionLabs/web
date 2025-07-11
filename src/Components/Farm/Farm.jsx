import { MapPin, SquarePen, Trash2 } from 'lucide-react';
import { Circle } from "rc-progress";
import React, { useContext, useEffect, useState } from 'react';
import { userContext } from '../../Context/User.context';
import { AllContext } from '../../Context/All.context';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

const Farm = (children) => {
    let {baseUrl,SetOpenFarmsOrFieled,setFarmID}=useContext(AllContext)
    let {token}=useContext(userContext)
    let [fields,setFields]=useState([])
    async function getFields(){
        try {
            const options={
                url:`${baseUrl}/farms/${children.farm.farmId}/Fields`,
                method:"GET",
                headers:{
                    Authorization:`Bearer ${token}`,
                }
            }
            let {data}=await axios(options);
            console.log(data)
            if(data){setFields(data)}
        }catch(error){
            if(error.response.data){
                if(error.response.data.errors.length>0){toast.error(error.response.data.errors[0].description);}
                else{toast.error("There is an error");}
            }else{console.log(error)}
        }
    }
    useEffect(()=>{getFields()},[])
    return (
            <div className=" shadow-md rounded-xl border-[1px]  border-[#0d121c21] ">
                        <div
                            className="mt-2 px-[24px] py-2  grid grid-cols-1  "
                            onClick={(e) => {
                            if ( e.target === e.currentTarget ) {
                                SetOpenFarmsOrFieled(2);
                                setFarmID(children.farm.farmId);
                            }
                            }}
                        >
                            <p className="font-[600]  my-2  capitalize text-mainColor text-[18px]  ">
                            {children.farm.name}
                            </p>
                            <div className="flex items-center space-x-2 text-[16px] my-2 text-[#515050]">
                            <MapPin size={18} />
                            <p className="">{children.farm.location}</p>
                            </div>
                            <div className="grid grid-cols-2  mb-10 gap-y-3 font-medium text-[#2a2929]">
                            <p className=" capitalize ">
                                field : {children.farm.fieldsNo}
                            </p>
                            <p className=" capitalize ">
                                area : {children.farm.area} acres{" "}
                            </p>
                            <p className=" capitalize ">avg. growth : 75%</p>
                            <p className=" capitalize ">
                                soil type : {children.types[children.farm.soilType]}
                            </p>
                            </div>
                            {fields.length?
                            <div className="flex justify-center ">
                            <Swiper
                                spaceBetween={20}
                                breakpoints={{
                                    320: { slidesPerView: 3 },
                                    640: { slidesPerView: 4 },
                                    1024:{slidesPerView: 3 }
                                }}
                                className='flex justify-center items-center  w-fit   my-2  h-[150px]   text-[#2a2929] '
                                >{fields.map((field, index) => {
                                return (
                                <SwiperSlide key={index}>
                                    <div 
                                    data-progress={`${field.progress}%`}
                                    className={`before:content-[attr(data-progress)]   flex flex-col  w-fit  before:text-[#2a2929] before:font-medium before:absolute  before:left-1/2 before:-translate-x-1/2 before:top-1/2 before:-translate-y-1/2 relative`}
                                    >
                                    <Circle
                                        percent={field.progress}
                                        strokeWidth="7"
                                        gapDegree="0"
                                        trailWidth="7"
                                        strokeLinecap="round"
                                        strokeColor="#1E6930"
                                        trailColor="#1e693021"
                                        className={`w-[90px] h-[90px]`}
                                    />
                                    </div>
                                    <p className="text-[16px] w-[90px]  font-medium text-center capitalize ">
                                    {field.cropName}
                                    </p>
                                </SwiperSlide>
                                );
                            })}
                            </Swiper>
                            </div>
                            :<div className='h-[150px] w-full my-2 flex justify-center items-center '>
                                <p className=" text-[18px]">There are no fields on this farm.</p>
                            </div>}
                            <div className="flex justify-between items-center mt-2 mb-5">
                            <div className="typeOfUser border-2 border-[#0d121c21] rounded-xl text-[12px] font-semibold py-1 px-3  h-min">
                                <p className="font-[500] text-[14px] ">
                                {children.farm.roleName}
                                </p>
                            </div>
                            <div className="flex space-x-3" >
                                <SquarePen
                                strokeWidth={1.7}
                                
                                className={`  transition-all ${children.farm.roleName!="Owner"?"text-[#1111115f]":" hover:text-mainColor cursor-pointer "}  duration-150 `}
                                onClick={() => { 
                                    if(children.farm.roleName=="Owner"){
                                    children.setFarmIdEdit(children.farm.farmId);
                                    children.setEdit("BasicInfo");
                                    }
                                }}
                                />
                                <Trash2
                                strokeWidth={1.7}
                                className={`  transition-all  ${children.farm.roleName!="Owner"?"text-[#1111115f]":" hover:hover:text-red-700 cursor-pointer "}   duration-150`}
                                onClick={() => {
                                    if(children.farm.roleName=="Owner"){
                                    children.deleteFarms(children.farm.farmId);}
                                }}
                                />
                            </div>
                            </div>
                        </div>
                        </div>
    );
}

export default Farm;
