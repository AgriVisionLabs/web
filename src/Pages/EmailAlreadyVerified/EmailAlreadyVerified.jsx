import React from 'react';
import mainImage from "../../assets/logo/AgrivisionLogo.svg"
import { useNavigate } from 'react-router-dom';

const EmailAlreadyVerified = () => {
    const navigate=useNavigate();
    return (
        <>
        <section>
            <main className='flex  w-screen h-screen justify-center items-center'>
                <div className=" flex flex-col justify-center items-center">
                    <img src={mainImage} alt="" className="w-[150px]" />
                    <div className="flex  justify-center items-center mt-8 mb-5">
                        <div className="w-[55px] h-[55px] bg-[#1e693029] rounded-full flex justify-center items-center">
                        <i className="fa-solid fa-check text-2xl text-mainColor"></i>
                    </div>
                    </div>
                    <h1 className="text-[20px] font-bold ">Email already Verified</h1>
                    <p className="text-[16px] font-medium text-[#616161] w-[390px] text-center py-4">
                    Your email has already been verified. You can log in to your account and start using our services.
                    </p>
                    <button className=' px-10  py-3 rounded-full  bg-mainColor text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium  mt-9'onClick={()=>{
                        navigate("/login");
                    }}>Login</button>
                </div>
            </main>
        </section>
        </>
    );
}
export default EmailAlreadyVerified;
