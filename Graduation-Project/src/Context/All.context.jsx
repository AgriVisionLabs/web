import { createContext, useState } from "react";
import React from 'react';

export const AllContext=createContext(null);
export default function AllProvider({children}){
    let [forgetPassword,setForgetPassword]=useState(null);
    let [otp,setOtp]=useState(null);
    let [optLogin,setOptLogin]=useState(null);
    let [resetPassword,setResetPassword]=useState(null);
    let [basicInfo,setBasicInfo]=useState(null);
    let [team,setTeam]=useState(null);
    let [review,setReview]=useState(null);
    let [addField,setAddField]=useState(null);
    let [openFarmsOrFieled,SetOpenFarmsOrFieled]=useState(null);
    let [OnMenu, setOnmenu] = useState(null);
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
    const [valuesForget, setValuesForget] = React.useState(['', '', '','', '', '']);
    return <AllContext.Provider value={{forgetPassword,setForgetPassword,otp,setOtp,valuesForget, setValuesForget,resetPassword,setResetPassword,outClick,optLogin,setOptLogin,basicInfo,setBasicInfo,team,setTeam,review,setReview,openFarmsOrFieled,SetOpenFarmsOrFieled,OnMenu, setOnmenu,addField,setAddField}}>
        {children}
    </AllContext.Provider>
}