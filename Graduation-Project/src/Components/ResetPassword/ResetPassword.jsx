import React, { useContext } from 'react';
import { AllContext } from '../../Context/All.context';

const ResetPassword = () => {
    let{setOtp,setResetPassword,outClick}=useContext(AllContext);
   
    return (
        <section className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70  font-manrope backdrop-blur-md" onClick={(e)=>{
            if(e.target===e.currentTarget){
                outClick()}}}>
                
        <div className=" w-[540px] h-[530px] border-2 rounded-2xl bg-white flex  flex-col items-center">
        <div className="w-[90%] mt-5 text-[22px]  flex justify-start">
        <i className="fa-solid fa-arrow-left text-[#9F9F9F] hover:text-black transition-colors duration-300" onClick={()=>{setResetPassword(false);
                        setOtp(true);
                    }} ></i>
        </div>
        <div className="flex justify-center items-center mt-7 mb-5">
        <div className="w-[60px] h-[60px] bg-mainColor rounded-xl flex justify-center items-center">
        <i className="fa-solid fa-retweet text-2xl text-white"></i>
        </div>
        </div>
        <h1 className="text-[25px] text-mainColor capitalize font-medium my-5">Reset Password</h1>
        <form action="" className="w-[75%] my-2 flex flex-col items-center">
            <label htmlFor="NewPassword" className='text-[15px] self-start ms-5 mb-1 font-medium '>New Password</label>
            <input type="password" id='NewPassword' placeholder="Enter password" className="formControl"/>
            <label htmlFor="ConfirmPassword" className='text-[15px] self-start ms-5 mb-1 font-medium '>Confirm Password</label>
            <input type="password" id='ConfirmPassword' placeholder="Enter Confirm password" className="formControl"/>
            <button className="btn w-[90%] py-5 bg-mainColor text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium my-12">Reset Password</button>
        </form>
        </div>
        
    </section>
    );
}

export default ResetPassword;
