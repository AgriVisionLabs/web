import {Droplet,Axe,Package,Timer,TriangleAlert,UserCheck,UserX,ClipboardCheck, Truck} from 'lucide-react';
import {Line as LineDrow} from 'rc-progress';
import { XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer ,PieChart, Pie, Cell,LineChart,Line
} from 'recharts';

const TasksPart = () => {
    const data2 = [
    { name: "Completed", value: 68, color: "#34A853" },  
    { name: "InProgress", value: 15, color: "#4285F4" },  
    { name: "Pending", value: 12, color: "#F49E0B" },   
    { name: "Overdue", value: 5, color: "#E13939" }, 
    ];
    const data5 = [
    { month: 'Jan', Completed: 41, Total: 48},
    { month: 'Feb', Completed: 49, Total: 55},
    { month: 'Mar', Completed: 58, Total: 66},
    { month: 'Apr', Completed: 68, Total: 70},
    { month: 'May', Completed: 73, Total: 80},

    ];
    return (
        <section className=''>
            <div className="grid xl:grid-cols-3 gap-[30px] mb-[20px]">
                <div className="col-span-3 md:col-span-2  ">
                    <div className="md:border-[1px]  md:border-[rgba(13,18,28,0.25)] md:rounded-[15px] md:p-[15px]  ">
                        <h2 className="text-[#0D121C] text-[17px] font-medium mb-[15px]">Task Completion Overview</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Task status and completion rates </p>
                        <div className="border-[1px] md:border-none  border-[rgba(13,18,28,0.25)] rounded-[15px] py-[15px] md:py-[0px] mt-[10px] md:mb-[20px]">
                            <div className="flex justify-center mt-[10px] mb-[40px]">
                                    <p className="text-[#616161] text-[17px] font-medium">Task Status Distribution </p>
                            </div>
                            <div className="grid grid-rows-2 md:grid-rows-1 md:grid-cols-2 gap-y-[15px] ">
                                <div className="h-[200px] md:h-[450px]    relative">
                                    
                                    <ResponsiveContainer width="100%"  className="relative">
                                        <PieChart  className=''  >
                                            <Legend  verticalAlign="top"   height={36}  iconSize={20} iconType='plainline'    wrapperStyle={{fontSize:"16px", fontWeight:"500",position:"absolute",top:"-20px"   }} />
                                            
                                            <Pie data={data2} cx="50%" cy='50%'  innerRadius="50%" outerRadius="100%"  paddingAngle={0}  dataKey="value" >
                                                {data2.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color}   />
                                                ))}
                                                
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className=" grid grid-cols-2  justify-center items-center mt-[10px]">
                                    <div className="flex flex-col items-center  gap-y-[30px] md:gap-y-[40px]">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-[10px] h-[10px] rounded-full bg-[#10B982]"></div>
                                            <p className="text-[17px] font-medium">Completed</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-[10px] h-[10px] rounded-full bg-[#4285F4]"></div>
                                            <p className="text-[17px] font-medium">Completed</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-[10px] h-[10px] rounded-full bg-[#F49E0B]"></div>
                                            <p className="text-[17px] font-medium">Completed</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-[10px] h-[10px] rounded-full bg-[#E13939]"></div>
                                            <p className="text-[17px] font-medium">Completed</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center  gap-y-[30px] md:gap-y-[40px]">
                                        <div className="flex px-[12px] py-[2px] rounded-[15px] bg-[#25c4621d] border-[1px] border-[#25C462]  ">
                                            <p className=" capitalize text-[15px] text-[#1E6930] font-bold ">68 Tasks (68%)</p>
                                        </div>
                                        <div className="flex px-[12px] py-[2px] rounded-[15px] bg-[#089efc23] border-[1px] border-[#089FFC]  ">
                                                <p className=" capitalize text-[15px] text-[#089FFC] font-bold ">15 Tasks (15%)</p>
                                        </div>
                                        <div className="px-[12px] py-[2px] rounded-[15px] bg-[rgba(235,178,18,0.20)] border-[1px] border-[#EBB212]">
                                            <p className=" capitalize text-[15px] text-[#CD9B10] font-bold">12 Tasks (12%)</p>
                                        </div>
                                        <div className="px-[12px] py-[2px] rounded-[15px] bg-[#e139391e] border-[1px] border-[#E13939]">
                                            <p className=" capitalize text-[15px] text-[#E13939] font-bold">5 Tasks (5%)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-[400px] border-[1px] md:border-none  border-[rgba(13,18,28,0.25)] rounded-[15px] pt-[0px] pb-[20px] px-[10px] mt-[30px] md:mt-[0px]">
                            <div className="flex justify-center mt-[25px] mb-[0px]">
                                <p className="text-[#616161] text-[17px] font-medium">Task Completion Trend </p>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data5} margin={{ top: 20, right: 10, left: 0, bottom: 20}}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis  dataKey="month" angle={0} padding={{left: 50, right: 50}}/>
                                <YAxis  label={{   value: 'Tasks',   angle: -90, position: "insideLeft" , style: { textAnchor: 'middle', fontSize: 17, fill: '#333' } }} domain={[0,80]} tickCount={3}/>
                                <Tooltip />
                                <Legend  iconSize={20} verticalAlign="top" height={40} iconType="plainline" wrapperStyle={{ fontSize:"16px", fontWeight:"500"}}/>
                                <Line type="monotone" dataKey="Completed" stroke="#3B82F6" strokeWidth={2} activeDot={{ r: 8 }} name="Completed Tasks"/>
                                <Line type="monotone" dataKey="Total" stroke="#F49E0B" strokeWidth={2} activeDot={{ r: 8 }} name="Total Taske"/>
                                
                                </LineChart>
                            </ResponsiveContainer>     
                        </div>
                    </div>
                </div>
                <div className="col-span-3 md:col-span-1 grid grid-rows-2 gap-y-[30px]">
                    <div className="border-[1px] row-span-2 border-[rgba(13,18,28,0.25)] rounded-[15px] p-[15px] ">
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[15px]">Task Categories</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Distribution by task type</p>
                        <div className="mt-[30px]  md:space-y-[30px]  ">
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                        <Droplet size={25} strokeWidth={2} className='text-[#089FFC]' />
                                        <p className="">Irrigation</p>
                                    </div>
                                    <p className=" capitalize text-[16px] font-medium">28 Tasks</p>
                                </div>
                                <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full my-[20px] rounded-lg" />
                            </div>
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                        <Package size={25} strokeWidth={2} className='text-[#EBB212]' />
                                        <p className="">Fertilization</p>
                                    </div>
                                    <p className=" capitalize text-[16px] font-medium">22 Tasks</p>
                                </div>
                                <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full my-[20px] rounded-lg" />
                            </div>
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                        <Truck size={25} strokeWidth={2} className='text-[#25C462]' />
                                        <p className="">Planting/Harvesting</p>
                                    </div>
                                    <p className=" capitalize text-[16px] font-medium">18 Tasks</p>
                                </div>
                                <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full my-[20px] rounded-lg" />
                            </div>
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                        <Axe size={25} strokeWidth={2} className='text-[#616161]' />
                                        <p className="">Maintenance</p>
                                    </div>
                                    <p className=" capitalize text-[16px] font-medium">15 Tasks</p>
                                </div>
                                <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full my-[20px] rounded-lg" />
                            </div>
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                        <ClipboardCheck size={25} strokeWidth={2} className='text-[#8C60CF]' />
                                        <p className="">Inspection</p>
                                    </div>
                                    <p className=" capitalize text-[16px] font-medium">12 Tasks</p>
                                </div>
                                <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full my-[20px] rounded-lg" />
                            </div>
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                        <TriangleAlert size={25} strokeWidth={2} className='text-[#E13939]' />
                                        <p className="">Pest Control</p>
                                    </div>
                                    <p className=" capitalize text-[16px] font-medium">5 Tasks</p>
                                </div>
                                <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full my-[20px] rounded-lg" />
                            </div>
                        </div>
                    </div>
                    <div className="border-[1px] row-span-2 border-[rgba(13,18,28,0.25)] rounded-[15px] p-[15px] ">
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[15px]">Inventory Alerts </h2>
                        <p className="text-[#616161] text-[17px] font-medium">Critical inventory issues</p>
                        <div className="mt-[35px]  space-y-[20px]  ">
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] items-center text-[16px] font-medium">
                                    <UserCheck size={25} strokeWidth={2} className='text-[#25C462]' />
                                    <p className="">Shehab Ahmed</p>
                                </div>
                                    <div className="px-[12px] py-[2px] rounded-[15px] bg-[#25c4621e] border-[1px] border-[#25C462]">
                                        <p className=" capitalize text-[15px] text-mainColor font-bold">22 Tasks</p>
                                    </div>
                                    
                                
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] items-center text-[16px] font-medium">
                                    <UserCheck size={25} strokeWidth={2} className='text-[#25C462]' />
                                    <p className="">Hussein Mohamed</p>
                                </div>
                                    <div className="px-[12px] py-[2px] rounded-[15px] bg-[#25c4621e] border-[1px] border-[#25C462]">
                                        <p className=" capitalize text-[15px] text-mainColor font-bold">20 Tasks</p>
                                    </div>
                                    
                                
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] items-center text-[16px] font-medium">
                                    <UserCheck size={25} strokeWidth={2} className='text-[#25C462]' />
                                    <p className="">Mohamed Omar</p>
                                </div>
                                    <div className="px-[12px] py-[2px] rounded-[15px] bg-[#25c4621e] border-[1px] border-[#25C462]">
                                        <p className=" capitalize text-[15px] text-mainColor font-bold">18 Tasks</p>
                                    </div>
                                    
                                
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] items-center text-[16px] font-medium">
                                    <UserX size={25} strokeWidth={2} className='text-[#E13939]' />
                                    <p className="">Sarah</p>
                                </div>
                                    <div className="px-[12px] py-[2px] rounded-[15px] bg-[#e139390f] border-[1px] border-[#E13939]">
                                        <p className=" capitalize text-[15px] text-[#E13939] font-bold">8 Tasks</p>
                                    </div>
                                    
                                
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] items-center text-[16px] font-medium">
                                    <UserX size={25} strokeWidth={2} className='text-[#E13939]' />
                                    <p className="">Robert</p>
                                </div>
                                    <div className="px-[12px] py-[2px] rounded-[15px] bg-[#e139390f] border-[1px] border-[#E13939]">
                                        <p className=" capitalize text-[15px] text-[#E13939] font-bold">5 Tasks</p>
                                    </div>
                                    
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-3 border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px] p-[15px]  gap-y-[40px]">
                    <div className="">
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[20px]">Task Categories</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Distribution by task type</p>
                        <div className="mt-[35px]  space-y-[22px]  ">
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                        <Droplet size={25} strokeWidth={2} className='text-[#089FFC]' />
                                        <p className="">Irrigation</p>
                                        
                                    </div>
                                    <div className="flex items-center space-x-[5px]">
                                        <Timer size={20}/>
                                        <p className=" capitalize text-[16px] font-medium">1.2 days</p>
                                    </div>
                                </div>
                                <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full my-[10px] rounded-lg" />
                                <div className="flex justify-between my-[5px] text-[16px] font-medium">
                                    <p className="">Target: 1.5 days</p>
                                    <p className="text-[#25C462]">20% faster than target</p>
                                </div>
                            </div>
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                        <Package size={25} strokeWidth={2} className='text-[#EBB212]' />
                                        <p className="">Fertilization</p>
                                    </div>
                                    <div className="flex items-center space-x-[5px]">
                                        <Timer size={20}/>
                                        <p className=" capitalize text-[16px] font-medium">2 days</p>
                                    </div>
                                </div>
                                <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full my-[10px] rounded-lg" />
                                <div className="flex justify-between my-[5px] text-[16px] font-medium">
                                    <p className="">Target: 2 days</p>
                                    <p className="text-[#25C462]">20% faster than target</p>
                                </div>
                            </div>
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                        <Truck size={25} strokeWidth={2} className='text-[#25C462]' />
                                        <p className="">Planting/Harvesting</p>
                                    </div>
                                    <div className="flex items-center space-x-[5px]">
                                        <Timer size={20}/>
                                        <p className=" capitalize text-[16px] font-medium">5.2 days</p>
                                    </div>
                                </div>
                                <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full my-[10px] rounded-lg" />
                                <div className="flex justify-between my-[5px] text-[16px] font-medium">
                                    <p className="">Target: 2.5 days</p>
                                    <p className="text-[#25C462]">20% faster than target</p>
                                </div>
                            </div>
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                        <Axe size={25} strokeWidth={2} className='text-[#616161]' />
                                        <p className="">Maintenance</p>
                                    </div>
                                    <div className="flex items-center space-x-[5px]">
                                        <Timer size={20}/>
                                        <p className=" capitalize text-[16px] font-medium">1.8 days</p>
                                    </div>
                                </div>
                                <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full my-[10px] rounded-lg" />
                                <div className="flex justify-between my-[5px] text-[16px] font-medium">
                                    <p className="">Target: 1.8 days</p>
                                    <p className="text-[#25C462]">20% faster than target</p>
                                </div>
                            </div>
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                        <ClipboardCheck size={25} strokeWidth={2} className='text-[#8C60CF]' />
                                        <p className="">Inspection</p>
                                    </div>
                                    <div className="flex items-center space-x-[5px]">
                                        <Timer size={20}/>
                                        <p className=" capitalize text-[16px] font-medium">1.5 days</p>
                                    </div>
                                </div>
                                <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full my-[10px] rounded-lg" />
                                <div className="flex justify-between my-[5px] text-[16px] font-medium">
                                    <p className="">Target: 1.5 days</p>
                                    <p className="text-[#25C462]">20% faster than target</p>
                                </div>
                            </div>
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                        <TriangleAlert size={25} strokeWidth={2} className='text-[#E13939]' />
                                        <p className="">Pest Control</p>
                                    </div>
                                    <div className="flex items-center space-x-[5px]">
                                        <Timer size={20}/>
                                        <p className=" capitalize text-[16px] font-medium">3 days</p>
                                    </div>
                                </div>
                                <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full my-[10px] rounded-lg" />
                                <div className="flex justify-between my-[5px] text-[16px] font-medium">
                                    <p className="">Target: 3 days</p>
                                    <p className="text-[#25C462]">20% faster than target</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="col-span-3 border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px]  p-[20px] ">
                    <div className="p-[10px]">
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[12px]">Task Distributed</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Tasks by field and priority</p>
                    </div>
                    <div className="grid grid-rows-4  w-[90%] mx-auto gap-[20px] my-[30px] ">
                        <div className="grid grid-cols-5 text-[#0D121C] text-[16px] font-medium">
                            <p className="">Field</p>
                            <p className="flex justify-center">High Priority</p>
                            <p className="flex justify-center">Medium Priority</p>
                            <p className="flex justify-center">Low Priority</p>
                            <p className="flex justify-center">Total</p>
                        </div>
                        <div className="grid grid-cols-5 text-[#616161] text-[16px] font-medium">
                            <p className="">Corn Field</p>
                            <p className="flex justify-center">8</p>
                            <p className="flex justify-center">12</p>
                            <p className="flex justify-center">8</p>
                            <p className="flex justify-center">25</p>
                        </div>
                        <div className="grid grid-cols-5 text-[#616161] text-[16px] font-medium">
                            <p className="">Apple Field</p>
                            <p className="flex justify-center">5</p>
                            <p className="flex justify-center">10</p>
                            <p className="flex justify-center">3</p>
                            <p className="flex justify-center">18</p>
                        </div>
                        <div className="grid grid-cols-5 text-[#616161] text-[16px] font-medium">
                            <p className="">Grape Field</p>
                            <p className="flex justify-center">6</p>
                            <p className="flex justify-center">8</p>
                            <p className="flex justify-center">1</p>
                            <p className="flex justify-center">15</p>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </section>
    );
}

export default TasksPart;
