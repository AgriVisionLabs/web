import { useContext, useEffect, useState } from 'react';
import { AllContext } from '../../Context/All.context';
import MenuElement from '../MenuElement/MenuElement';
import { object, string } from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import { userContext } from '../../Context/User.context';
const EditTeam = (children) => {
    let {outClick,setTeam,setReview,setBasicInfo,onListItem,setOnListItem,baseUrl}=useContext(AllContext);
    let {token}=useContext(userContext);
    let [indexBI,setIndexBI]=useState(1);
    let [invitations,setInvitations]=useState([]);
    let [idOfUser,setIdOfUser]=useState(null);
    let [emailOrNameField,setEmailOrNameField]=useState(null);
    let [role,setRole]=useState(null);
    var forms=["Owner","Manager","Expert","Worker"]; 
    const validationSchema =object({
        recipient:string().required("Recipient is required") ,
        roleName:string().required("RoleName is required"),
    })
    async function getInvitations(){
        try {
            const options={
                url:`${baseUrl}/farms/${children.farmId}/Invitations/pending` ,
                method:"GET",
                headers:{
                    Authorization:`Bearer ${token}`,
                },
            }
            let {data}=await axios(options);
            console.log("getUsers",data)
            console.log(data)
            setInvitations(data)
            
            children.setTeamMemberList()
        }catch(error){
            toast.error("Incorrect email or password "+error);
            console.log(error)
        }finally{
            toast.dismiss("Incorrect");
        }
    }
    // async function deleteInvitations(farmId,invitationId){
    // try {
    //     const options={
    //         url:`${baseUrl}/farms/${farmId}/Invitations/${invitationId}` ,
    //         method:"DELETE",
    //         headers:{
    //             Authorization:`Bearer ${token}`,
    //         },
    //     }
    //     let {data}=await axios(options);
    //     getInvitations()
    // }catch(error){
    //     toast.error("Incorrect email or password "+error);
    // }finally{
    //     toast.dismiss("Incorrect");
    //     getInvitations()
        
    // }
    // }
    // async function updateMemberRole(value){
    //         try {
    //             const options={
    //                 url:`${baseUrl}/farms/${children.farmId}/members/${idOfUser}` ,
    //                 method:"POST",
    //                 headers:{
    //                     Authorization:`Bearer ${token}`,
    //                 },
    //                 data:value,
    //             }
    //             let {data}=await axios(options);
    //             getInvitations()
    //         }catch(error){
    //             toast.error("Incorrect email or password "+error);
    //         }finally{
    //             toast.dismiss("Incorrect");
                
    //         }
    // }
    function updateMemberRole(values){
        const alreadyExists = invitations.some(
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
                invitations.push({recipient:values.recipient,roleName:values.roleName})
                children.setFarmData(prev => ({
                    ...prev,
                    invitations:invitations,
                }));
                values.recipient=""
            }
        useEffect(()=>{
            getInvitations()
        },[])
        useEffect(()=>{
            children.setFarmData(prev => ({
                    ...prev,
                    invitations:invitations,
                }));
        },[invitations])
        const formik=useFormik({
            initialValues:{
                roleName:""
            },
            validationSchema,
            onSubmit:updateMemberRole,
        })
        useEffect(()=>{formik.values.roleName=forms[indexBI]},[])
    return (
        <section className="h-[100vh] flex justify-center items-center bg-black bg-opacity-70  font-manrope backdrop-blur-[blur(5)] absolute z-50 w-[100%]" onClick={(e)=>{
            if(e.target===e.currentTarget){
                outClick()
                }}}>
                
                <div className=" w-[600px] h-[690px] border-2 rounded-2xl bg-white flex  flex-col items-center">
                <div className="w-[90%] mt-5 text-[22px]  flex justify-end">
                    <i className="fa-solid fa-x text-[#9F9F9F] hover:text-black transition-colors duration-300 " onClick={()=>{
                        setTeam(false);
                    }} ></i>
                </div>
                <div className="flex flex-col justify-center items-center mt-5 mb-[12px]">
                <div className=" capitalize mb-5 text-[20px] font-semibold text-mainColor">Edit Farm</div>
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
                <div className="w-[90%] mt-4 flex-grow  flex flex-col justify-between   text-[18px] h-[90%]">
                    <div className=" flex flex-col justify-between ">
                        <form action="" className="grid grid-cols-4 gap-6   " onSubmit={formik.handleSubmit}>
                            <div className=" col-span-2 ">
                                <label htmlFor="" className='ms-1 '>Email or Username</label>
                                <input type="text" placeholder={emailOrNameField} name='recipient' value={formik.values.recipient} onChange={formik.handleChange} onBlur={formik.handleBlur} className='formControl   h-[45px] mx-0 rounded-xl text-[16px] mb-0 my-2  w-[100%] border-[#0d121c21] hover:border-[#0d121c21]  ' />
                            </div>
                            <div className=" h-full ">
                                <label htmlFor="" className='ms-1 ' >Role</label>
                                <MenuElement Items={forms} name={role} width={130+"px"} Pformat={"text-[16px]  font-[400] my-0  select-none  text-[#9F9F9F]"} className={" rounded-xl border-[1px] mt-2  px-2 py-5 mb-[4px]  h-[45px] border-[#0d121c21]"}  onList={onListItem} setOnList={setOnListItem} nameChange={forms[indexBI]} setIndex={setIndexBI}  />
                                
                            </div>
                            <div className=" relative ">
                                <button type="submit" className="btn absolute bottom-0   rounded-xl  h-[45px] self-end py-5 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor mb-[4px] border-2 hover:text-mainColor font-medium ">Add</button>
                            </div>
                            
                        </form>
                    </div>
                    <div className=" flex-grow  overflow-hidden  ">
                        <p className="text-[20px] text-[#0b0b0bd8] font-semibold ">Team Members</p>
                        <div className="h-[90%] overflow-y-auto">
                            {children.farmData?.invitations.map((item,index)=>{
                                    return <div key={index} className="flex justify-between items-center bg-[#1e693021] py-3 px-5 my-1 rounded-lg cursor-pointer  " onClick={()=>{
                                        setIdOfUser(item.id);
                                        setEmailOrNameField(item.receiverUserName!="User not registered"?item.receiverUserName:item.receiverEmail)
                                        setRole(forms[item.roleName])
                                    }}>
                                    <p className="">{item.recipient}</p>
                                    <div className="flex items-baseline space-x-4">
                                        <p className=" capitalize ">{item.roleName}</p>
                                        <i className="fa-solid fa-x text-[16px] hover:text-red-700  transition-all duration-300" onClick={()=>{
                                            children.farmData.invitations=children.farmData.invitations.filter((_,index2)=>index2!==index)
                                                children.setTeamMemberList(children.farmData.invitations)
                                                getInvitations()
                                        }}></i>
                                        {/* <p className="capitalize">
                                        {item.receiverUserName!="User not registered"?item.receiverUserName:item.receiverEmail}
                                        </p>
                                    <div className="flex items-baseline space-x-4">
                                        <p className=" capitalize ">{item.roleName}</p>
                                        <i className="fa-solid fa-x text-[16px] hover:text-red-700  transition-all duration-300" onClick={()=>{
                                            deleteInvitations(item.farmId,item.id)
                                        }}></i>
                                    </div> */}
                                    </div>
                                </div>
                                })}
                        </div>
                        
                    </div>
                    <div className="flex justify-between items-center ">
                        <i className="fa-solid fa-angle-left hover:text-mainColor  transition-all duration-300  cursor-pointer text-[22px]"  onClick={()=>{
                                    setTeam(false);
                                    setBasicInfo(true);
                        }}></i>
                        <button className="btn self-end rounded-lg py-4 bg-mainColor text-[16px] text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium "onClick={()=>{
                            setTeam(false);
                            setReview(true);
                        }}>Next <i className="fa-solid fa-angle-right ms-3"></i></button>
                    </div>
                    
                </div>
                </div>
                
            </section>)
}

export default EditTeam;
