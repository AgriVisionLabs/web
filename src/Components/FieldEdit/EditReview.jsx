
import { useContext } from 'react';
import { AllContext } from '../../Context/All.context';
import { userContext } from '../../Context/User.context';
import axios from 'axios';
const EditReview = (children) => {
        let {outClick,setAddField,baseUrl}=useContext(AllContext);
        let {token} =useContext(userContext)
        console.log(children.FieldData)
    async function editField(){
        try {
            const options={
                url:`${baseUrl}/farms/${children.farmId}/Fields/${children.fieldId}`,
                method:"PUT",
                headers:{
                    Authorization:`Bearer ${token}`,
                },
                data:{
                    name:children.FieldData.FieldName,
                    area:children.FieldData.FieldSize,
                    cropType:children.FieldData.CropType,
                }
            }
            let {data}=await axios(options);
            if(data){
                if(children.FieldData.IrrigationUnit){editIrrigation(data.id)}
                if(children.FieldData.SensorUnit){editSensors(data.id)}
            }
            children.setEditField(null)
            children.setFieldOverview(true)
            children.review()
            children.getFields()
            children.setAddField(null)
        }catch(error){
            console.log(error)
        }
    }
    async function editIrrigation(fieldId){
        try {
            const options={
                url:`${baseUrl}/farms/${children.farmId}/fields/${fieldId}/IrrigationUnits`,
                method:"PUT",
                headers:{
                    Authorization:`Bearer ${token}`,
                },
                data:{
                    name:children.FieldData.IrrigationUnit.Name,
                    serialNumber:children.FieldData.IrrigationUnit.SerialNumber,
                }
            }
            await axios(options);
        }catch(error){
            console.log(error)
        }
    }
    function editSensors(fieldId){
        children.sensorsId.map((item)=>{
            editSensor(fieldId,item)
        })
    }
    async function editSensor(fieldId,sensorId){
        try {
            const options={
                url:`${baseUrl}/farms/${children.farmId}/fields/${fieldId}/SensorUnits/${sensorId}`,
                method:"PUT",
                headers:{
                    Authorization:`Bearer ${token}`,
                },
                data:{
                    name:children.FieldData.SensorUnit.Name,
                    serialNumber:children.FieldData.SensorUnit.SerialNumber,
                }
            }
            await axios(options);
        }catch(error){
            console.log(error)
        }
    }
        return (
            <section className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70  font-manrope backdrop-blur-[blur(5)] absolute z-50 w-[100%]" onClick={(e)=>{
                if(e.target===e.currentTarget){
                    children.setEditField(null)
                    }}}>
                    
                    <div className=" w-[600px] h-[660px] border-2 rounded-2xl bg-white flex  flex-col items-center">
                    <div className="w-[90%] mt-3 text-[22px]  flex justify-end">
                        <i className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300 " onClick={()=>{
                            children.setEditField(null)
                        }} ></i>
                    </div>
                    <div className="flex flex-col justify-center items-center mt-8 mb-5">
                    <div className=" capitalize mb-5 text-[20px] font-semibold text-mainColor">Edit</div>
                    <div className="w-[100%] rounded-xl flex gap-2  items-center">
                        <div className=" flex flex-col items-center ">
                        <div className="w-[33px] h-[33px] text-[18px] text-white flex justify-center items-center bg-mainColor rounded-full"><p className="">1</p>
                        </div>
                        <p className="mt-2">Basic Info</p>
                        </div>
                        <div className="w-[75px] h-[1.6px] rounded-full bg-mainColor "></div>
                        <div className=" flex flex-col items-center ">
                        <div className="w-[33px] h-[33px] text-[18px] text-white flex justify-center items-center bg-mainColor rounded-full "><p className="">2</p>
                        </div>
                        <p className="mt-2">Irrigation</p>
                        </div>
                        <div className="w-[75px] h-[1.6px] rounded-full bg-mainColor "></div>
                        <div className=" flex flex-col items-center ">
                        <div className="w-[33px] h-[33px] text-[18px] text-white flex justify-center items-center bg-mainColor rounded-full "><p className="">3</p>
                        </div>
                        
                        <p className="mt-2">Sensors</p>
                        </div>
                        <div className="w-[75px] h-[1.6px] rounded-full bg-mainColor "></div>
                        <div className=" flex flex-col items-center ">
                        <div className="w-[33px] h-[33px] text-[18px] text-white flex justify-center items-center bg-mainColor rounded-full "><p className="">4</p>
                        </div>
                        
                        <p className="mt-2">Review</p>
                        </div>
                    </div>
                    </div>
                    <form action="" className="w-[85%] my-2 flex-grow  flex flex-col justify-between  text-[18px]">
                        <div className="flex flex-col  ">
                            <p className="text-[19px] font-semibold capitalize text-[#0b0b0bd8] mb-2 ">Field Details </p>
                            <div className="  grid grid-cols-2 mx-3 ">
                                <div className="mb-2 font-medium">
                                    <p className=" capitalize text-mainColor mb-1 text-[17px]">field name</p>
                                    <p className="text-[15px]">{children.FieldData.FieldName}</p>
                                </div>
                                <div className="mb-2 font-medium">
                                    <p className=" capitalize text-mainColor mb-1 text-[17px]">field size</p>
                                    <p className="text-[15px]">{children.FieldData.FieldSize}</p>
                                </div>
                                <div className="mb-2 font-medium">
                                    <p className=" capitalize text-mainColor mb-1 text-[17px]">crop type</p>
                                    <p className="text-[15px]">{children.cropType[children.FieldData.CropType].name}</p>
                                </div>
    
                            </div>
                        </div>
                        <div className=" flex-grow ">
                            <p className="text-[16px] text-[#0b0b0bd8]  font-semibold my-1">Irrigation Units</p>
                            <div  className=" flex flex-col gap-2  h-[80px] overflow-y-auto">
                            {children.FieldData.IrrigationUnit?.map((item,index)=><div key={index} className="flex flex-col bg-[#1e693021] py-2 px-5 my-1 rounded-lg">
                                <p className="text-[15px] py-1">{item.Name}</p>
                                <p className="text-[13px] text-[#757575]">{item.SerialNumber}</p>
                                
                            </div>)}
                            </div>
                        </div>
                        <div className=" flex-grow ">
                            <p className="text-[16px] text-[#0b0b0bd8] font-semibold my-1">Sensors Units</p>
                            <div className=" flex flex-col gap-2  h-[80px] overflow-y-auto">
                            {children.FieldData.SensorUnit?.map((item,index)=><div key={index} className="flex flex-col bg-[#1e693021] py-2 px-5 my-1 rounded-lg">
                                <p className=" text-[15px] py-1">{item.Name}</p>
                                <p className="text-[13px] text-[#757575]">{item.SerialNumber}</p>
                                
                            </div>)}
                            </div>
                        </div>
                        <div className="flex mt-4 justify-between items-center">
                            <i className="fa-solid fa-angle-left hover:text-mainColor  transition-all duration-300  cursor-pointer text-[22px]"  onClick={()=>{
                                children.setEditField(3)
                            }}></i>
                            <button type='button' className="btn self-end w-[150px] rounded-lg py-4 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium " onClick={()=>{editField()}}>Save Edit</button>
                        </div>
                        
                    </form>
                    </div>
                    
                </section>)
    }


export default EditReview;
