import { Camera, Leaf, MapPin, Video, X } from 'lucide-react';
import  { useContext } from 'react';
import { AllContext } from '../../Context/All.context';

const NewDetection = () => {
    let{setDetection}=useContext(AllContext)
    return (
        <div className="w-[1127px] h-[650px] py-[40px] px-[30px] rounded-[25px] font-manrope bg-[#FFFFFF]">
            <div className="flex justify-between mb-[20px]">
                <h3 className="text-[22px] text-[#1E6930] font-semibold capitalize">new disease detection</h3>
                <X size={30} className='cursor-pointer' onClick={()=>{setDetection(null)}}/>
            </div>
            <p className="text-[#616161] text-[16px] font-semibold">Upload an image or video of the crop for disease detection analysis.</p>
            <div className="flex items-center space-x-[32px] my-[41px]">
                <div className="flex items-center space-x-[13px]">
                    <MapPin size={20} strokeWidth={1.7} className='text-mainColor'/>
                    <p className="text-[16px] text-[#616161] capitalize font-medium">green farm</p>
                </div>
                <div className="flex items-center space-x-[13px]">
                    <Leaf size={20} strokeWidth={1.7} className='text-mainColor'/>
                    <p className="text-[16px] text-[#616161] capitalize font-medium">Corn</p>
                </div>
            </div>
            <div className="">
                <p className=" capitalize text-[19px] text-[#0D121C] font-semibold mb-[20px]">upload image or video</p>
                <div className="flex flex-col justify-center items-center  h-[250px] border-[1px] border-dashed border-[#616161] rounded-[15px]">
                    <div className="flex justify-center items-center space-x-[40px] text-mainColor mt-[40px] mb-[24px]">
                        <Camera strokeWidth={1.3} size={50}/>
                        <Video strokeWidth={1.3} size={54}/>
                    </div>
                    <p className="text-[22px] text-[#616161] font-medium text-center mb-[24px]">Click to upload image or video</p>
                    <p className="text-[20px] text-[#616161] font-medium  text-center mb-[24px]">JPG , PNG , GIF , MP4 , max 10MB</p>
                </div>
            </div>
            <div className="flex justify-end items-center space-x-[16px] mt-[50px]">
                <button type='button' className="py-[10px] px-[20px] border-[1px] border-[#616161] rounded-[12px]  text-[16px] text-[#333333] hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-medium" onClick={()=>{setDetection(null)}}>
                    <div className="flex justify-center items-center space-x-[11px]">
                        <p className="">Cancel</p>
                    </div>
                </button>
                <button type='button'  className="py-[10px] px-[20px] border-[1px] border-transparent rounded-[12px] bg-mainColor text-[16px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium" onClick={()=>{setDetection("afterDetection")}}>
                    <div className="flex justify-center items-center space-x-[11px]">
                        <p className="">Analyze Media</p>
                    </div>
                </button>
            </div>
        </div>
    );
}

export default NewDetection;
