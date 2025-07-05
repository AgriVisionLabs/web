import { Calendar, CircleCheckBig, CircleX, User, X } from 'lucide-react';
import img1 from "../../assets/images/image 5.png"
import { useContext } from 'react';
import { AllContext } from '../../Context/All.context';
const AfterDetection = (children) => {
    let{setDetection}=useContext(AllContext)
    let crops=["healthy","at_Risk","Infected"]
    let data=children.DataAfterDetection
    return (
        children.DataAfterDetection?<div className="w-[680px] h-[660px] py-[40px] px-[48px] rounded-[25px] font-manrope bg-[#FFFFFF]">
            <div className="flex justify-between pb-[25px] border-b-[1px] border-[#9F9F9F]">
                <h3 className="text-[22px] text-[#1E6930] font-semibold capitalize">Detection from apr 5, 2025</h3>
                <X size={32} className=' cursor-pointer text-black hover:text-red-600 transition-all duration-150'  onClick={()=>{setDetection(null)}}/>
            </div>
            <div className="flex justify-between items-center ">
                    <div className="flex items-center space-x-[11px] my-[25px] ">
                        {children.DataAfterDetection.isHealthy==1?<CircleCheckBig strokeWidth={1.5} size={23} className='text-[#25C462]'/>:
                        <CircleX strokeWidth={1.5} className='text-[#E13939]'/>}
                        <p className="text-[19px] font-semibold capitalize">{}</p>
                    </div>
                    {children.DataAfterDetection.status==0?<h3 className="bg-[#25C462] rounded-[15px] px-[12px] py-[4px] text-[16px] font-semibold text-[#FFFFFF] capitalize">{crops[children.DataAfterDetection.status]}</h3>:
                    <h3 className="bg-[#E13939] rounded-[15px] px-[12px] py-[4px] text-[16px] font-semibold text-[#FFFFFF] capitalize ">{crops[children.DataAfterDetection.status]}</h3>}
            </div>
            <div className="flex justify-between items-center text-[16px] text-[#616161] font-medium ">
                <div className="flex items-center space-x-[8px]">
                    <Calendar strokeWidth={1.5} size={18}/>
                    <p className=" capitalize">5 apr, 2025</p>
                </div>
                <div className="flex items-center space-x-[8px]">
                    <CircleCheckBig strokeWidth={1.5} size={18}/>
                    <p className=" capitalize">accuracy level : 90%</p>
                </div>
                <div className="flex items-center space-x-[8px]">
                    <User strokeWidth={1.5} size={18}/>
                    <p className=" capitalize">hussein mohamed</p>
                </div>
            </div>
            <div className="flex flex-col items-center mt-[24px]">
                <div className="w-[550px] rounded-xl overflow-hidden">
                    <img src={`${data.imageUrl}`} alt="" className=" w-[100%] aspect-[16/9] bg-contain " />
                </div>
                <div className="bg-[rgba(159,159,159,0.20)] mt-[20px] h-[96px] rounded-[15px] w-full text-[18px] font-medium px-[24px] py-[12px] space-y-[10px]">
                    <p className=" capitalize">analysis result</p>
                    <p className="text-[17px]">No disease detected. the crop appears healthy.</p>
                </div>
            </div>
            
        </div>:null
    );
}

export default AfterDetection;
