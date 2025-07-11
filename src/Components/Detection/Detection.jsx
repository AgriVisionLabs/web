import axios from "axios";
import { AlertCircle, Calendar, Camera, CircleCheckBig, Leaf, User, XCircle } from "lucide-react";
import { Line } from "rc-progress";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AllContext } from "../../Context/All.context";
import { userContext } from "../../Context/User.context";
import DateDisplay from "../DateDisplay/DateDisplay";


const Detection = (children) => {
    let {baseUrl } =useContext(AllContext);
    let { token } = useContext(userContext);
    let [field, setField] = useState();
    let [healthyList, setHealthyList] = useState([]);
    let [healthyListState, setHealthyListState] = useState([]);
    let [diseaseDetections, setDiseaseDetections] = useState([]);
    let healthStatus=[{name:"Healthy",color:"#25C462"},{name:"At Risk",color:"#EBB212"},{name:"Infected",color:"#E13939"}]
    let isHealthy=[{name:"Healthy",color:"#25C462"},{name:"Infected",color:"#E13939"}]
    async function getField() {
        try {
        const options = {
            url: `${baseUrl}/farms/${children.farmId}/Fields/${children.fieldId}`,
            method: "GET",
            headers: {
            Authorization: `Bearer ${token}`,
            },
        };
        let { data } = await axios(options);
        setField(data);
        children.setField(data)
        } catch (error) {
        if(error.response?.data){
            if(error.response.data.errors.length>0){toast.error(error.response.data.errors[0].description);}
            else{toast.error("There is an error");}
        }else{console.log(error)}
        }
    }
    async function getDiseaseDetections() {
        try {
        const options = {
            url: `${baseUrl}/farms/${children.farmId}/Fields/${children.fieldId}/DiseaseDetections`,
            method: "GET",
            headers: {
            Authorization: `Bearer ${token}`,
            },
        };
        let { data } = await axios(options);
        console.log(data)
        if (data) {
        setHealthyList(
            data.map((item) => {
                return item.isHealthy;
            })
            );}
        
        children.setStateOverview(healthyList.includes(false))
        setHealthyListState(data.map((item)=>{return item.healthStatus}))
        setDiseaseDetections(data);
        children.setDiseaseDetections(data)
        console.log("setDiseaseDetections :", data);
        } catch (error) {
        if(error.response?.data){
            if(error.response.data.errors.length>0){toast.error(error.response.data.errors[0].description);}
            else{toast.error("There is an error");}
        }else{console.log(error)}
        }
    }
    useEffect(()=>{
        getField()
        getDiseaseDetections()
    },[children.farmId,children.fieldId,children.search])
    return (
        
        field?<div>
            <div
                    className="p-[24px]"
                    onClick={() => {
                        children.setDetectionPage("DiseaseDetectionOverviewpage");
                    }}
                >
                    <div className="mb-[20px] flex justify-between items-center">
                        <h3 className="text-[18px] font-bold capitalize">
                        {field.name}
                        </h3>
                        <h3 className={` rounded-[15px] px-[12px] py-[2px] text-[15px] font-semibold text-[#FFFFFF] capitalize`}
                        style={{ backgroundColor: healthyList.includes(false) ? isHealthy[1].color : isHealthy[0].color }}
                        >
                        {healthyList.includes(false)?isHealthy[1].name:isHealthy[0].name}
                        </h3>
                    </div>
                    <div className="flex items-center space-x-[8px]">
                        <Leaf size={23} className="text-mainColor" />
                        <p className="text-[17px] text-[#9F9F9F] font-semibold">
                        {field.cropName}
                        </p>
                    </div>
                    <div className="mt-2">
                        <div className="flex justify-between items-center text-[16px] font-medium my-[12px]">
                        <p className="capitalize">{field.cropName} health</p>
                        <p>{95}%</p>
                        </div>
                        <Line
                        percent={95}
                        strokeLinecap="round"
                        strokeColor="#1E6930"
                        className="h-[6.5px] text-mainColor w-full rounded-lg"
                        />
                    </div>
                    <div className="text-[16px] font-medium my-[20px] ">
                        <h3 className="capitalize">recent detections</h3>
                        {diseaseDetections.length>0?<div className="mt-[12px] pb-[24px] space-y-[8px]  h-[130px] overflow-y-auto">
                        {diseaseDetections.map((item, i) => (
                            children.search==healthyListState[i]||children.search==3?<div
                            key={i}
                            className="flex justify-between items-center"
                            >
                            <div className="flex items-center space-x-[8px]">
                                {item.healthStatus==0?<CircleCheckBig
                                size={19}
                                strokeWidth={1.5}
                                className={`text-[${healthStatus[item.healthStatus].color}]`}
                                />:item.healthStatus==1?
                                <AlertCircle
                                size={19}
                                strokeWidth={1.5}
                                className={`text-[${healthStatus[item.healthStatus].color}]`}
                                />:
                                <XCircle
                                size={19}
                                strokeWidth={1.5}
                                className={`text-[${healthStatus[item.healthStatus].color}]`}
                                />}
                                
                                <p className="text-[15px] capitalize">
                                <DateDisplay dateStr={item.createdOn}/>
                                </p>
                            </div>
                            <h3 className={`bg-[${healthStatus[item.healthStatus].color}] rounded-[15px] px-[12px] py-[2px] text-[15px] font-semibold text-[#FFFFFF] capitalize`}>
                                {healthStatus[item.healthStatus].name}
                            </h3>
                            </div>:null
                        ))}
                        </div>
                        :<div className="h-[130px] flex justify-center items-center">
                            <p className="">No Detection</p>
                        </div>}
                    </div>
                    <div className="text-[#9F9F9F] border-t-[1px] pt-[15px] border-[#9F9F9F] space-y-[15px]">
                        <div className="flex items-center space-x-[7px]">
                        <Calendar />
                        <p className="capitalize text-[15px]">last: <DateDisplay dateStr={diseaseDetections[0]?.createdOn}/></p>
                        </div>
                        <div className="flex items-center space-x-[7px]">
                        <User />
                        <p className="capitalize text-[15px]">by: {diseaseDetections[0]?.createdBy||"No one"}</p>
                        </div>
                    </div>
                </div>
                <div className="border-t-[1px] border-[#9F9F9F] flex justify-center py-[15px]">
                    <button
                        className="py-[8px] px-[20px] border-[1px] border-transparent rounded-[45px] bg-mainColor text-[16px] text-[#FFFFFF] hover:bg-transparent hover:text-mainColor hover:border-mainColor transition-all duration-300 font-medium"
                        onClick={() => {
                        children.setDetection("NewDetection");
                        }}
                    >
                        <div
                        className="flex justify-center items-center space-x-[11px]"
                        onClick={() => {
                            children.setFarmCheck(children.farmId);
                            children.setFieldCheck(children.fieldId);
                        }}
                        >
                        <Camera size={19} />
                        <p className="">new detection</p>
                        </div>
                    </button>
                </div>
        </div>:null
    );
}

export default Detection;
