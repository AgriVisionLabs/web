import { useContext, useEffect, useState } from 'react';
import { AllContext } from '../../Context/All.context';
import MenuElementCrop from '../MenuElement/MenuElementCrop';
import { userContext } from '../../Context/User.context';
import axios from 'axios';


const AddNewField = (children) => {
    let {outClick,setAddField,baseUrl}=useContext(AllContext);
    let {token}=useContext(userContext);
    let [data,setData]=useState();
    let [index,setIndex]=useState(0);
    async function getCrops() {
    try {
        const options = {
            url: `${baseUrl}/Crops`,
            method: "GET",
            headers: {
            Authorization: `Bearer ${token}`,
            },
        };
        let { data } = await axios(options);
        setData(data)
        children.setCropType(data)
        console.log("getCrops",data)
        } catch (error) {
        // toast.error("Incorrect email or password "+error);
        console.log(error);
        }
    }
    useEffect(()=>{
        children.setFieldData({
        FieldName:"",
        FieldSize:"",
        CropType:"",
        IrrigationUnit:null,
        SensorUnit:null,
        })
        getCrops()},[])
    useEffect(()=>{
        children.setFieldData(prev=>({
        ...prev ,
        CropType:index,
    }))
    
},[index])
    return (
        data?<section className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70  font-manrope backdrop-blur-[blur(5)] absolute z-50 w-[100%]" onClick={(e)=>{
            if(e.target===e.currentTarget){
                outClick()
                }}}>
                
                <div className=" w-[650px] h-[660px]   border-2 rounded-2xl bg-white flex  flex-col items-center">
                <div className="w-[90%] mt-5 text-[22px]  flex justify-end">
                    <i className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300 " onClick={()=>{
                        outClick()
                    }} ></i>
                </div>
                <div className="flex flex-col justify-center items-center mt-8 mb-5">
                <div className=" capitalize mb-5 text-[20px] font-semibold text-mainColor">add new field</div>
                <div className="w-[100%] rounded-xl flex gap-2  items-center">
                    <div className=" flex flex-col items-center ">
                    <div className="w-[33px] h-[33px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full"><p className="">1</p>
                    </div>
                    <p className="mt-2">Basic Info</p>
                    </div>
                    <div className="w-[75px] h-[1.6px] rounded-full bg-mainColor opacity-[0.3]"></div>
                    <div className=" flex flex-col items-center ">
                    <div className="w-[33px] h-[33px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full opacity-[0.3]"><p className="">2</p>
                    </div>
                    <p className="mt-2">Irrigation</p>
                    </div>
                    <div className="w-[75px] h-[1.6px] rounded-full bg-mainColor opacity-[0.3]"></div>
                    <div className=" flex flex-col items-center ">
                    <div className="w-[33px] h-[33px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full opacity-[0.3]"><p className="">3</p>
                    </div>
                    
                    <p className="mt-2">Sensors</p>
                    </div>
                    <div className="w-[75px] h-[1.6px] rounded-full bg-mainColor opacity-[0.3]"></div>
                    <div className=" flex flex-col items-center ">
                    <div className="w-[33px] h-[33px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full opacity-[0.3]"><p className="">4</p>
                    </div>
                    
                    <p className="mt-2">Review</p>
                    </div>
                </div>
                </div>
                <form action="" className="w-[85%] my-5 flex flex-col justify-between  text-[17px]">
                    <div className="flex flex-col gap-3 my-5">
                        <div className="">
                            <label htmlFor="" className='ms-1'>Field Name</label>
                            <input type="text" placeholder='Enter Field Name ' className='formControl mx-0 rounded-xl text-[15px] py-5 w-[100%] border-[#0d121c21] ' onChange={(e)=>{
                                children.setFieldData(prev=>({
                                    ...prev ,
                                    FieldName:e.target.value,
                                }))
                                
                            }}/>
                        </div>
                        
                        <div className="">
                            <label htmlFor="" className='ms-1'>Field Size (acres)</label>
                            <input type="number" placeholder='Enter Field Size' className='formControl mx-0 rounded-xl text-[15px] py-5 w-[100%] border-[#0d121c21] 'onChange={(e)=>{
                                children.setFieldData(prev=>({
                                    ...prev ,
                                    FieldSize:e.target.value
                                }))
                            }}/>
                        </div>
                        <div className="">
                            <label htmlFor="" className='ms-1 '>Crop Type</label>
                            <MenuElementCrop Items={data} nameChange={data[index].name} setIndex={setIndex} className={"mt-[15px]"} index={index}  Pformat={"text-[#0D121C] font-[400]"}/> 
                        </div>
                    </div>
                    
                    <button type='button' className="btn self-end rounded-lg py-4 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium mt-[20px]" onClick={()=>{
                        setAddField(2);
                    }}>Next <i className="fa-solid fa-angle-right ms-3 "></i></button>
                    
                </form>
                </div>
                
            </section>:null)

                }
export default AddNewField;
