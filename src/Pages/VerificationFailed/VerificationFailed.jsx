import mainImage from "../../assets/logo/AgrivisionLogo.svg"
import toast from 'react-hot-toast';
import axios from 'axios';
import { useContext } from "react";
import { AllContext } from "../../Context/All.context";
const VerificationFailed = ({children}) => {
    let {baseUrl}=useContext(AllContext)
    async function ResendVerificationEmail(){
        const loadingId =toast.loading("Waiting...",{position:"top-left"});
        try{
            
            const option={
                url:`${baseUrl}/auth/resend-confirmation-email`,
                method:"POST",
                data:{
                    "email":children
                },
            }
            let {data}= await axios(option);
                
                toast.success("Email confirmed")

        }catch(error){
            console.log(error)
            toast.error(error,{position:"top-left"});
        }
        finally{
            toast.dismiss(loadingId);
        }
    }
    return (
        <>
                <section>
                    <main className='flex  w-screen h-screen justify-center items-center'>
                        <div className=" flex flex-col justify-center items-center">
                            <img src={mainImage} alt="" className="w-[150px]" />
                            <div className="flex  justify-center items-center mt-8 mb-5">
                                <div className="w-[55px] h-[55px] bg-[#f2482220] rounded-full flex justify-center items-center">
                                <i className="fa-solid fa-x text-2xl text-red-600"></i>
                            </div>
                            </div>
                            <h1 className="text-[20px] font-bold py-2">Verification Failed</h1>
                            <p className="text-[16px] font-medium text-[#616161] w-[390px] text-center py-2">
                            We couldn't verify your email. The link may have
                            expired or is invalid.
                            </p>
                            <button className=' px-10  py-3 rounded-full  bg-mainColor text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium  mt-9' onClick={()=>{
                                    ResendVerificationEmail()
                            }}>Resend Verification</button>
                        </div>
                    </main>
                </section>
        </>
    );
}

export default VerificationFailed;
