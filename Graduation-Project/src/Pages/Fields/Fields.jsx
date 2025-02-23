import React, { useContext } from 'react';
import { AllContext } from '../../Context/All.context';

import { MapPin,Sprout,Ruler,Users, SquarePen,SquareKanban, Trash2 } from 'lucide-react';
import AddNewField from '../../Components/AddNewField/AddNewField';
import Irrigation from '../../Components/Irrigation/Irrigation';
import Sensors from '../../Components/Sensors/Sensors';
import ReviewField from '../../Components/ReviewField/ReviewField';
const Fields = () => {
    let {SetOpenFarmsOrFieled,addField,setAddField}=useContext(AllContext);
    SetOpenFarmsOrFieled(2)
    return (
        <section className="h-screen   ms-auto me-3  transition-all duration-500  px-2 relative">
            
            <main className="py-10 h-full ">
                <div className=" mt-12 h-full   order-7 overflow-hidden   transition-all duration-500">
                    <header className="flex justify-between  items-center ">
                        <p className=" text-[25px]  md:text-[28px] font-medium text-mainColor ">Green Farm</p>  
                        <div className="typeOfUser border-2 border-[#0d121c21] rounded-xl text-[12px] font-semibold py-1 px-3  h-min">
                            <p className="font-[500] text-[12px] md:text-[14px] ">Manager</p>
                        </div>
                    </header>
                    <div className="grid gap-4 md:grid-cols-2 my-5">
                        <div className="   flex gap-9 text-[#616161] text-[14px] md:text-[14px]  lg:text-[20px]">
                            <div className="flex items-center gap-2">
                                <MapPin size={20}/>
                                <p className="">ismailia</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sprout size={20}/>
                                <p className="">Clay</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Ruler size={20}/>
                                <p className="">900 acres</p>
                            </div>
                        </div>
                        <div className="flex md:mt-5 md:ms-auto gap-5">
                            <Users strokeWidth={3} className=' transition-all duration-200 hover:text-[#1f54b6] '/>
                            <SquarePen className=' transition-all duration-200 hover:text-mainColor'/>
                            <SquareKanban className=' transition-all duration-200 hover:text-[#e42ad2] '/>
                            <Trash2 className=' transition-all duration-200 hover:text-[#f02929] '/>
                        </div>
                        
                    </div>
                    <div className="flex justify-between my-10 items-center">
                        <p className="text-[20px] md:text-[25px] font-medium">Fields</p>
                        <button className="btn self-end py-4 w-auto px-2 md:px-4 bg-mainColor text-[13px] md:text-[15px]  text-white hover:bg-transparent hover:border-mainColor border-2 capitalize hover:text-mainColor font-medium  "onClick={()=>{
                            setAddField(1);
                        }}><i className="fa-solid fa-plus pe-2"></i> add Field </button>
                    </div>
                    <div className="h-[60%] flex justify-center items-center text-[#808080] text-[22px]">you don’t have any fields yet</div>
                </div>
            </main>
                    {   addField==1?<div className=' fixed z-50 inset-0  '><AddNewField/></div>:
                        addField==2?<div className=' fixed z-50 inset-0  '><Irrigation/></div>:
                        addField==3?<div className=' fixed z-50 inset-0  '><Sensors/></div>:
                        addField==4?<div className=' fixed z-50 inset-0  '><ReviewField/></div>:""
                    }
        </section>
    );
}

export default Fields;
