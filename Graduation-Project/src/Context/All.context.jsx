import { createContext, useState } from "react";
import React from 'react';

export const AllContext=createContext(null);
export default function AllProvider(items){
    let children=items.children;
    let [forgetPassword,setForgetPassword]=useState(null);
    let [otp,setOtp]=useState(null);
    let [optLogin,setOptLogin]=useState(null);
    let [resetPassword,setResetPassword]=useState(null);
    let [basicInfo,setBasicInfo]=useState(null);
    let [team,setTeam]=useState(null);
    let [onListItem,setOnListItem]=useState(false);
    let [review,setReview]=useState(null);
    let [addField,setAddField]=useState(null);
    let [openFarmsOrFieled,SetOpenFarmsOrFieled]=useState(null);
    let [OnMenu, setOnmenu] = useState(null);
    let [onListDisDet,setOnListDisDet]=useState(false);
    let [onListSenDev,setOnListSenDev]=useState(false);
    let [detection,setDetection]=useState(false);
    let [onOpenPage,setOnOpenPage]=useState(0);
    let [detectionPage,setDetectionPage]=useState("DiseaseDetectionpage");
    let [allFarms,setAllFarms]=useState([]);
    let [onListAddNewSensorStep1,setOnListAddNewSensorStep1]=useState(false);
    let [addNewSensor,setAddNewSensor]=useState(null);
    let [addNewIrrigationUnit,setAddNewIrrigationUnit]=useState(null);
    let [irrigationUnit,setIrrigationUnit]=useState(null);
    let [controlIrrigationPage,setControlIrrigationPage]=useState(null);
    let [schedule,setSchedule]=useState(null);
    let [indexBI,setIndexBI]=useState(false);
    function outClick(){
        setForgetPassword(false);
        setResetPassword(false);
        setOptLogin(false);
        setOtp(false);
        setBasicInfo(false);
        setTeam(false);
        setReview(false);
        setAddField(false);
    }
    function getPart(e){
        let parts=document.getElementById("parts").children;
        for(let part of parts ){
            if(part == e){
                part.classList.remove("text-[#9F9F9F]");
                part.classList.add("text-mainColor");
                part.classList.add("bg-[#FFFFFF]");
            }else{
                part.classList.remove("text-mainColor");
                part.classList.add("text-[#9F9F9F]");
                part.classList.remove("bg-[#FFFFFF]");
            }
        }
    }
    
    const [valuesForget, setValuesForget] = React.useState(['', '', '','', '', '']);
    return <AllContext.Provider value={{forgetPassword,setForgetPassword
                                        ,otp,setOtp,
                                        valuesForget,setValuesForget,
                                        resetPassword,setResetPassword,
                                        outClick,getPart,
                                        onOpenPage,setOnOpenPage,
                                        optLogin,setOptLogin,
                                        basicInfo,setBasicInfo,
                                        team,setTeam,
                                        onListItem,setOnListItem,
                                        review,setReview,
                                        openFarmsOrFieled,SetOpenFarmsOrFieled,
                                        OnMenu,setOnmenu,
                                        addField,setAddField,
                                        onListDisDet,setOnListDisDet,
                                        onListSenDev,setOnListSenDev,
                                        detection,setDetection,
                                        detectionPage,setDetectionPage,
                                        onListAddNewSensorStep1,setOnListAddNewSensorStep1,
                                        addNewSensor,setAddNewSensor,
                                        irrigationUnit,setIrrigationUnit,
                                        addNewIrrigationUnit,setAddNewIrrigationUnit,
                                        controlIrrigationPage,setControlIrrigationPage,
                                        schedule,setSchedule,
                                        indexBI,setIndexBI,
                                        allFarms,setAllFarms,
                                        }}>
        {children}
    </AllContext.Provider>
}