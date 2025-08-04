import { Camera, Leaf, MapPin, Video, X, AlertCircle } from 'lucide-react';
import  { useContext, useState } from 'react';
import { AllContext } from '../../Context/All.context';
import { userContext } from '../../Context/User.context';
import axios from 'axios';

const NewDetection = (children) => {
    let{setDetection,baseUrl, selectedField}=useContext(AllContext)
    let{token}=useContext(userContext)
    let [selectedFile, setSelectedFile] = useState(null);
    let [filePreview, setFilePreview] = useState(null);
    let [fileType, setFileType] = useState(null); // 'image' or 'video'
    let [error, setError] = useState(null);
    let [isAnalyzing, setIsAnalyzing] = useState(false);
    
    async function setDetectionData(){
        if (!selectedFile) {
            setError('Please select an image or video file');
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        const formData = new FormData();
        if (fileType === 'image') {
            formData.append("Image", selectedFile);
        } else if (fileType === 'video') {
            formData.append("Video", selectedFile);
        }

        try {
            const options={
                url:`${baseUrl}/farms/${children.farmId}/fields/${children.fieldId}/diseasedetections`,
                method:"POST",
                data:formData,
                headers:{
                    Authorization:`Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            }
            let {data}=await axios(options);
            console.log("setDetectionData data",data)
            children.setDataAfterDetection(data);
            // Add a small delay to ensure server has processed the detection
            setTimeout(() => {
                if (children.refreshDetections) {
                    children.refreshDetections();
                }
            }, 1000);
            setDetection("afterDetection")
        }catch(error){
            console.log(error)
            setError(error.response?.data?.message || 'Failed to analyze media. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setError(null);
        
        // Validate file type
        const fileName = file.name.toLowerCase();
        const isImage = fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg');
        const isVideo = fileName.endsWith('.mp4');
        
        if (!isImage && !isVideo) {
            setError('Please select a valid image (PNG, JPG, JPEG) or video (MP4) file');
            return;
        }

        // Validate file size (max 500MB)
        const maxSize = 500 * 1024 * 1024; // 500MB
        if (file.size > maxSize) {
            setError('File size must be less than 500MB');
            return;
        }

        setSelectedFile(file);
        setFileType(isImage ? 'image' : 'video');
        
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const removeFile = () => {
        setSelectedFile(null);
        setFilePreview(null);
        setFileType(null);
        setError(null);
    };

    return (
        <div className="w-[1200px] h-[700px] py-[45px] px-[35px] rounded-[25px] font-manrope bg-[#FFFFFF]">
            <div className="flex justify-between mb-[22px]">
                <h3 className="text-[24px] text-[#1E6930] font-semibold capitalize">new disease detection</h3>
                <X size={32} className='cursor-pointer hover:text-red-500 transition-colors duration-300' onClick={()=>{setDetection(null)}}/>
            </div>
            <p className="text-[#616161] text-[17px] font-semibold">Upload an image or video of the crop for disease detection analysis.</p>
            <div className="flex items-center space-x-[36px] my-[45px]">
                <div className="flex items-center space-x-[15px]">
                    <MapPin size={21} strokeWidth={1.7} className='text-mainColor'/>
                    <p className="text-[17px] text-[#616161] capitalize font-medium">{selectedField?.name || 'unknown field'}</p>
                </div>
                <div className="flex items-center space-x-[15px]">
                    <Leaf size={21} strokeWidth={1.7} className='text-mainColor'/>
                    <p className="text-[17px] text-[#616161] capitalize font-medium">{selectedField?.cropName || 'unknown crop'}</p>
                </div>
            </div>
            <div className="">
                <p className=" capitalize text-[21px] text-[#0D121C] font-semibold mb-[22px]">upload image or video</p>
                <form action="" className='flex flex-col justify-center items-center h-[280px] border-[2px] border-dashed border-[#616161] rounded-[18px] relative hover:border-mainColor transition-colors duration-300'>
                    <input 
                        type='file' 
                        accept=".jpg,.jpeg,.png,.mp4" 
                        className=' absolute  top-0 bottom-0 right-0 left-0  opacity-0 cursor-pointer' 
                        onChange={handleFileChange}
                    />
                    
                    {filePreview ? (
                        <div className="w-full h-full flex justify-center items-center relative">
                            {fileType === 'image' ? (
                                <img 
                                    src={filePreview} 
                                    alt="Preview" 
                                    className="max-w-full max-h-full object-contain rounded-[18px]"
                                />
                            ) : (
                                <video 
                                    src={filePreview} 
                                    controls
                                    className="max-w-full max-h-full object-contain rounded-[18px]"
                                />
                            )}
                            <button
                                type="button"
                                onClick={removeFile}
                                className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-center items-center space-x-[45px] text-mainColor mt-[45px] mb-[28px]">
                                <Camera strokeWidth={1.3} size={55}/>
                                <Video strokeWidth={1.3} size={58}/>
                            </div>
                            <p className="text-[24px] text-[#616161] font-medium text-center mb-[28px]">Click to upload image or video</p>
                            <p className="text-[21px] text-[#616161] font-medium text-center mb-[28px]">JPG, JPEG, PNG, MP4 - max 500MB</p>
                        </>
                    )}
                </form>
                
                {error && (
                    <div className="flex items-center space-x-3 mt-5 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle size={21} className="text-red-500" />
                        <p className="text-red-700 text-[15px]">{error}</p>
                    </div>
                )}
            </div>
            <div className="flex justify-end items-center space-x-[18px] mt-[55px]">
                <button type='button' className="py-[11px] px-[22px] border-[1px] border-[#616161] rounded-[14px] text-[17px] text-[#333333] hover:bg-mainColor hover:text-[#FFFFFF] hover:border-mainColor transition-all duration-300 font-medium" onClick={()=>{setDetection(null)}}>
                    <div className="flex justify-center items-center space-x-[11px]">
                        <p className="">Cancel</p>
                    </div>
                </button>
                <button 
                    type='button'  
                    className={`py-[11px] px-[22px] border-[1px] border-transparent rounded-[14px] text-[17px] text-[#FFFFFF] transition-all duration-300 font-medium ${
                        selectedFile && !isAnalyzing ? 'bg-mainColor hover:bg-transparent hover:text-mainColor hover:border-mainColor' : 'bg-gray-400 cursor-not-allowed'
                    }`} 
                    onClick={setDetectionData}
                    disabled={!selectedFile || isAnalyzing}
                >
                    <div className="flex justify-center items-center space-x-[11px]">
                        {isAnalyzing ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <p className="">Analyzing...</p>
                            </>
                        ) : (
                            <p className="">Analyze Media</p>
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
}

export default NewDetection;
