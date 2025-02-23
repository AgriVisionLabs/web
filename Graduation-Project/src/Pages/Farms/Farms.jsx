import  { useContext } from 'react';
import BasicInfo from '../../Components/BasicInfo/BasicInfo';
import Team from '../../Components/Team/Team';
import Review from '../../Components/Review/Review';
import { Circle } from 'rc-progress';
import { MapPin, SquarePen, Trash2 } from 'lucide-react';
import { AllContext } from '../../Context/All.context';

const Farms = () => {
    let {basicInfo,team,review,setBasicInfo,SetOpenFarmsOrFieled}=useContext(AllContext);
    SetOpenFarmsOrFieled(1);
    return (
        <>
        <section className="  ms-auto me-3  transition-all duration-500 px-2 relative">
            
            <main className="py-10 ">
                <div className=" mt-12    order-7 overflow-hidden   transition-all duration-500">
                    <div className=" flex justify-between items-center px-3 mb-10">
                        <p className="text-[15px] md:text-[17px] lg:text-[18px] xl:text-[20px] capitalize font-medium">farms & fields management</p>
                        <button className="btn self-end py-4 w-auto px-2 md:px-4 bg-mainColor text-[12px] md:text-[14px]  text-white hover:bg-transparent hover:border-mainColor border-2 capitalize hover:text-mainColor font-medium  "onClick={()=>{
                            setBasicInfo(true)
                        }}><i className="fa-solid fa-plus pe-2"></i> add new farm </button>
                    </div>
                    <div className=" grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  grid   gap-6 md:px-4 py-2 ">
                        <div className=" shadow-md px-3 py-2 rounded-xl border-2  border-[#0d121c21] " onClick={()=>{
                            SetOpenFarmsOrFieled(2)
                        }}>
                            
                            <div className="mt-2 px-3 grid grid-cols-1 ">
                                <p className="font-[600]  my-2  capitalize text-mainColor text-[18px]">green fram</p>
                                <div className="flex items-center space-x-2 text-[16px] my-2 text-[#515050]">
                                    <MapPin size={18} />       
                                    <p className="">springField , IL</p>
                                </div>
                                <div className="grid grid-cols-2  mb-10 gap-y-3 font-medium text-[#2a2929]">
                                <p className=" capitalize ">field : 3</p>
                                <p className=" capitalize ">area : 500 acres </p>
                                <p className=" capitalize ">avg. growth : 75%</p>
                                <p className=" capitalize ">soil type : clay</p>
                                </div>
                                <div className="grid grid-cols-3 justify-center gap-6 my-5 w-[100%]  text-[#2a2929]  ">
                                    <div className="flex flex-col items-center ">
                                    <p className="before:content-['20%']  before:text-[#2a2929] before:font-medium before:absolute  before:left-1/2 before:-translate-x-1/2 before:top-1/2 before:-translate-y-1/2 relative"><Circle  percent={20} strokeWidth="7" gapDegree="0" trailWidth="7" strokeLinecap="round" strokeColor="#1E6930" trailColor="#1e693021" className={`w-[90px] h-[90px]`}/></p>
                                        <p className="text-[16px] font-medium capitalize ">corn</p>
                                    </div>
                                    <div className="flex flex-col items-center ">
                                        <p className="before:content-['90%']  before:text-[#2a2929] before:font-medium before:absolute  before:left-1/2 before:-translate-x-1/2 before:top-1/2 before:-translate-y-1/2 relative"><Circle  percent={90} strokeWidth="7" gapDegree="0" trailWidth="7" strokeLinecap="round" strokeColor="#1E6930" trailColor="#1e693021" className={`w-[90px] h-[90px]`}/></p>
                                        <p className="text-[16px] font-medium capitalize ">soybeans</p>
                                    </div>
                                    <div className="flex flex-col items-center ">
                                        <p className="before:content-['80%']  before:text-[#2a2929] before:font-medium before:absolute  before:left-1/2 before:-translate-x-1/2 before:top-1/2 before:-translate-y-1/2 relative"><Circle  percent={80} strokeWidth="7" gapDegree="0" trailWidth="7" strokeLinecap="round" strokeColor="#1E6930" trailColor="#1e693021" className={`w-[90px] h-[90px]`}/></p>
                                        <p className="text-[16px] font-medium capitalize ">olives</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-2 mb-5">
                                <div className="typeOfUser border-2 border-[#0d121c21] rounded-xl text-[12px] font-semibold py-1 px-3  h-min">
                                    <p className="font-[500] text-[14px] ">Owner</p>
                                </div>
                                <div className="flex space-x-3">
                                <SquarePen strokeWidth={1.7} className=' hover:text-mainColor transition-all  duration-150'/>
                                <Trash2 strokeWidth={1.7} className='hover:text-red-700 transition-all  duration-150'/>
                                </div>
                                </div>
                        
                        </div>
                        </div>
                        <div className=" shadow-md px-3 py-2 rounded-xl border-2  border-[#0d121c21] " onClick={()=>{
                            SetOpenFarmsOrFieled(2)
                        }}>
                            
                            <div className="mt-2 px-3 grid grid-cols-1 ">
                                <p className="font-[600]  my-2  capitalize text-mainColor text-[18px]">green fram</p>
                                <div className="flex items-center space-x-2 text-[16px] my-2 text-[#515050]">
                                    <MapPin size={18} />       
                                    <p className="">springField , IL</p>
                                </div>
                                <div className="grid grid-cols-2  mb-10 gap-y-3 font-medium text-[#2a2929]">
                                <p className=" capitalize ">field : 3</p>
                                <p className=" capitalize ">area : 500 acres </p>
                                <p className=" capitalize ">avg. growth : 75%</p>
                                <p className=" capitalize ">soil type : clay</p>
                                </div>
                                <div className="grid grid-cols-3 justify-center gap-6 my-5 w-[100%]  text-[#2a2929]  ">
                                    <div className="flex flex-col items-center ">
                                    <p className="before:content-['20%']  before:text-[#2a2929] before:font-medium before:absolute  before:left-1/2 before:-translate-x-1/2 before:top-1/2 before:-translate-y-1/2 relative"><Circle  percent={20} strokeWidth="7" gapDegree="0" trailWidth="7" strokeLinecap="round" strokeColor="#1E6930" trailColor="#1e693021" className={`w-[90px] h-[90px]`}/></p>
                                        <p className="text-[16px] font-medium capitalize ">corn</p>
                                    </div>
                                    <div className="flex flex-col items-center ">
                                        <p className="before:content-['90%']  before:text-[#2a2929] before:font-medium before:absolute  before:left-1/2 before:-translate-x-1/2 before:top-1/2 before:-translate-y-1/2 relative"><Circle  percent={90} strokeWidth="7" gapDegree="0" trailWidth="7" strokeLinecap="round" strokeColor="#1E6930" trailColor="#1e693021" className={`w-[90px] h-[90px]`}/></p>
                                        <p className="text-[16px] font-medium capitalize ">soybeans</p>
                                    </div>
                                    <div className="flex flex-col items-center ">
                                        <p className="before:content-['80%']  before:text-[#2a2929] before:font-medium before:absolute  before:left-1/2 before:-translate-x-1/2 before:top-1/2 before:-translate-y-1/2 relative"><Circle  percent={80} strokeWidth="7" gapDegree="0" trailWidth="7" strokeLinecap="round" strokeColor="#1E6930" trailColor="#1e693021" className={`w-[90px] h-[90px]`}/></p>
                                        <p className="text-[16px] font-medium capitalize ">olives</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-2 mb-5">
                                <div className="typeOfUser border-2 border-[#0d121c21] rounded-xl text-[12px] font-semibold py-1 px-3  h-min">
                                    <p className="font-[500] text-[14px] ">Owner</p>
                                </div>
                                <div className="flex space-x-3">
                                <SquarePen strokeWidth={1.7} className=' hover:text-mainColor transition-all  duration-150'/>
                                <Trash2 strokeWidth={1.7} className='hover:text-red-700 transition-all  duration-150'/>
                                </div>
                                </div>
                        
                        </div>
                        </div>
                        <div className=" shadow-md px-3 py-2 rounded-xl border-2  border-[#0d121c21] " onClick={()=>{
                            SetOpenFarmsOrFieled(2)
                        }}>
                            
                            <div className="mt-2 px-3 grid grid-cols-1 ">
                                <p className="font-[600]  my-2  capitalize text-mainColor text-[18px]">green fram</p>
                                <div className="flex items-center space-x-2 text-[16px] my-2 text-[#515050]">
                                    <MapPin size={18} />       
                                    <p className="">springField , IL</p>
                                </div>
                                <div className="grid grid-cols-2  mb-10 gap-y-3 font-medium text-[#2a2929]">
                                <p className=" capitalize ">field : 3</p>
                                <p className=" capitalize ">area : 500 acres </p>
                                <p className=" capitalize ">avg. growth : 75%</p>
                                <p className=" capitalize ">soil type : clay</p>
                                </div>
                                <div className="grid grid-cols-3 justify-center gap-6 my-5 w-[100%]  text-[#2a2929]  ">
                                    <div className="flex flex-col items-center ">
                                    <p className="before:content-['20%']  before:text-[#2a2929] before:font-medium before:absolute  before:left-1/2 before:-translate-x-1/2 before:top-1/2 before:-translate-y-1/2 relative"><Circle  percent={20} strokeWidth="7" gapDegree="0" trailWidth="7" strokeLinecap="round" strokeColor="#1E6930" trailColor="#1e693021" className={`w-[90px] h-[90px]`}/></p>
                                        <p className="text-[16px] font-medium capitalize ">corn</p>
                                    </div>
                                    <div className="flex flex-col items-center ">
                                        <p className="before:content-['90%']  before:text-[#2a2929] before:font-medium before:absolute  before:left-1/2 before:-translate-x-1/2 before:top-1/2 before:-translate-y-1/2 relative"><Circle  percent={90} strokeWidth="7" gapDegree="0" trailWidth="7" strokeLinecap="round" strokeColor="#1E6930" trailColor="#1e693021" className={`w-[90px] h-[90px]`}/></p>
                                        <p className="text-[16px] font-medium capitalize ">soybeans</p>
                                    </div>
                                    <div className="flex flex-col items-center ">
                                        <p className="before:content-['80%']  before:text-[#2a2929] before:font-medium before:absolute  before:left-1/2 before:-translate-x-1/2 before:top-1/2 before:-translate-y-1/2 relative"><Circle  percent={80} strokeWidth="7" gapDegree="0" trailWidth="7" strokeLinecap="round" strokeColor="#1E6930" trailColor="#1e693021" className={`w-[90px] h-[90px]`}/></p>
                                        <p className="text-[16px] font-medium capitalize ">olives</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-2 mb-5">
                                <div className="typeOfUser border-2 border-[#0d121c21] rounded-xl text-[12px] font-semibold py-1 px-3  h-min">
                                    <p className="font-[500] text-[14px] ">Owner</p>
                                </div>
                                <div className="flex space-x-3">
                                <SquarePen strokeWidth={1.7} className=' hover:text-mainColor transition-all  duration-150'/>
                                <Trash2 strokeWidth={1.7} className='hover:text-red-700 transition-all  duration-150'/>
                                </div>
                                </div>
                        
                        </div>
                        </div>
                        <div className=" shadow-md px-3 py-2 rounded-xl border-2  border-[#0d121c21] " onClick={()=>{
                            SetOpenFarmsOrFieled(2)
                        }}>
                            
                            <div className="mt-2 px-3 grid grid-cols-1 ">
                                <p className="font-[600]  my-2  capitalize text-mainColor text-[18px]">green fram</p>
                                <div className="flex items-center space-x-2 text-[16px] my-2 text-[#515050]">
                                    <MapPin size={18} />       
                                    <p className="">springField , IL</p>
                                </div>
                                <div className="grid grid-cols-2  mb-10 gap-y-3 font-medium text-[#2a2929]">
                                <p className=" capitalize ">field : 3</p>
                                <p className=" capitalize ">area : 500 acres </p>
                                <p className=" capitalize ">avg. growth : 75%</p>
                                <p className=" capitalize ">soil type : clay</p>
                                </div>
                                <div className="grid grid-cols-3 justify-center gap-6 my-5 w-[100%]  text-[#2a2929]  ">
                                    <div className="flex flex-col items-center ">
                                    <p className="before:content-['20%']  before:text-[#2a2929] before:font-medium before:absolute  before:left-1/2 before:-translate-x-1/2 before:top-1/2 before:-translate-y-1/2 relative"><Circle  percent={20} strokeWidth="7" gapDegree="0" trailWidth="7" strokeLinecap="round" strokeColor="#1E6930" trailColor="#1e693021" className={`w-[90px] h-[90px]`}/></p>
                                        <p className="text-[16px] font-medium capitalize ">corn</p>
                                    </div>
                                    <div className="flex flex-col items-center ">
                                        <p className="before:content-['90%']  before:text-[#2a2929] before:font-medium before:absolute  before:left-1/2 before:-translate-x-1/2 before:top-1/2 before:-translate-y-1/2 relative"><Circle  percent={90} strokeWidth="7" gapDegree="0" trailWidth="7" strokeLinecap="round" strokeColor="#1E6930" trailColor="#1e693021" className={`w-[90px] h-[90px]`}/></p>
                                        <p className="text-[16px] font-medium capitalize ">soybeans</p>
                                    </div>
                                    <div className="flex flex-col items-center ">
                                        <p className="before:content-['80%']  before:text-[#2a2929] before:font-medium before:absolute  before:left-1/2 before:-translate-x-1/2 before:top-1/2 before:-translate-y-1/2 relative"><Circle  percent={80} strokeWidth="7" gapDegree="0" trailWidth="7" strokeLinecap="round" strokeColor="#1E6930" trailColor="#1e693021" className={`w-[90px] h-[90px]`}/></p>
                                        <p className="text-[16px] font-medium capitalize ">olives</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-2 mb-5">
                                <div className="typeOfUser border-2 border-[#0d121c21] rounded-xl text-[12px] font-semibold py-1 px-3  h-min">
                                    <p className="font-[500] text-[14px] ">Owner</p>
                                </div>
                                <div className="flex space-x-3">
                                <SquarePen strokeWidth={1.7} className=' hover:text-mainColor transition-all  duration-150'/>
                                <Trash2 strokeWidth={1.7} className='hover:text-red-700 transition-all  duration-150'/>
                                </div>
                                </div>
                        
                        </div>
                        </div>
                    </div>
                </div>
                    
            </main>
            {basicInfo?<div className=' fixed z-50 inset-0  '><BasicInfo/></div>:""}
            {team?<div className=' fixed z-50 inset-0  '><Team/></div>:""}
            {review?<div className=' fixed z-50 inset-0  '><Review/></div>:""}
        </section>
        </>
    );
}

export default Farms;
