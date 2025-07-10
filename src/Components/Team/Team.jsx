import { useContext, useEffect, useState } from 'react';
import { AllContext } from '../../Context/All.context';
import MenuElement from '../MenuElement/MenuElement';
import { object, string } from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import { userContext } from '../../Context/User.context';
import { motion } from 'framer-motion';
const Team = (children) => {
    let {outClick,setTeam,setReview,setBasicInfo,onListItem,setOnListItem,baseUrl}=useContext(AllContext);
    let {token}=useContext(userContext);
    let [indexBI,setIndexBI]=useState(1);
    let [teamMembers,setTeamMembers]=useState([]);
    // console.log(teamMemberList)
    var forms=["Owner","Manager","Expert","Worker"]; 
    const validationSchema =object({
        recipient:string().required("Recipient is required") ,
        roleName:string().required("RoleName is required"),
    })
//     async function getInvitations(){
//         try {
//             console.log("getInvitations :-")
//             const options={
//                 url:`${baseUrl}/farms/${children.farmId}/Invitations/pending` ,
//                 method:"GET",
//                 headers:{
//                     Authorization:`Bearer ${token}`,
//                 },
//             }
//             let {data}=await axios(options);
//             console.log(data)
//             setTeamMembers(data)
//             children.setTeamMemberList(data)
//         }catch(error){
//             toast.error("Incorrect email or password "+error);
//             console.log(error)
//         }finally{
//             toast.dismiss("Incorrect");
//         }
// }
//     async function deleteInvitations(farmId,invitationId){
//         try {
//             const options={
//                 url:`${baseUrl}/farms/${farmId}/Invitations/${invitationId}` ,
//                 method:"DELETE",
//                 headers:{
//                     Authorization:`Bearer ${token}`,
//                 },
//             }
//             let {data}=await axios(options);
//             getInvitations()
//         }catch(error){
//             toast.error("Incorrect email or password "+error);
//         }finally{
//             toast.dismiss("Incorrect");
//             getInvitations()
            
//         }
//     }
//     async function sendInvitations(value){
//             try {
//                 const options={
//                     url:`${baseUrl}/farms/${children.farmId}/Invitations` ,
//                     method:"POST",
//                     headers:{
//                         Authorization:`Bearer ${token}`,
//                     },
//                     data:value,
//                 }
//                 let {data}=await axios(options);
//                 getInvitations()
//             }catch(error){
//                 toast.error("Incorrect email or password "+error);
//             }finally{
//                 toast.dismiss("Incorrect");
                
//             }
//         }
        // useEffect(()=>{getInvitations()},[])
    
    function AddInvitations(values){
        const alreadyExists = children.teamMemberList.some(
            (member) => member.recipient === values.recipient
            );
            if (!values.recipient||!values.roleName) {
                toast.error("the data is incomplete.");
                return;
            }
            if (alreadyExists) {
                toast.error("This user is already invited.");
                return;
            }
                children.teamMemberList.push({recipient:values.recipient,roleName:values.roleName})
                children.setFarmData(prev => ({
                    ...prev,
                    invitations:children.teamMemberList,
                }));
                values.recipient=""
            }

        useEffect(() => {
            console.log("children.farmData",children.farmData)
                console.log("after");
                console.log("farmData updated ===>", children.farmData);
            }, [children.farmData]);
        const formik=useFormik({
            initialValues:{
                recipient:"",
                roleName:""
            },
            validationSchema,
            onSubmit:AddInvitations,
        })
        useEffect(()=>{formik.values.roleName=forms[indexBI]},[indexBI])
        function displayInvitations(){
            children.setFarmData(prev => ({
                ...prev,
            }))
        }

        
        // useEffect(() => {
        //     displayInvitations()
        // }, [children.farmData]);
    return (
        <section className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70  font-manrope backdrop-blur-[blur(5)] absolute z-50 w-[100%]" onClick={(e)=>{
            if(e.target===e.currentTarget){
                outClick()
                }}}>
                <motion.div
                        initial={{ x: 0, y: 500, opacity: 0 }}
                        animate={{ x: 0, y: 0, opacity: 1 }}
                        transition={{
                            delay:  0.2,
                            duration: 2,
                            type: "spring",
                            bounce: 0.4,
                            }} className=" w-[620px] h-[690px] border-2 rounded-2xl bg-white flex  flex-col items-center">
                    <div className="w-[90%] mt-5 text-[22px]  flex justify-end">
                        <i className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300 " onClick={()=>{
                            setTeam(false);
                        }} ></i>
                    </div>
                    <div className="flex flex-col justify-center items-center mt-5 mb-[12px]">
                    <div className=" capitalize mb-5 text-[20px] font-semibold text-mainColor">add new farm</div>
                    <div className="w-[100%] rounded-xl flex gap-4  items-center">
                        <div className=" flex flex-col items-center ">
                        <div className="w-[35px] h-[35px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full"><p className="">1</p>
                        </div>
                        <p className="mt-2">Basic Info</p>
                        </div>
                        <div className="w-[100px] h-[1.6px] rounded-full bg-mainColor opacity-[0.3]"></div>
                        <div className=" flex flex-col items-center ">
                        <div className="w-[35px] h-[35px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full "><p className="">2</p>
                        </div>
                        <p className="mt-2   ">Team</p>
                        </div>
                        <div className="w-[100px] h-[1.6px] rounded-full bg-mainColor opacity-[0.3]"></div>
                        <div className=" flex flex-col items-center ">
                        <div className="w-[35px] h-[35px] text-[20px] text-white flex justify-center items-center bg-mainColor rounded-full opacity-[0.3]"><p className="">3</p>
                        </div>
                        <p className="mt-2">Review</p>
                        </div>
                    </div>
                    </div>
                    <div className="w-[85%] mt-4 flex-grow  flex flex-col justify-between    text-[18px] h-[90%]">
                        <div className=" flex flex-col justify-between ">
                            <form action="" className="grid grid-cols-4 gap-4 " onSubmit={formik.handleSubmit}>
                                <div className=" col-span-2">
                                    <label htmlFor="" className='ms-1 '>Email or Username</label>
                                    <input type="email" placeholder='Enter Email or Username' name='recipient' value={formik.values.recipient} onChange={formik.handleChange} onBlur={formik.handleBlur} className='formControl   h-[45px] mx-0 rounded-xl text-[16px]  w-[100%] border-[#0d121c21] '/>
                                </div>
                                <div className="col-span-1 h-full ">
                                    <label htmlFor="" className='ms-1 ' >Role</label>
                                    <MenuElement Items={forms} name={"manager"} width={140+"px"} Pformat={"text-[16px] font-[400]  select-none mt-0  text-[#000] "} className={" rounded-xl border-[1px]  mt-3   px-2 py-5 mb-[4px]  h-[45px] border-[#0d121c21]"}  onList={onListItem} setOnList={setOnListItem} nameChange={forms[indexBI]} setIndex={setIndexBI} index={indexBI}  />
                                    
                                </div>
                                <div className="col-span-1  flex justify-center mb-[12px]">
                                    <button type="submit" className="btn w-[100px]  rounded-xl  h-[45px] self-end py-5 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium  ">Add</button>
                                </div>
                                
                            </form>
                        </div>
                        <div className=" flex-grow  overflow-hidden  ">
                            <p className="text-[20px] text-[#0b0b0bd8] font-semibold ">Team Members</p>
                            <div className="h-[300px] overflow-y-auto">
                                {children.farmData?.invitations.map((item,index)=>{
                                    return item.recipient? <div key={index} className="flex justify-between items-center bg-[#1e693021] py-3 px-5 my-1 rounded-lg  " >
                                        <p className="">
                                            {item.recipient}
                                            </p>
                                        <div className="flex items-baseline space-x-4">
                                            <p className=" capitalize ">{item.roleName}</p>
                                            <i className="fa-solid fa-x text-[16px] hover:text-red-700  transition-all duration-300" onClick={()=>{
                                                console.log("children.farmData",children.farmData)
                                                console.log("children.teamMembersList",children.teamMemberList)
                                                children.farmData.invitations=children.farmData.invitations.filter((_,index2)=>index2!==index)
                                                children.setTeamMemberList(children.farmData.invitations)
                                                displayInvitations()
                                            }}></i>
                                        </div>
                                    </div>:null
                                    })}
                            </div>
                            
                        </div>
                        <div className="flex justify-between items-center mb-[10px] ">
                            <i className="fa-solid fa-angle-left hover:text-mainColor  transition-all duration-300  cursor-pointer text-[22px]"  onClick={()=>{
                                        setTeam(false);
                                        setBasicInfo(true);
                            }}></i>
                            <button className="btn self-end w-fit px-[20px] rounded-lg py-4 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium "onClick={()=>{
                                setTeam(false);
                                setReview(true);
                            }}>Next <i className="fa-solid fa-angle-right ms-3"></i></button>
                        </div>
                        
                    </div>
                </motion.div>
                
            </section>)
}

export default Team;
