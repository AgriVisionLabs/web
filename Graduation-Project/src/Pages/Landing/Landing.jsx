
import Logo from "../../assets/logo/AgrivisionLogo.svg";
import img1 from "../../assets/images/image 4.png"
import { Link } from "react-router-dom";
const Landing = () => {
    return (
        <>  
        <section className='LandingPage'>
            <nav className="navbarLandingPage container w-full h-[52px] my-6 ">
                    <div className="flex justify-between items-center">
                            <div className="logo w-[160px]">
                                <Link to="/">
                                    <img src={Logo} alt="" className="w-full"/>
                                </Link>
                            </div>
                            
                            <div className="links flex items-center space-x-[15px]">
                                <Link to={"/SignUp"} className="btn bg-mainColor text-white hover:bg-white hover:text-mainColor hover:border-mainColor">Register</Link >
                                <Link to={"/Login"} className="btn text-mainColor bg-transparent  border-mainColor hover:bg-mainColor hover:text-white">Login</Link>
                            </div>
                    </div>
            </nav>
            <section className="container w-full  mt-16 flex justify-between items-center">
                <div className="w-[700px] h-[256px] ">
                    <h1 className="text-mainColor text-[52px] pb-4 font-manrope font-semibold">Welcome to Agrivision</h1>
                    <p className=" font-manrope text-[24px] font-medium text-[#0D121C]">We aim to be your primary partner in boosting your agricultural productivity and simplifying your daily operations.</p>
                </div>
                <div className="w-[600px] h-[600px] flex justify-end">
                    <img src={img1} alt="" className="w-[400px]  rounded-t-[300px] rounded-bl-[300px] rounded-br-[30px] object-cover" />
                </div>
            </section>
            <section className="container bg-[#D7FFE3] bg-opacity-85 mt-24 rounded-xl pb-10">
                <header className="font-bold text-[24px] text-[#0D121C] py-7 text-center font-manrope w-full">Features</header>
                <div className="content grid grid-cols-12 px-10 text-center">
                    <div className="col-span-4">
                        <h3 className="font-manrope text-[22px] font-semibold pb-5">Disease Detection</h3>
                        <p className="font-medium font-manrope text-[20px] capitalize">Detect crop diseases early with ai-powered image recognition</p>
                    </div>
                    <div className="col-span-4">
                        <h3 className="font-manrope text-[22px] font-semibold pb-5">Automated Irrigation</h3>
                        <p className="font-medium font-manrope text-[20px] capitalize">Optimize water usage with smart, automated irrigation systems.</p>
                    </div>
                    <div className="col-span-4">
                        <h3 className="font-manrope text-[22px] font-semibold pb-5">Analytics</h3>
                        <p className="font-medium font-manrope text-[20px] capitalize">Make data-driven decisions with comprehensive farm analytics.</p>
                    </div>
                </div>
            </section>
            <section className="container mt-24">
                <header className="font-bold text-[24px] text-[#0D121C] mb-7 text-center font-manrope w-full">Agrivision Pricing</header>
                <div className="grid grid-cols-12 gap-5">
                    <div className="w-full h-fit rounded-[15px] border-2 border-[#9F9F9F] px-4 py-7 space-y-3 col-span-4">
                        <div className="font-manrope my-1 ">
                            <header className="font-manrope text-[22px] flex justify-between items-center mb-3">
                                <h3 className="font-bold ">Basic</h3>
                                <p className="font-medium text-mainColor text-[20px]">Free</p>
                            </header>
                            <div className="flex items-baseline space-x-1 pb-2 ">
                            <i className="fa-solid fa-check text-mainColor"></i>
                            <p className="font-medium text-[19px] capitalize">1 farm</p>
                            </div>
                            <div className="flex items-baseline space-x-1 pb-2">
                            <i className="fa-solid fa-check text-mainColor"></i>
                            <p className="font-medium text-[19px] capitalize">Up to 3 Fields</p>
                            </div>
                        </div>
                        <div className="font-manrope">
                            <header className="font-manrope text-[22px]  mb-3">
                                <h3 className="font-bold ">Features:</h3>
                            </header>
                            <div className="flex items-baseline space-x-1 pb-2">
                            <i className="fa-solid fa-check text-mainColor"></i>
                            <p className="font-medium text-[19px] capitalize">Access to the dashboard for farm and field management.</p>
                            </div>
                            <div className="flex items-baseline space-x-1 pb-2">
                            <i className="fa-solid fa-check text-mainColor"></i>
                            <p className="font-medium text-[19px] capitalize">Basic soil health and weather insights.</p>
                            </div>
                            <div className="flex items-baseline space-x-1 pb-2">
                            <i className="fa-solid fa-check text-mainColor"></i>
                            <p className="font-medium text-[19px] capitalize">AI-powered disease detection for limited usage</p>
                            </div>
                        </div>
                        <div className="px-2">
                        <button className="w-full rounded-2xl   btn bg-mainColor text-white hover:bg-green-900 text-[17px] font-medium">Get Started</button>
                        </div>
                    </div>
                    <div className="w-full h-fit rounded-[15px] border-2 border-[#9F9F9F] px-4 py-7 space-y-3 col-span-4">
                        <div className="font-manrope my-1 ">
                            <header className="font-manrope text-[22px] flex justify-between items-center mb-3">
                                <h3 className="font-bold ">Advanced</h3>
                                <p className="font-medium text-mainColor text-[18px]">499.99 L.E / month</p>
                            </header>
                            <div className="flex items-baseline space-x-1 pb-2 ">
                            <i className="fa-solid fa-check text-mainColor"></i>
                            <p className="font-medium text-[19px] capitalize">Up to 3 farms</p>
                            </div>
                            <div className="flex items-baseline space-x-1 pb-2">
                            <i className="fa-solid fa-check text-mainColor"></i>
                            <p className="font-medium text-[19px] capitalize">5 fields per farm</p>
                            </div>
                        </div>
                        <div className="font-manrope ">
                            <header className="font-manrope text-[22px]  mb-3">
                                <h3 className="font-bold ">Features:</h3>
                            </header>
                            <div className="flex items-baseline space-x-1 pb-2">
                            <i className="fa-solid fa-check text-mainColor"></i>
                            <p className="font-medium text-[19px] capitalize">All Free Plan features.</p>
                            </div>
                            <div className="flex items-baseline space-x-1 pb-2">
                            <i className="fa-solid fa-check text-mainColor"></i>
                            <p className="font-medium text-[19px] capitalize">Advanced analytics and predictive insights.</p>
                            </div>
                            <div className="flex items-baseline space-x-1 pb-2">
                            <i className="fa-solid fa-check text-mainColor"></i>
                            <p className="font-medium text-[19px] capitalize">Unlimited AI-powered disease detection.</p>
                            </div>
                            <div className="flex items-baseline space-x-1 pb-2">
                            <i className="fa-solid fa-check text-mainColor"></i>
                            <p className="font-medium text-[19px] capitalize">Customizable automation rules for irrigation and sensor integration.</p>
                            </div>
                        </div>
                        <div className="px-2">
                        <button className="w-full rounded-2xl   btn bg-mainColor text-white hover:bg-green-900 text-[17px] font-medium">Get Started</button>
                        </div>
                    </div>
                    <div className="w-full h-fit rounded-[15px] border-2 border-[#9F9F9F] px-4 py-7 space-y-3 col-span-4">
                        <div className="font-manrope my-1 ">
                            <header className="font-manrope text-[22px] flex justify-between items-center mb-3">
                                <h3 className="font-bold ">Enterprise</h3>
                                <p className="font-medium text-mainColor text-[20px]">Custom</p>
                            </header>
                            <div className="flex items-baseline space-x-1 pb-2 ">
                            <i className="fa-solid fa-check text-mainColor"></i>
                            <p className="font-medium text-[19px] capitalize">Unlimited farms</p>
                            </div>
                            <div className="flex items-baseline space-x-1 pb-2">
                            <i className="fa-solid fa-check text-mainColor"></i>
                            <p className="font-medium text-[19px] capitalize">Unlimited fields per farm</p>
                            </div>
                        </div>
                        <div className="font-manrope">
                            <header className="font-manrope text-[22px]  mb-3">
                                <h3 className="font-bold ">Features:</h3>
                            </header>
                            <div className="flex items-baseline space-x-1 pb-2">
                            <i className="fa-solid fa-check text-mainColor"></i>
                            <p className="font-medium text-[19px] capitalize">All Advanced Plan features.</p>
                            </div>
                            <div className="flex items-baseline space-x-1 pb-2">
                            <i className="fa-solid fa-check text-mainColor"></i>
                            <p className="font-medium text-[19px] capitalize">Dedicated account manager for personalized support.</p>
                            </div>
                            <div className="flex items-baseline space-x-1 pb-2">
                            <i className="fa-solid fa-check text-mainColor"></i>
                            <p className="font-medium text-[19px] capitalize">Dedicated account manager for personalized support.</p>
                            </div>
                        </div>
                        <div className="px-2">
                        <button className="w-full rounded-2xl   btn bg-mainColor text-white hover:bg-green-900 text-[17px] font-medium">Contact Sales</button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="border mt-24 border-y-[#0D121C] border-opacity-25 bg-[#F4F4F4] font-manrope">
                <div className="container py-9 grid grid-cols-12 font-manrope gap-16 leading-6">
                    <div className="col-span-3 flex justify-center">
                        <div className="">
                        <header className="mb-4">
                            <img src={Logo} alt="" className="w-[140px]" />
                        </header>
                        <p className="text-[15px]  font-medium">We aim to be your primary partner in boosting your agricultural productivity and simplifying your daily operations.</p>
                        </div>
                    </div>
                    <div className="col-span-3 flex justify-center">
                        <div className="">
                        <header className="mb-4">
                            <p className="capitalize text-mainColor text-[20px] font-semibold">features</p>
                        </header>
                        <div className="">
                            <p className="text-[16px] pb-1 font-medium">Disease detection</p>
                            <p className="text-[16px] pb-1 font-medium">Automated irrigation</p>
                            <p className="text-[16px] pb-1 font-medium">analytics</p>
                        </div>
                        </div>
                    </div>
                    <div className="col-span-3 flex justify-center">
                        <div className="">
                        <header className="mb-4">
                            <p className="capitalize text-mainColor text-[20px] font-semibold">Support</p>
                        </header>
                        <div className="">
                            <p className="text-[16px] pb-1 font-medium">Privacy Policy</p>
                            <p className="text-[16px] pb-1 font-medium">Terms of Service</p>
                            <p className="text-[16px] pb-1 font-medium">Support</p>
                            <p className="text-[16px] pb-1 font-medium">pricing</p>
                        </div>
                        </div>
                    </div>
                    <div className="col-span-3 flex justify-center">
                        <div className="">
                        <header className="mb-4">
                            <p className="capitalize text-mainColor text-[20px] font-semibold">Contact Us</p>
                        </header>
                        <div className="">
                            <div className="flex items-baseline">
                            <i className="fa-solid fa-phone pe-2"></i>
                            <p className="text-[16px]  font-medium">
                            +20 155 555 5555
                            </p>
                            </div>
                            <div className="flex items-baseline space-y-4">
                            <i className="fa-solid fa-envelope pe-2"></i>
                            <p className="text-[16px] font-medium">exmaple@gmail.com</p>
                            </div>
                            <div className="flex items-baseline space-x-3 my-5">
                            <i className=" text-xl fa-brands fa-facebook"></i>
                            <i className=" text-xl fa-brands fa-twitter"></i>
                            <i className=" text-xl fa-brands fa-instagram"></i>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer className="bg-[#F4F4F4] font-manrope py-5">
                <div className="flex justify-center items-baseline space-x-2">
                <i className="fa-regular fa-copyright"></i>
                <p>
                Agrivision. all rights reserved.
                </p>
                </div>
            </footer>
        </section>
        
        </>
    );
}

export default Landing;
