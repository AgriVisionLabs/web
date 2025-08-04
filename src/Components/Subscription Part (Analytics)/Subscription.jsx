

import { Calendar, Clock4, CreditCard, Layers, Leaf, Tractor, TriangleAlert, Users, Wifi } from 'lucide-react';
import {Line as LineDrow} from 'rc-progress';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';


const Subscription = () => {
    const data = [
    { name: 'Disease Detection', value: 60 },
    { name: 'Irrigation Control', value: 75 },
    { name: 'Sensor Monitoring', value: 50 },
    { name: 'Task Management', value: 40 },
    { name: 'Analytics', value: 30 },
    ]
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#607D8B'];
    return (
        <section className=''>
            <div className="grid xl:grid-cols-3 gap-[30px] mb-[20px]">
                <div className="col-span-3 border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px] p-[15px]  gap-y-[40px]">
                    <div className="">
                        <h2 className="text-[#0D121C] text-[17px] font-medium mb-[15px]">Subscription Usage</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Current Usage vs. Plan limits</p>
                        <div className="mt-[35px]  space-y-[25px]  ">
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                        <Tractor size={25} strokeWidth={2} className='text-[#089FFC]' />
                                        <p className="">Farms</p>
                                        
                                    </div>
                                    <p className=" capitalize text-[17px] font-medium">4 of 5 used</p>
                                </div>
                                <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full my-[10px] rounded-lg" />
                                
                            </div>
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                        <Layers size={27} strokeWidth={2} className='text-[#25C462]' />
                                        <p className="">Fields</p>
                                    </div>
                                    <p className=" capitalize text-[17px] font-medium">14 of 20 used</p>
                                </div>
                                <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full my-[10px] rounded-lg" />
                            </div>
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                        <Wifi size={27} strokeWidth={2} className='text-[#8C60CF]' />
                                        <p className="">Sensors</p>
                                    </div>
                                    <p className=" capitalize text-[17px] font-medium">18 of 25 used</p>
                                </div>
                                <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full my-[10px] rounded-lg" />
                            </div>
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                        <Leaf size={27} strokeWidth={2} className='text-[#E13939]' />
                                        <p className="">Disease Detection API Calls</p>
                                    </div>
                                    <p className=" capitalize text-[17px] font-medium">850 of 1000 used</p>
                                </div>
                                <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full my-[10px] rounded-lg" />
                            </div>
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                        <Wifi size={27} strokeWidth={2} className='text-[#EBB212]' />
                                        <p className="">AI Recommendations</p>
                                    </div>
                                    <p className=" capitalize text-[17px] font-medium">125 of 200 used</p>
                                </div>
                                <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full my-[10px] rounded-lg" />
                            </div>
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                        <TriangleAlert size={27} strokeWidth={2} className='text-[#616161]' />
                                        <p className="">Storage</p>
                                    </div>
                                    <p className=" capitalize text-[17px] font-medium">4.2 GB of 5 GB used</p>
                                </div>
                                <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full my-[10px] rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-3    gap-[40px] grid grid-cols-3">
                    <div className="col-span-3 md:col-span-2 p-[15px]  border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px]">
                        <h2 className="text-[#0D121C] text-[17px] font-medium mb-[20px]">Subscription Usage</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Current Usage vs. Plan limits</p>
                        <div className="mt-[35px]  space-y-[25px] mb-[20px]  ">
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                        <CreditCard size={25} strokeWidth={2} className='text-[#089FFC]' />
                                        <p className="">Farms</p>
                                        
                                    </div>
                                    <p className=" capitalize text-[17px] font-medium">4 of 5 used</p>
                                </div>
                                <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full my-[10px] rounded-lg" />
                                
                            </div>
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                        <Calendar size={25} strokeWidth={2} className='text-[#089FFC]' />
                                        <p className="">Fields</p>
                                    </div>
                                    <p className=" capitalize text-[16px] font-medium">14 of 20 used</p>
                                </div>
                                <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full my-[10px] rounded-lg" />
                            </div>
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                        <Clock4 size={25} strokeWidth={2} className='text-[#089FFC]' />
                                        <p className="">Sensors</p>
                                    </div>
                                    <p className=" capitalize text-[18px] font-medium">18 of 25 used</p>
                                </div>
                                <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full my-[10px] rounded-lg" />
                            </div>
                            <div className="">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                        <Users size={25} strokeWidth={2} className='text-[#089FFC]' />
                                        <p className="">Disease Detection API Calls</p>
                                    </div>
                                    <p className=" capitalize text-[18px] font-medium">850 of 1000 used</p>
                                </div>
                                <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full my-[10px] rounded-lg" />
                            </div>
                        </div>
                        <div className="border-t-[1px] border-[#9F9F9F] py-[20px]">
                            <button className='flex justify-center items-center border-[1px] w-[100%] py-[16px] border-[#9F9F9F] rounded-[10px] transition-all duration-150 hover:bg-[#dddbdba4]'><p className="text-[18px] text-[#0D121C] font-medium">Upgrade Plan</p></button>
                        </div>
                    </div>
                    <div className="col-span-3 md:col-span-1 border-[1px]  border-[rgba(13,18,28,0.25)] rounded-[15px] p-[15px] ">
                        <h2 className="text-[#0D121C] text-[17px] font-medium mb-[20px]">Billing History </h2>
                        <p className="text-[#616161] text-[17px] font-medium">Recent payments and invoices</p>
                        <div className="mt-[50px] mb-[40px] space-y-[40px]  ">
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                    <Calendar size={25} strokeWidth={2} className='text-[#25C462]' />
                                    <p className="">Jun 15, 2025</p>
                                </div>
                                    <div className="px-[12px] py-[2px] rounded-[15px] bg-[#25c4621e] border-[1px] border-[#25C462]">
                                        <p className=" capitalize text-[14px] text-mainColor font-bold">$199.00</p>
                                    </div>
                                    
                                
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                    <Calendar size={25} strokeWidth={2} className='text-[#25C462]' />
                                    <p className="">Jun 15, 2025</p>
                                </div>
                                    <div className="px-[12px] py-[2px] rounded-[15px] bg-[#25c4621e] border-[1px] border-[#25C462]">
                                        <p className=" capitalize text-[14px] text-mainColor font-bold">$199.00</p>
                                    </div>
                                    
                                
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                    <Calendar size={25} strokeWidth={2} className='text-[#25C462]' />
                                    <p className="">Aug 15, 2025</p>
                                </div>
                                    <div className="px-[12px] py-[2px] rounded-[15px] bg-[#25c4621e] border-[1px] border-[#25C462]">
                                        <p className=" capitalize text-[14px] text-mainColor font-bold">$199.00</p>
                                    </div>
                                    
                                
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                    <Calendar size={25} strokeWidth={2} className='text-[#25C462]' />
                                    <p className="">Sep 15, 2025</p>
                                </div>
                                    <div className="px-[12px] py-[2px] rounded-[15px] bg-[#25c4621e] border-[1px] border-[#25C462]">
                                        <p className=" capitalize text-[14px] text-mainColor font-bold">$199.00</p>
                                    </div>
                                    
                                
                            </div>
                        </div>
                        <div className=" border-t-[1px] border-[#9F9F9F] py-[10px] flex justify-center">
                            <p className="mt-[25px] text-[18px] text-[#0D121C] font-medium">View All Invoices</p>
                        </div>
                    </div>
                </div>
                <div className="col-span-3 border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px] p-[15px]">
                        <h2 className="text-[#0D121C] text-[17px] font-medium mb-[20px]">Feature Usage</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Most used features and tools</p>
                        <div className="">
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart
                                data={data}
                                layout="vertical"
                                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                                >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, 80]} />
                                <YAxis dataKey="name" type="category" 
                                        width={150}
                                        tick={{
                                            fontSize: 14,
                                            fontWeight: 400,
                                            fill: '#555',
                                            fontFamily: 'Arial, sans-serif'}}
                                            label={{value:"Usage Count", angle: -90,dx:0, position: "insideLeft" , style: { textAnchor: 'middle', fontSize: 17, fill: '#333' }}}
                                            />
                                <Tooltip />
                                <Bar barSize={40} dataKey="value" name="Usage" label={{ position: 'right' }}>
                                    {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="">
                            <div className="mt-[15px] space-y-[10px]">
                                <div className="flex justify-between items-center text-[#0D121C] text-[16px] font-medium">
                                    <p className="">Disease Detection</p>
                                    <p className="">120 uses</p>
                                </div>
                                <LineDrow percent={92} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full  rounded-lg" />
                            </div>
                            <div className="mt-[15px] space-y-[10px]">
                                <div className="flex justify-between items-center text-[#0D121C] text-[16px] font-medium">
                                    <p className="">Irrigation Control</p>
                                    <p className="">85 uses</p>
                                </div>
                                <LineDrow percent={87} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full  rounded-lg" />
                            </div>
                            <div className="mt-[15px] space-y-[10px]">
                                <div className="flex justify-between items-center text-[#0D121C] text-[16px] font-medium">
                                    <p className="">Sensor Monitoring</p>
                                    <p className="">180 uses</p>
                                </div>
                                <LineDrow percent={78} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full  rounded-lg" />
                            </div>
                            <div className="mt-[15px] space-y-[10px]">
                                <div className="flex justify-between items-center text-[#0D121C] text-[16px] font-medium">
                                    <p className="">Task Management</p>
                                    <p className="">200 uses</p>
                                </div>
                                <LineDrow percent={87} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full  rounded-lg" />
                            </div>
                            <div className="mt-[15px] space-y-[10px]">
                                <div className="flex justify-between items-center text-[#0D121C] text-[16px] font-medium">
                                    <p className="">Analytics</p>
                                    <p className="">50 uses</p>
                                </div>
                                <LineDrow percent={78} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full  rounded-lg" />
                            </div>
                        </div>
                </div>
                <div className="col-span-3">
                    <div className="col-span-3 border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px] p-4 sm:p-5 lg:p-[20px]">
                        <div className="p-4 sm:p-5 lg:p-[20px]">
                            <h2 className="text-[#0D121C] text-base sm:text-lg lg:text-[17px] font-medium mb-3 lg:mb-[12px]">Plan Comparison</h2>
                            <p className="text-[#616161] text-sm sm:text-base lg:text-[17px] font-medium">Your plan vs. other available options</p>
                        </div>
                        
                        {/* Mobile Card Layout */}
                        <div className="block md:hidden space-y-4 px-4">
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <h3 className="font-semibold text-gray-800 mb-3">Plan Features</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Farms</span>
                                        <div className="text-right space-y-1">
                                            <p className="text-xs text-gray-600">Basic: 1 Farm</p>
                                            <p className="text-xs text-gray-600">Advanced: Up to 3 Farms</p>
                                            <p className="text-xs text-mainColor font-semibold">Enterprise: Unlimited</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Fields</span>
                                        <div className="text-right space-y-1">
                                            <p className="text-xs text-gray-600">Basic: Up to 3 Fields</p>
                                            <p className="text-xs text-gray-600">Advanced: 5 Fields per Farm</p>
                                            <p className="text-xs text-mainColor font-semibold">Enterprise: Unlimited</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Disease Detection</span>
                                        <div className="text-right space-y-1">
                                            <p className="text-xs text-gray-600">Basic: Limited Usage</p>
                                            <p className="text-xs text-gray-600">Advanced: Unlimited</p>
                                            <p className="text-xs text-mainColor font-semibold">Enterprise: Unlimited</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Analytics</span>
                                        <div className="text-right space-y-1">
                                            <p className="text-xs text-gray-600">Basic: Basic</p>
                                            <p className="text-xs text-gray-600">Advanced: Advanced & Predictive</p>
                                            <p className="text-xs text-mainColor font-semibold">Enterprise: Advanced & Predictive</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Table Layout */}
                        <div className="hidden md:block">
                            <div className="grid grid-rows-4 w-[100%] mx-auto gap-[20px] my-[30px]">
                                <div className="grid grid-cols-4 text-[#0D121C] text-sm lg:text-[17px] font-medium">
                                    <p className="">Feature</p>
                                    <p className="flex justify-center">Basic</p>
                                    <p className="flex justify-center">Advanced</p>
                                    <p className="flex justify-center">Enterprise</p>
                                </div>
                                <div className="grid grid-cols-4 text-[#616161] text-sm lg:text-[16px] font-medium">
                                    <p className="">Farms</p>
                                    <p className="flex justify-center">1 Farm</p>
                                    <p className="flex justify-center">Up to 3 Farms</p>
                                    <p className="flex justify-center">Unlimited</p>
                                </div>
                                <div className="grid grid-cols-4 text-[#616161] text-sm lg:text-[16px] font-medium">
                                    <p className="">Fields</p>
                                    <p className="flex justify-center">Up to 3 Fields</p>
                                    <p className="flex justify-center">5 Fields per Farm</p>
                                    <p className="flex justify-center">Unlimited</p>
                                </div>
                                <div className="grid grid-cols-4 text-[#616161] text-sm lg:text-[16px] font-medium">
                                    <p className="">Disease Detection</p>
                                    <p className="flex justify-center">Limited Usage</p>
                                    <p className="flex justify-center">Unlimited</p>
                                    <p className="flex justify-center">Unlimited</p>
                                </div>
                                <div className="grid grid-cols-4 text-[#616161] text-sm lg:text-[16px] font-medium">
                                    <p className="">Analytics</p>
                                    <p className="flex justify-center">Basic</p>
                                    <p className="flex justify-center">Advanced & Predictive</p>
                                    <p className="flex justify-center">Advanced & Predictive</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Subscription;
