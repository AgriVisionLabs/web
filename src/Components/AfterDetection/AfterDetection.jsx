import { AlertCircle, Calendar, CircleCheckBig, CircleX, User, X, XCircle } from 'lucide-react';
import img1 from "../../assets/images/image 5.png"
import { useContext } from 'react';
import { AllContext } from '../../Context/All.context';
import DateDisplay from '../DateDisplay/DateDisplay';
const AfterDetection = (children) => {
    let{setDetection}=useContext(AllContext)
    let healthStatus=[{name:"Healthy",color:"#25C462"},{name:"At Risk",color:"#EBB212"},{name:"Infected",color:"#E13939"}]
    let data=children.DataAfterDetection
    return (
        children.DataAfterDetection?<div className="w-[800px] h-fit pt-[30px] pb-[15px] px-[48px] rounded-[25px] font-manrope bg-[#FFFFFF]">
            <div className="flex justify-between pb-[20px] border-b-[1px] border-[#9F9F9F]">
                <h3 className="text-[22px] text-[#1E6930] font-semibold capitalize">Detection from <DateDisplay dateStr={children.DataAfterDetection.createdOn}/></h3>
                <X size={32} className=' cursor-pointer text-black hover:text-red-600 transition-all duration-150'  onClick={()=>{setDetection(null)
                    if(children.page){
                        children.setPage(null)
                    }
                }}/>
            </div>
            <div className="flex justify-between  items-center ">
                    <div className="flex items-center  space-x-[11px] my-[20px] ">
                        {children.DataAfterDetection.healthStatus==0?<CircleCheckBig
                                size={26}
                                strokeWidth={1.5}
                                className={`text-[${healthStatus[children.DataAfterDetection.healthStatus].color}]`}
                                />:children.DataAfterDetection.healthStatus==1?
                                <AlertCircle
                                size={26}
                                strokeWidth={1.5}
                                className={`text-[${healthStatus[children.DataAfterDetectionm.healthStatus].color}]`}
                                />:
                                <XCircle
                                size={26}
                                strokeWidth={1.5}
                                className={`text-[${healthStatus[children.DataAfterDetection.healthStatus].color}]`}
                                />}
                        <p className="text-[19px] font-semibold capitalize">{children.DataAfterDetection.isHealthy?"Healthy":children.DataAfterDetection.diseaseName}</p>
                    </div>
                    <h3 className={`bg-[${healthStatus[children.DataAfterDetection.healthStatus].color}]  rounded-[15px] px-[12px] py-[4px] text-[16px] font-semibold text-[#FFFFFF] capitalize`}>{healthStatus[children.DataAfterDetection.healthStatus].name}</h3>
            </div>
            <div className="flex justify-between items-center text-[16px] text-[#616161] font-medium ">
                <div className="flex items-center space-x-[8px]">
                    <Calendar strokeWidth={1.5} size={18}/>
                    <p className=" capitalize"><DateDisplay dateStr={children.DataAfterDetection.createdOn}/></p>
                </div>
                <div className="flex items-center space-x-[8px]">
                    <CircleCheckBig strokeWidth={1.5} size={18}/>
                    <p className=" capitalize">accuracy level :  
                        {Math.floor(children.DataAfterDetection.confidenceLevel*100)}%
                    </p>
                </div>
                <div className="flex items-center space-x-[8px]">
                    <User strokeWidth={1.5} size={18}/>
                    <p className=" capitalize">{children.DataAfterDetection.createdBy}</p>
                </div>
            </div>
            <div className="flex flex-col items-center mt-[24px]">
                <div className="w-[700px] rounded-xl overflow-hidden">
                    <img src={`${data.imageUrl}`} alt="" className=" w-[100%] aspect-[16/9] bg-contain " />
                </div>
                <div className="bg-[rgba(159,159,159,0.20)] mt-[10px] h-[100px] overflow-y-auto rounded-[15px] w-full text-[18px] font-medium px-[24px] py-[10px] space-y-[8px]">
                    <p className=" capitalize">analysis result</p>
                    {children.DataAfterDetection.isHealthy?
                    <p className="text-[16px]">- No disease detected. the {} appears healthy.</p>:
                    <div className="text-[16px]">
                    <p className=""> - The disease name is {children.DataAfterDetection.diseaseName}</p>
                    <p className="flex"> - and its treatment is {children.DataAfterDetection.treatments.map((item,index)=>{
                        return <span key={index} className='mx-[5px]'>{item}</span>
                    })}</p>
                    </div>
                    }
                </div>
            </div>
            
        </div>:null
    );
}

export default AfterDetection;
