import { useContext, useEffect} from 'react';
import imgLogoIcon from "../../assets/logo/AgrivisionLogo.svg"
import imgPersonalIcon from "../../assets/images/image 6.png"
import { AllContext } from '../../Context/All.context';
const Navbar = () => {
        let {OnMenu, setOnmenu}=useContext(AllContext);
    
    function menuResponsive(){
        let menuRes=document.querySelector("main");
        if(OnMenu){
            menuRes.lastElementChild.classList.remove("w-[88%]")
            menuRes.lastElementChild.classList.add("w-[95%]")
    
            
        }else{
            menuRes.lastElementChild.classList.remove("w-[95%]")
            menuRes.lastElementChild.classList.add("w-[88%]")
            
        }
    }
    function OpenMenuList(){
        let section=document.querySelector("section.Home main section");
        let element=document.querySelector(" div.menuList");
        let element2=document.querySelector(" div.menuList div.log-out");
        if(!OnMenu){
            //text-transparent border-e-2
            //log-out
            // element.classList.add("text-transparent");
            section.classList.add("w-[95%]")
            element2.classList.add("border-t-0");
            element2.classList.remove("border-t-2");
            element.classList.add("w-0");
            element.classList.remove("w-[100%]");
            setOnmenu(true);
        }else{
            // element.classList.remove("text-transparent");
            section.classList.remove("w-[95%]")
            element2.classList.add("border-t-2");
            element2.classList.remove("border-t-0");
            element.classList.add("w-[100%]");
            element.classList.remove("w-0");
            setOnmenu(false);
            }
    }
    
    useEffect(()=>{
        menuResponsive()
    },[OnMenu])
    
    return (
        <nav className=" h-[48px] z-50  fixed order-5  right-0 left-0 flex justify-between items-center  bg-[#F7F7F7] px-2 md:px-[25px] py-[10px]  text-[21px] border-b-2 border-[#0d121c21] transition-all duration-500">
                            <div className="menu&Icon flex  items-center lg:space-x-5 ">
                                <i className="fa-solid fa-bars hover:text-mainColor w-0 overflow-hidden  lg:w-5 transition-all duration-500" onClick={()=>{
                                    OpenMenuList()
                                }}></i>
                                <img src={imgLogoIcon} alt="" className="w-[115px]" />
                            </div>
                            <div className="PersonalِِAccount&notifications  flex  items-center space-x-5">
                            <i className="fa-solid fa-bell hover:text-mainColor"></i>
                            <img src={imgPersonalIcon} alt="" className="w-7" />
                            </div>
        </nav>
    );
}

export default Navbar;
