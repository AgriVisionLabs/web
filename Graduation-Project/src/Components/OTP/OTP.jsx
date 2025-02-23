
import { useContext } from 'react';
import { AllContext } from '../../Context/All.context';
import Check from '../check/Check';
import ResetPassword from '../ResetPassword/ResetPassword';
ResetPassword
const OTP = () => {
    let {setOtp,setForgetPassword,setResetPassword,outClick}=useContext(AllContext);
    
    return (
        <section className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70  font-manrope backdrop-blur-md" onClick={(e)=>{
            if(e.target===e.currentTarget){
                outClick()
}}}>
                
                <div className=" w-[540px] h-[530px] border-2 rounded-2xl bg-white flex  flex-col items-center">
                <div className="w-[90%] mt-5 text-[22px]  flex justify-start">
                    <i className="fa-solid fa-arrow-left text-[#9F9F9F] hover:text-black transition-colors duration-300 " onClick={()=>{setOtp(false);
                        setForgetPassword(true);
                    }} ></i>
                </div>
                <div className="flex justify-center items-center mt-8 mb-5">
                <div className="w-[60px] h-[60px] bg-mainColor rounded-xl flex justify-center items-center">
                <i className="fa-regular fa-envelope-open text-2xl text-white"></i>
                </div>
                </div>
                <h1 className="text-[25px] text-mainColor capitalize font-medium my-5">OTP Verification</h1>
                <p className="w-[350px] text-[16px] text-center text-[#333333] ">Enter the verification code we just sent on your
                email address</p>
                <form action="" className="w-[75%] my-8 flex flex-col items-center">
                    <div className='space-x-5'>
                    <Check/>
                    </div>
                    <button className="btn w-[90%] py-5 bg-mainColor text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium mt-20" onClick={()=>{
                        setResetPassword(true);
                        setOtp(false);
                    }
                    }>Verify</button>
                    <p className="my-3 text-[#333333] text-[15px]">Didn’t received code? <span className='text-mainColor'>Resend</span></p>
                </form>
                </div>
                
            </section>
    );
}

export default OTP;
