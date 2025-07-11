import { useContext, useEffect } from 'react';
import { AllContext } from '../../Context/All.context';
import { useState } from "react";
import MenuElement from '../MenuElement/MenuElement';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import { userContext } from '../../Context/User.context';

const EditBasicInfo = (Children) => {
    let {indexBI,setIndexBI,baseUrl}=useContext(AllContext);
    let {token}=useContext(userContext);
    let [onList,setOnList]=useState(false);
    let [farm,setFarm]=useState(null)
    var forms=["Sandy","Clay","Loamy"];

    async function getOldFarmDetails(){
                try {
                    const options={
                        url:`${baseUrl}/Farms/${Children.farmId}` ,
                        method:"GET",
                        headers:{
                            Authorization:`Bearer ${token}`,
                        },
                    }
                    let {data}=await axios(options);
                    setFarm(data);
                }catch(error){
                    toast.error("Incorrect email or password "+error);
                }finally{
                    toast.dismiss("Incorrect");
                    
                }
            }
            useEffect(()=>{
                getOldFarmDetails()
            },[Children.farmId])
    
    const validationSchema=object({
        name:string().required("Farm Name is required").min(3,"Farm Name must be at least 3 characters").max(100,"Farm Name can not be than 100 characters"),
        area:string().required("Farm Size is required").matches(/^([0-9]*?(.[0-9])*)$/,"The Farm size must be number"),
        location:string().required("Farm Location is required").min(3,"Farm Location must be at least 3 characters").max(100,"Farm Location can not be than 100 characters"),
        soilType:string().required("Soil Type is required"),
    });
    // async function EditFarm(values){
    // const loadingId =toast.loading("Waiting...")
    // try {
    //     console.log("farmIdEdit : "+Children.farmId)
    //     const options={
            
    //         url:`${baseUrl}/Farms/${Children.farmId}`,
    //         method:"PUT",
    //         data:values,
    //         headers:{
    //             Authorization:`Bearer ${token}`,
    //         }
    //     }
    //     let {data}=await axios(options);
    //     console.log(data)
    //     setFarm(data)
    //     // Children.setFarmId(data)
    // }catch(error){
    //     toast.error("Incorrect email or password ("+error+")");
    //     console.log(error)
    // }finally{
    //     toast.dismiss(loadingId);
    //     Children.setEdit("Team")
    //     Children.display()
    // }
    // }
    function EditFarm(values){
        Children.setFarmData({
        invitations: [],
        name: values.name,
        area: values.area,
        location: values.location,
        soilType: values.soilType,
        });
        Children.setEdit("Team");
    }

    const formik=useFormik({
        initialValues:{
            name:"",
            area:"",
            location:"",
            soilType:"",
        },
        validationSchema,
        onSubmit:EditFarm,
    });
    useEffect(()=>{
        if(farm){
            formik.setFieldValue("name",farm.name)
            formik.setFieldValue("area",farm.area)
            formik.setFieldValue("location",farm.location)
            formik.setFieldValue("soilType",indexBI)
        }
    },[farm])
    return (
        <section className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70  font-manrope backdrop-blur-[blur(5)] absolute z-50 w-[100%]" onClick={(e)=>{
            if(e.target===e.currentTarget){
                Children.setEdit(false)
                }}}>
                
                <div className=" w-[600px] h-[680px]   border-2 rounded-2xl bg-white flex  flex-col items-center">
                <div className="w-[90%] mt-5 text-[22px]  flex justify-end">
                    <i className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300 " onClick={()=>{
                        Children.setEdit(false)
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
                {farm?<form action="" className="w-[75%] my-5 flex flex-col text-[18px]" onSubmit={formik.handleSubmit}>
                    <div className="">
                        <label htmlFor="" className='ms-1'>Farm Name</label>
                        <input type="text" placeholder={farm.name} className='formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-[#0d121c21] ' name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                        </div>
                    
                    <div className="">
                        <label htmlFor="" className='ms-1'>Farm Size (acres)</label>
                        <input type="text" placeholder={farm.area} className='formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-[#0d121c21] ' name="area" value={formik.values.area} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                    </div>
                    <div className="">
                        <label htmlFor="" className='ms-1'>Farm Location</label>
                        <input type="text" placeholder={farm.location} className='formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-[#0d121c21] ' name="location"  value={formik.values.location} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                    </div>
                    <div className="">
                        <label htmlFor=""  className=''>Soil Type</label>
                        <MenuElement Items={forms} name={forms[farm.soilType]} width={100+"%"} nameChange={forms[indexBI]} index={indexBI} setIndex={setIndexBI}  className={"my-2 text-black"} onList={onList} setOnList={setOnList} />
                    </div>
                    <button type="submit" className="btn self-end rounded-lg py-4 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium mt-12" >Next <i className="fa-solid fa-angle-right ms-3"></i></button>
                    
                </form>:""}
                </div>
                
            </section>)
}

export default EditBasicInfo;
