import React from 'react';
import { useContext } from 'react';
import { AllContext } from '../../Context/All.context';
import { QrCode } from 'lucide-react';

const Sensors = () => {
        let {outClick,setBasicInfo,setAddField}=useContext(AllContext);
        return (
            <section className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70  font-manrope backdrop-blur-[blur(5)] absolute z-50 w-[100%]" onClick={(e)=>{
                if(e.target===e.currentTarget){
                    outClick()
                    }}}>
                    
                    <div className=" w-[600px] h-[680px]   border-2 rounded-2xl bg-white flex  flex-col items-center">
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
                        <div className="w-[75px] h-[1.6px] rounded-full bg-mainColor "></div>
                        <div className=" flex flex-col items-center ">
                        <div className="w-[33px] h-[33px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full "><p className="">2</p>
                        </div>
                        <p className="mt-2">Irrigation</p>
                        </div>
                        <div className="w-[75px] h-[1.6px] rounded-full bg-mainColor "></div>
                        <div className=" flex flex-col items-center ">
                        <div className="w-[33px] h-[33px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full "><p className="">3</p>
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
                    <form action="" className="w-[75%] my-5 flex flex-col justify-between  text-[18px] flex-grow">
                        <div className="flex flex-col gap-3 my-5">
                            <div className="">
                                <label htmlFor="" className='ms-1'>Sensor unit name</label>
                                <input type="text" placeholder='Enter Sensor unit name ' className='formControl mx-0 rounded-xl text-[16px] py-5 w-[100%] border-[#0d121c21] '/>
                            </div>
                            
                            <div className="">
                                <label htmlFor="" className='ms-1'>Serial Number</label>
                                <div className="flex justify-center items-center gap-3">
                                    <input type="text" placeholder='Enter Serial Number' className='formControl mx-0 rounded-xl text-[16px] py-5  border-[#0d121c21] '/>
                                    <div className="flex justify-center items-center mx-0 rounded-xl text-[16px] p-2 w-20  border-2 border-[#0d121c21]">
                                        <QrCode strokeWidth={1.2} size={25}/>
                                    </div>
                                </div>
                            </div>
                            <button className='btn2 rounded-xl w-[100%]  py-5 bg-mainColor text-[16px] text-white hover:bg-[#616161]  font-medium ' >
                                
                            <i className="fa-solid fa-plus me-2"></i>Add Sensor</button>
                        </div>
                        <div className="flex justify-between items-center">
                            <i className="fa-solid fa-angle-left hover:text-mainColor  transition-all duration-300  cursor-pointer text-[22px]"  onClick={()=>{
                            setAddField(2)
                            }}></i>
                            <button className="btn2 self-end rounded-lg py-4 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium mt-12" onClick={()=>{
                                setAddField(4)
                            }}>Next <i className="fa-solid fa-angle-right ms-3"></i></button>
                        </div>
                    </form>
                    </div>
                    
                </section>)
    }

export default Sensors;
