import { Check, Edit, User2, X } from 'lucide-react';

import imageIcon from "../../assets/images/image 6.png"
import { useContext, useEffect, useState } from 'react';
import { AllContext } from '../../Context/All.context';
import { userContext } from '../../Context/User.context';
import axios from 'axios';
import toast from 'react-hot-toast';
const Personal = () => {
    // let [data,setData]=useState({
    //     firstName:{state:0 ,value:""},
    //     lastName:{state:0 ,value:""},
    //     username:{state:0 ,value:""},
    //     email:{state:0 ,value:""},
    //     phoneNumber:{state:0 ,value:""},
    // })
    let {baseUrl}=useContext(AllContext)
    let {token}=useContext(userContext)
    let [firstName,setFirstName]=useState({state:0 ,value:""});
    let [data,setData]=useState({state:0 ,value:""});
    let [lastName,setLastName]=useState({state:0 ,value:""});
    let [username,setUsername]=useState({state:0 ,value:""});
    let [email,setEmail]=useState({state:0 ,value:""});
    let [phoneNumber,setPhoneNumber]=useState({state:0 ,value:""});
    function cancelChange(){
        setFirstName({state:0 ,value:""})
        setLastName({state:0 ,value:""})
        setUsername({state:0 ,value:""})
        setEmail({state:0 ,value:""})
        setPhoneNumber({state:0 ,value:""})
    }
    async function getAccountData(){
        try {
            const options={
                url:`${baseUrl}/Accounts` ,
                method:"GET",
                headers:{
                    Authorization:`Bearer ${token}`,
                },
            }
            let {data}=await axios(options);
            console.log(data)
            setData(data)
        }catch(error){
            if(error.response.data){
                if(error.response.data.errors.length>0){toast.error(error.response.data.errors[0].description);}
                else{toast.error("There is an error");}
            }else{console.log(error)}
        }finally{
            toast.dismiss("Incorrect");
            
        }
    }
    async function updateAccountData(){
        let values={
            firstName:firstName.value?firstName.value:data.firstName,
            lastName:lastName.value?lastName.value:data.lastName,
            userName:username.value?username.value:data.userName,
            phoneNumber:phoneNumber.value?phoneNumber.value:data.phoneNumber
        }
        const filteredValues=Object.fromEntries(
            Object.entries(values).filter(
                ([_, value]) => value !== "" && value !== null && value !== undefined
            )
                )
                    try {
                        const options={
                            url:`${baseUrl}/Accounts` ,
                            method:"PUT",
                            headers:{
                                Authorization:`Bearer ${token}`,
                            },
                            data:filteredValues
                        }
                        let {data}=await axios(options);
                        if(data){
                            cancelChange()
                            getAccountData()
                        }
                        console.log("updateAccountData",data)
                    }catch(error){
                        if(error.response.data){
                            if(error.response.data.errors.length>0){toast.error(error.response.data.errors[0].description);}
                            else{toast.error("There is an error");}
                        }else{console.log(error)}
                    }finally{
                        toast.dismiss("Incorrect");
                        
                    }
    }



    // function toggleButton(e){
    //     let first=e.currentTarget.firstElementChild.classList;
    //     let last=e.currentTarget.lastElementChild.classList
    //     if(e.currentTarget.firstElementChild.firstElementChild==e.target||
    //         e.currentTarget.firstElementChild.firstElementChild.firstElementChild==e.target){
    //         first.remove("flex")
    //         first.add("hidden")
    //         last.remove("hidden")
    //         last.add("flex")
    //     }else if(e.currentTarget.lastElementChild.lastElementChild.firstElementChild==e.target||
    //         e.currentTarget.lastElementChild.lastElementChild.firstElementChild.firstElementChild==e.target){
    //         last.remove("flex")
    //         last.add("hidden")
    //         first.remove("hidden")
    //         first.add("flex")
    //     }
    // }
    useEffect(()=>{getAccountData()},[])
    useEffect(()=>{console.log("firstName",firstName)
console.log("lastName",lastName.value)

    },[firstName])
    return (
        data?<section className='mb-[30px]'>
            <div className=" border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px]  p-[20px] ">
                <div className="">
                    <div className="flex space-x-2 items-center text-[#0D121C]  mb-[10px]">
                        <User2 size={25} strokeWidth={1.8}/>
                        <h2 className="text-[19px] font-medium ">Personal Information</h2>
                    </div>
                    <p className="text-[#9F9F9F] text-[16px] font-medium">Manage your personal details and contact information.</p>
                </div>
                <div className="mt-[25px] pb-[20px] space-y-[20px]  ">
                    <p className="text-[18px] font-medium ">Profile Picture</p>
                    <div className="text-[16px] font-medium flex items-center space-x-6">
                        <img src={imageIcon} alt="" className="w-[100px]" />
                        <div className="flex flex-col items-start space-y-[10px]">
                            <button className='text-[#616161]'>Upload new picture</button>
                            <button className='text-[#E13939]'>Remove</button>
                        </div>
                    </div>
                </div>
                <div className="">
                    <div className="border-t-[1px] border-[#0d121c3c] py-[15px]">
                        <div className="flex justify-between items-center">
                            <h3 className="mb-[12px] text-[17px] font-semibold">Frist Name</h3>
                            <div className="">
                                {
                                !firstName.state?<div className="flex items-center space-x-2">
                                    <Edit strokeWidth={1.4} className='hover:text-mainColor transition-all duration-150'  onClick={()=>{setFirstName(prov=>({ ...prov,state:1}))}}/>
                                    <p className="text-[15px] font-medium">Edit</p>
                                </div>:
                                <div className="flex  items-center space-x-10"  >
                                    <div className="flex items-center space-x-2">
                                        <Check strokeWidth={1.8} className='hover:text-mainColor transition-all duration-150' onClick={()=>{updateAccountData()}}/>
                                        <p className="text-[15px] font-medium">Save</p>
                                    </div>
                                    <div className="flex items-center  space-x-2" >
                                        <X strokeWidth={1.8} className='hover:text-red-500 transition-all duration-150' onClick={()=>{setFirstName({value:"",state:0})}}/>
                                        <p className="text-[15px] font-medium">Cancel</p>
                                    </div>
                                </div>}
                            </div>
                        </div>
                        {firstName.state?
                            <input type="text" className='w-full py-[8px] px-[15px] rounded-[10px] border-[2px] border-[#9F9F9F] placeholder:text-[15px]' placeholder={data.firstName} onChange={(e)=>{setFirstName(prev=>({ ...prev, value:e.target.value?e.target.value:firstName.value}))}} />:
                            <p className="text-[14px] font-medium">{data.firstName}</p>
                            }
                    </div>
                    <div className="border-t-[1px] border-[#0d121c3c] py-[15px]">
                        <div className="flex justify-between items-center">
                            <h3 className="mb-[12px] text-[17px] font-semibold">Last Name</h3>
                            <div className="" >
                                {!lastName.state?<div className="flex items-center space-x-2">
                                    <Edit strokeWidth={1.4} className='hover:text-mainColor transition-all duration-150' onClick={()=>{setLastName(prev=>({...prev,state:1}))}}/>
                                    <p className="text-[14px] font-medium">Edit</p>
                                </div>:
                                <div className="flex  items-center space-x-10 "  >
                                    <div className="flex items-center space-x-2">
                                        <Check strokeWidth={1.8} className='hover:text-mainColor transition-all duration-150' onClick={()=>{updateAccountData()}}/>
                                        <p className="text-[14px] font-medium">Save</p>
                                    </div>
                                    <div className="flex items-center  space-x-2">
                                        <X strokeWidth={1.8} className='hover:text-red-500 transition-all duration-150' onClick={()=>{ setLastName({value:"",state:0})}}/>
                                        <p className="text-[14px] font-medium">Cancel</p>
                                    </div>
                                </div>}
                            </div>
                        </div>
                        {lastName.state?
                        <input type="text" className='w-full py-[8px] px-[15px] rounded-[10px] border-[2px] border-[#9F9F9F] placeholder:text-[15px]'   placeholder={data.lastName} onChange={(e)=>{setLastName(prev=>({...prev,value:e.target.value?e.target.value:lastName.value}))}}/>:
                        <p className="text-[14px] font-medium">{data.lastName}</p>
                        }
                    </div>
                    <div className="border-t-[1px] border-[#0d121c3c] py-[15px]">
                        <div className="flex justify-between items-center">
                            <h3 className="mb-[12px] text-[17px] font-semibold">Username</h3>
                            <div className="">
                                { !username.state?<div className="flex items-center space-x-2">
                                    <Edit strokeWidth={1.4} className='hover:text-mainColor transition-all duration-150' onClick={()=>{setUsername(prev=>({...prev,state:1}))}}/>
                                    <p className="text-[14px] font-medium">Edit</p>
                                </div>:
                                <div className="flex  items-center space-x-10 "  >
                                    <div className="flex items-center space-x-2">
                                        <Check strokeWidth={1.8} className='hover:text-mainColor transition-all duration-150' onClick={()=>{updateAccountData()}}/>
                                        <p className="text-[14px] font-medium">Save</p>
                                    </div>
                                    <div className="flex items-center  space-x-2">
                                        <X strokeWidth={1.8} className='hover:text-red-500 transition-all duration-150' onClick={()=>{setUsername({value:"",state:0})}}/>
                                        <p className="text-[14px] font-medium">Cancel</p>
                                    </div>
                                </div>}
                            </div>
                        </div>
                        { username.state?
                        <input type="text" className='w-full py-[8px] px-[15px] rounded-[10px] border-[2px] border-[#9F9F9F] placeholder:text-[15px]' placeholder={data.userName} onChange={(e)=>{setUsername(prev=>({...prev,value:e.target.value?e.target.value:username.value }))}}/>:
                        <p className="text-[14px] font-medium">{data.userName}</p>}
                    </div>
                    <div className="border-t-[1px] border-[#0d121c3c] py-[15px]">
                        <div className="flex justify-between items-center">
                            <h3 className="mb-[12px] text-[17px] font-semibold">Email</h3>
                            <div className="">
                                {!email.state?<div className="flex items-center space-x-2">
                                    <Edit strokeWidth={1.4} className='hover:text-mainColor transition-all duration-150' onClick={()=>{ setEmail({value:"",state:1})} }/>
                                    <p className="text-[14px] font-medium">Edit</p>
                                </div>:
                                <div className=" flex items-center space-x-10 "  >
                                    <div className="flex items-center space-x-2">
                                        <Check strokeWidth={1.8} className='hover:text-mainColor transition-all duration-150' onClick={()=>{updateAccountData()}}/>
                                        <p className="text-[14px] font-medium">Save</p>
                                    </div>
                                    <div className="flex items-center  space-x-2">
                                        <X strokeWidth={1.8} className='hover:text-red-500 transition-all duration-150' onClick={()=>{ setEmail({
                                            value:"",
                                            state:0
                                        })} }/>
                                        <p className="text-[14px] font-medium">Cancel</p>
                                    </div>
                                </div>}
                            </div>
                        </div>
                        { email.state?
                        <input type="text" className='w-full py-[8px] px-[15px] rounded-[10px] border-[2px] border-[#9F9F9F] placeholder:text-[15px]' placeholder={data.email} onChange={(e)=>{
                            console.log("e.target.value",Boolean(e.target.value))
                            setEmail(prev=>({...prev,value:e.target.value?e.target.value:email.value}))}}/>:
                        <p className="text-[14px] font-medium">{data.email}</p>}
                    </div>
                    <div className="border-t-[1px] border-[#0d121c3c] py-[15px]">
                        <div className="flex justify-between items-center">
                            <h3 className="mb-[12px] text-[17px] font-semibold">Phone Number</h3>
                            <div className="">
                                { !phoneNumber.state?<div className="flex items-center space-x-2">
                                    <Edit strokeWidth={1.4} className='hover:text-mainColor transition-all duration-150' onClick={()=>{setPhoneNumber({value:"",state:1 })}}/>
                                    <p className="text-[14px] font-medium">Edit</p>
                                </div>:
                                <div className="flex  items-center space-x-10"  >
                                    <div className="flex items-center space-x-2">
                                        <Check strokeWidth={1.8} className='hover:text-mainColor transition-all duration-150' onClick={()=>{updateAccountData()}}/>
                                        <p className="text-[14px] font-medium">Save</p>
                                    </div>
                                    <div className="flex items-center  space-x-2">
                                        <X strokeWidth={1.8} className='hover:text-red-500 transition-all duration-150' onClick={()=>{setPhoneNumber({value:"",state:0})}}/>
                                        <p className="text-[14px] font-medium">Cancel</p>
                                    </div>
                                </div>}
                            </div>
                        </div>
                        { phoneNumber.state?
                        <input type="text" className='w-full py-[8px] px-[15px] rounded-[10px] border-[2px] border-[#9F9F9F] placeholder:text-[15px]' placeholder={data.phoneNumber} onChange={(e)=>{setPhoneNumber(prev=>({...prev,value:e.target.value?e.target.value:data.phoneNumber}))}}/>:
                        <p className="text-[14px] font-medium">{data.phoneNumber}</p>}
                    </div>
                </div>
            </div>
        </section>:null
    );
}

export default Personal;
