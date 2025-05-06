import { LayoutDashboard,Tractor,ListChecks,FireExtinguisher,Thermometer,ChartNoAxesCombined,Settings,LogOut, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../../Context/User.context';
import { useContext } from 'react';

const Sidebar = () => {
    let {logOut,setOnOpenPage}=useContext(userContext)
    const navigate=useNavigate();
    // function active(e,n){
    //         let elements=document.querySelectorAll(" div div.activePage1 div");
    //         let elements2=document.querySelectorAll(" div div.activePage2 div");
    //         let count=-1
    //         if(n==1){
    //             for(const element of elements){
    //                 count++;
    //                 if(element!=e.target.parentElement){
    //                     element.classList.remove("text-mainColor","text-mainColor","font-[500]");
    //                     elements2[count].classList.remove("text-mainColor","text-mainColor","font-[500]");
    //                 }else if(element==e.target.parentElement||element==e.target){
    //                     setOnOpenPage(count);
    //                     element.classList.add("text-mainColor","text-mainColor","font-[500]");
    //                     elements2[count].classList.add("text-mainColor","text-mainColor","font-[500]");
    //                 }
    //             }
    //         }
    //         else if(n==2){
    //             for(const element of elements2){
    //                 count++;
    //                 if(element!=e.target.parentElement){
    //                     element.classList.remove("text-mainColor","text-mainColor","font-[500]");
    //                 }else{
    //                     setOnOpenPage(count);
    //                     element.classList.add("text-mainColor");
    //                     element.classList.add("font-[500]");
    //                     elements[count].classList.add("text-mainColor");
    //                 }
    //             }
            
    //     }
    // }
    function active(e,n){
        // let e1=document.getElementsByClassName("activePage1").firstElementChild;
        // console.log(e.target);
        let elements=document.querySelectorAll(" div div.activePage1 div");
        let elements2=document.querySelectorAll(" div div.activePage2 div");
        let count=-1
        if(n==1){
            for(const element of elements){
                count++;
                if(element!=e.target.parentElement&&element!=e.target){
                    element.classList.remove("text-mainColor");
                    elements2[count].classList.remove("text-mainColor");
                    elements2[count].classList.remove("font-[500]")
                }else if(element==e.target.parentElement||element==e.target){
                    setOnOpenPage(count);
                    element.classList.add("text-mainColor");
                    elements2[count].classList.add("text-mainColor");
                    elements2[count].classList.add("font-[500]")
                }
            }
        }
        else{
            for(const element of elements2){
                count++;
                if(element!=e.target.parentElement){
                    element.classList.remove("text-mainColor");
                    element.classList.remove("font-[500]");
                    elements[count].classList.remove("text-mainColor");
                }else{
                    setOnOpenPage(count);
                    element.classList.add("text-mainColor");
                    element.classList.add("font-[500]");
                    elements[count].classList.add("text-mainColor");
                }
            }
        
    }
}
// function menuResponsive(){
//     let menuRes=document.querySelector("main");
//     if(OnMenu){
//         menuRes.lastElementChild.classList.remove("w-[88%]")
//         menuRes.lastElementChild.classList.add("w-[95%]")

        
//     }else{
//         menuRes.lastElementChild.classList.remove("w-[95%]")
//         menuRes.lastElementChild.classList.add("w-[88%]")
        
//     }
// }
// function OpenMenuList(){
//     let section=document.querySelector("section.Home main section");
//     let element=document.querySelector("main div.menuList");
//     let element2=document.querySelector("main div.menuList div.log-out");
//     if(!OnMenu){
//         //text-transparent border-e-2
//         //log-out
//         // element.classList.add("text-transparent");
//         section.classList.add("w-[95%]")
//         element2.classList.add("border-t-0");
//         element2.classList.remove("border-t-2");
//         element.classList.add("w-0");
//         element.classList.remove("w-[100%]");
//         setOnmenu(true);
//     }else{
//         // element.classList.remove("text-transparent");
//         section.classList.remove("w-[95%]")
//         element2.classList.add("border-t-2");
//         element2.classList.remove("border-t-0");
//         element.classList.add("w-[100%]");
//         element.classList.remove("w-0");
//         setOnmenu(false);
//         }
// }

// useEffect(()=>{
//     menuResponsive()
// },[OnMenu,onOpenPage])
    return (
        <div className="transition-all  duration-500">
        <div  className="sidebar  w-auto  z-50 order-8 fixed top-[48px] bottom-0 flex  me-6  text-[#0D121C]  font-[400]   ">
            
            <div className="bg-[#F7F7F7] flex  flex-col justify-between border-[#0d121c21] border-e-2 lg:border-0 h-[100%]">
                <div className="px-3 xl:ps-6 xl:pe-5 pt-12 activePage1 transition-all duration-300 space-y-[30px]" onClick={(e)=>{active(e,1)}}>
                    <div className="flex cursor-pointer  hover:text-[#1E6930]  text-mainColor">
                        <LayoutDashboard className=" transition-all duration-300 "/>
                    </div>
                    <div className="flex cursor-pointer  hover:text-[#1E6930] " >
                        <Tractor className=" transition-all duration-300"/>
                    </div>
                    <div className="flex cursor-pointer  hover:text-[#1E6930] ">
                        <ListChecks className=" transition-all duration-300"/>
                    </div>
                    <div className="flex cursor-pointer  hover:text-[#1E6930] ">
                        <FireExtinguisher className=" transition-all duration-300"/>
                    </div>
                    <div className="flex cursor-pointer  hover:text-[#1E6930] ">
                        <Search className=" transition-all duration-300 rotate-[100deg]   "/>
                    </div>
                    <div className="flex cursor-pointer  hover:text-[#1E6930] ">
                        <Thermometer className=" transition-all duration-300 "/>
                    </div>
                    <div className="flex cursor-pointer  hover:text-[#1E6930] ">
                        <ChartNoAxesCombined className=" transition-all duration-300"/>
                    </div>
                    <div className="flex cursor-pointer  hover:text-[#1E6930] ">
                        <Settings className=" transition-all duration-300"/>
                    </div>
                </div>
                <div className="flex px-3 lg:ps-6 lg:pe-5 text-[16px]  hover:text-[#1E6930] pt-3 border-t-2 transition-all duration-300 ">
                <div  className="flex pb-3 pt-2 cursor-pointer " onClick={()=>{
                    logOut()
                    navigate("/Login");
                }}>
                    <LogOut className=" transition-all duration-300 "/>
                </div>
                </div>
            </div>
            <div  className={`bg-[#F7F7F7] menuList hidden transition-[width]  overflow-hidden  lg:flex  duration-500   flex-col justify-between h-[100%]   border-[#0d121c21] lg:border-e-2`}>
                <div className="pt-12 activePage2 pe-2 space-y-[30px] "  onClick={(e)=>{active(e,2)}}>
                    <div className="flex cursor-pointer   text-[16px]  hover:text-[#1E6930] text-mainColor font-[500]">
                    <p className="">Dashboard</p>
                    </div>
                    <div className="flex cursor-pointer    text-[16px]  hover:text-[#1E6930] ">
                        <p className="">Farms and fields</p>
                    </div>
                    <div className="flex cursor-pointer    text-[16px]  hover:text-[#1E6930] ">
                        <p className="">Tasks</p>
                    </div>
                    <div className="flex cursor-pointer    text-[16px]  hover:text-[#1E6930] ">
                        <p className="">Irrigation</p>
                    </div>
                    <div className="flex cursor-pointer    text-[15px]  hover:text-[#1E6930] ">
                        <p className="">Disease Detection</p>
                    </div>
                    <div className="flex cursor-pointer    text-[15px]  hover:text-[#1E6930] ">
                        <p className="">Sensors and devices</p>
                    </div>
                    <div className="flex cursor-pointer    text-[16px]  hover:text-[#1E6930] ">
                        <p className="">Analytics</p>
                    </div>
                    <div className="flex cursor-pointer    text-[16px]  hover:text-[#1E6930] ">
                        <p className="">Settings</p>
                    </div>
                </div>
                <div className="log-out text-[16px]  hover:text-[#1E6930] pt-3 border-t-2 ">
                <div  className="  w-[100%] pb-3 pt-2 ">
                    <p className="cursor-pointer font-medium" onClick={()=>{
                        logOut()
                        navigate("/Login");
                    }}>Log out</p>
                </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Sidebar;
