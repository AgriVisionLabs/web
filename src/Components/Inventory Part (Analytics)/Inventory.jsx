import {TriangleAlert, Clock, TrendingUp, Truck} from 'lucide-react';
import {
    ComposedChart, Bar, XAxis, YAxis, CartesianGrid,Area,AreaChart,
    Tooltip, Legend, ResponsiveContainer ,PieChart, Pie, Cell,LineChart,Line,BarChart
} from 'recharts';

const Inventory = () => {
    let data1 =  [
    { category: 'Fertilizers', currentStock: 720, minRequired: 150, optimalLevel: 1000 },
    { category: 'Chemicals', currentStock: 150, minRequired: 100, optimalLevel: 400 },
    { category: 'Treatments', currentStock: 250, minRequired: 100, optimalLevel: 300 },
    { category: 'Seeds', currentStock: 180, minRequired: 100, optimalLevel: 200 },
    { category: 'Equipment', currentStock: 130, minRequired: 100, optimalLevel: 150 },
    ];
;
    const data2 = [
    { name: "High", value: 420, color: "#4285F4" },    // Blue
    { name: "Medium", value: 350, color: "#FBBC05" },   // Orange
    { name: "Low", value: 230, color: "#34A853" },   // Green
    ];
    const data3 = [
    { year: '2025', predicted: 4300, actual: 4200, variance: 4171 },
    { year: '2026', predicted: 4500, actual: 4400, variance: 4455},
    { year: '2027', predicted: 4600, actual: 4580, variance: 4646 },
    { year: '2028', predicted: 4800, actual: 4770, variance: 4752 },
    { year: '2029', predicted: 5080, actual: 4880, variance: 2029},
    ];
    let data4 = [
    { category: 'Fertilizers', CurrentValue: 48000, AnnualSpend: 68000,  },
    { category: 'Chemicals', CurrentValue: 28000, AnnualSpend: 40000, },
    { category: 'Treatments', CurrentValue: 26500, AnnualSpend: 39000, },
    { category: 'Seeds', CurrentValue: 18500, AnnualSpend: 39000, },
    { category: 'Equipment', CurrentValue: 40000, AnnualSpend: 70000, },
    ];
    const data5 = [
    { month: 'Jan', Fertilizers: 120, Chemicals: 50, Treatments: 40 },
    { month: 'Feb', Fertilizers: 140, Chemicals: 48, Treatments: 45 },
    { month: 'Mar', Fertilizers: 160, Chemicals: 60, Treatments: 60 },
    { month: 'Apr', Fertilizers: 200, Chemicals: 75, Treatments: 70 },
    { month: 'May', Fertilizers: 230, Chemicals: 50, Treatments: 90 },
    { month: 'Jun', Fertilizers: 190, Chemicals: 48, Treatments: 80 },

    ];

    return (
        <section className=''>
            <div className="grid xl:grid-cols-3 gap-[30px] mb-[20px]">
                <div className="col-span-3 md:col-span-2  border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px] ">
                    <div className="p-[20px]">
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[12px]">Inventory Overview</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Stock levels and usage trends</p>
                    </div>
                    <div className="mb-[10px]"><p className=" text-center text-[#616161] text-[17px] font-semibold">Inventory Levels by Category</p></div>
                    <div className='h-[50%] md:h-[70%]'>
                    <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={data1} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                            <XAxis dataKey="category" />
                            <YAxis domain={[0,1000]} tickCount={7} label={{value:"Quantity", angle: -90, position: "insideLeft" , style: { textAnchor: 'middle', fontSize: 18, fill: '#333' }}}/>
                            <Tooltip />
                            <Legend  verticalAlign="top" iconSize={20} height={40} iconType="plainline" wrapperStyle={{ fontSize:"16px", fontWeight:"500",marginTop:"-20px"}}/>
                            <Bar dataKey="currentStock" name="Current Stock" barSize={40} fill="#3399FF" />
                            <Line type="monotone" dataKey="minRequired" name="Minimum Required" stroke="#FFA500" strokeWidth={2} />
                            <Line type="monotone" dataKey="optimalLevel" name="Optimal Level" stroke="#00CC66" strokeWidth={2} dot />
                            </ComposedChart>
                        </ResponsiveContainer>

                    </div>
                    <div className=" grid grid-cols-2 xl:grid-cols-4 gap-y-[10px] py-[20px] w-[80%] mx-auto text-[17px]">
                        <div className="space-y-[10px] flex flex-col items-center">
                            <p className="text-[#616161]  font-semibold">Total Items</p>
                            <p className=" font-medium">1152</p>
                        </div>
                        <div className="space-y-[10px] flex flex-col items-center">
                            <p className="text-[#616161]  font-semibold">Categories</p>
                            <p className=" font-medium">5</p>
                        </div>
                        <div className="space-y-[10px] flex flex-col items-center">
                            <p className="text-[#616161]  font-semibold">Low Stock</p>
                            <p className=" text-[#E13939] font-medium">8 Items</p>
                            
                        </div>
                        <div className="space-y-[10px] flex flex-col items-center">
                            <p className="text-[#616161]  font-semibold">Expiring Soon</p>
                            <p className="text-[#F49E0B] font-medium">12 items</p>
                        </div>
                    </div>
                </div>
                <div className="col-span-3 md:col-span-1 grid grid-rows-5 gap-y-[30px] ">
                    <div className="border-[1px] row-span-3 border-[rgba(13,18,28,0.25)] rounded-[15px] p-[15px] ">
                        <h2 className="text-[#0D121C] text-[20px] font-medium mb-[15px]">Stock Level Distribution</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Current inventory Status </p>
                        <div className="flex justify-center items-center mt-[25px]   ">
                            <PieChart width={300} height={250}>
                                <Legend  verticalAlign="top" iconSize={20} height={40} layout='horizontal' iconType="plainline" align="center"   wrapperStyle={{ fontSize:"16px", fontWeight:"500",marginTop:"-20px" ,position:"absolute",top:"50px"}}/>
                                <Pie data={data2} cx="50%" cy="50%" innerRadius={30} outerRadius={70} paddingAngle={0} dataKey="value">
                                    {data2.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                    
                                </Pie>
                            </PieChart>
                        </div>
                        <div className="mt-[3px] space-y-[10px] flex justify-between items-center">
                            <div className="flex justify-between items-center text-[#0D121C] text-[17px] font-medium">
                                <div className="flex items-baseline space-x-2">
                                    <div className="h-[11px] w-[11px] bg-[#3B82F6] rounded-full"></div>
                                    <p className="">High</p>
                                </div>
                            </div>
                            <div className="px-[12px] py-[2px] rounded-[15px] bg-[#9f9f9f2b]">
                                <p className="text-[#0D121C] text-[16px] font-medium">42%</p>
                            </div>
                        </div>
                        <div className="mt-[3px] space-y-[10px] flex justify-between items-center">
                            <div className="flex justify-between items-center text-[#0D121C] text-[17px] font-medium">
                                <div className="flex items-baseline space-x-2">
                                    <div className="h-[11px] w-[11px] bg-[#F49E0B] rounded-full"></div>
                                    <p className="">Medium</p>
                                </div>
                            </div>
                            <div className="px-[12px] py-[2px] rounded-[15px]  border-[1px] border-[#9F9F9F]">
                                <p className="text-[#0D121C] text-[16px] font-medium">35%</p>
                            </div>
                        </div>
                        <div className="mt-[3px] space-y-[10px] flex justify-between items-center">
                            <div className="flex justify-between items-center text-[#0D121C] text-[17px] font-medium">
                                <div className="flex items-baseline space-x-2">
                                    <div className="h-[11px] w-[11px] bg-[#10B982] rounded-full"></div>
                                    <p className="">Low</p>
                                </div>
                            </div>
                            <div className="px-[12px] py-[2px] rounded-[15px] bg-[#E13939]">
                                <p className="text-[#FFFFFF] text-[16px] font-medium">23%</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-[1px] row-span-2 border-[rgba(13,18,28,0.25)] rounded-[15px] p-[15px] ">
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[20px]">Inventory Alerts </h2>
                        <p className="text-[#616161] text-[17px] font-medium">Critical inventory issues</p>
                        <div className="mt-[35px]  space-y-[20px]  ">
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                    <TriangleAlert size={25} strokeWidth={2} className='text-[#E13939]' />
                                    <p className="">Low Stock item</p>
                                </div>
                                    <div className="px-[12px] py-[2px] rounded-[15px] bg-[#e139391e] border-[1px] border-[#E13939]">
                                        <p className=" capitalize text-[15px] text-[#E13939] font-bold">8 items</p>
                                    </div>
                                    
                                
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                    <Clock size={25} strokeWidth={2} className='text-[#CD9B10]' />
                                    <p className="">Expiring in 30 days</p>
                                </div>
                                    <div className="px-[12px] py-[2px] rounded-[15px] bg-[rgba(235,178,18,0.20)] border-[1px] border-[#EBB212]">
                                        <p className=" capitalize text-[15px] text-[#CD9B10] font-bold">12 items</p>
                                    </div>
                                    
                                
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                    <TrendingUp size={25} strokeWidth={2} className='text-[#089FFC]' />
                                    <p className="">High usage items</p>
                                </div>
                                    <div className="px-[12px] py-[2px] rounded-[15px] bg-[#089efc23] border-[1px] border-[#089FFC]">
                                        <p className=" capitalize text-[15px] text-[#089FFC] font-bold">5 items</p>
                                    </div>
                                    
                                
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                    <Truck size={25} strokeWidth={2} className='text-[#8C60CF]' />
                                    <p className="">Pending orders</p>
                                </div>
                                    <div className="px-[12px] py-[2px] rounded-[15px] bg-[#8c60cf23] border-[1px] border-[#8C60CF]">
                                        <p className=" capitalize text-[15px] text-[#8C60CF] font-bold">Medium Impact</p>
                                    </div>
                                    
                                
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className="col-span-3 border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px] p-[15px]  gap-y-[40px]">
                    <div className='mb-[10px]'>
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[20px]">Health Index Trend</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Historical prediction vs. actual results</p>
                    </div>
                    <div className=' flex justify-center'>
                        <p className="text-[#616161] text-[19px] font-medium">Prediction vs. Actual Yield</p>
                    </div>
                    <div className="h-[60%] md:h-[70%] mt-[20px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data3} margin={{ top: 20, right: 30, left: 20, bottom: 0}}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis  dataKey="year" angle={0} padding={{left: 50, right: 50}}/>
                                <YAxis  label={{   value: 'Growth (cm/week)',   angle: -90,  dx:-20,  position: "insideLeft" , style: { textAnchor: 'middle', fontSize: 16, fill: '#333' } }} domain={[0,6000]} tickCount={14}/>
                                <Tooltip />
                                <Legend  iconSize={20} verticalAlign="top" height={20} iconType="plainline" wrapperStyle={{ fontSize:"16px", fontWeight:"500" ,marginTop:"-25px"}}/>
                                <Line type="monotone" dataKey="predicted" stroke="#3B82F6" strokeWidth={2} activeDot={{ r: 8 }} name="Predication Yield"/>
                                <Line type="monotone" dataKey="actual" stroke="#F49E0B" strokeWidth={2} activeDot={{ r: 8 }} name="Actual Yield"/>
                                <Line type="monotone" dataKey="avariance" stroke="#10B982" strokeWidth={2} activeDot={{ r: 8 }} name="Variance"/>
                                </LineChart>
                        </ResponsiveContainer>         
                    </div>
                    <div className='mt-[30px]'>
                        <p className="text-[#616161] text-[17px] font-medium">Average accuracy: 94.2% over last 5 Seasons</p>
                    </div>
                </div>
                <div className="col-span-3 border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px] p-[15px]  gap-y-[40px]">
                    <div className='mb-[30px]'>
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[20px]">Inventory Usage Trends</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Monthly consumption by category</p>
                    </div>
                    <div className="mb-[10px]"><p className=" text-center text-[#616161] text-[17px] font-semibold">Monthly Inventory Usage</p></div>
                    <div className="h-[70%] md:h-[75%]">
                        <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data5}
                            margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorFert" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorChem" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FFA500" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#FFA500" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorTreat" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#228B22" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#228B22" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" />
                            <YAxis label={{value:"Usage Quantity" ,dx:-10 , angle: -90, position: "insideLeft" , style: { textAnchor: 'middle', fontSize: 16, fill: '#333' }}}/>
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend iconSize={20} verticalAlign="top"  height={40} layout='horizontal' iconType="plainline" align="center"   wrapperStyle={{ fontSize:"16px", fontWeight:"500",marginTop:"-20px" ,position:"absolute",top:"25px"}}/>
                            <Area type="monotone" dataKey="Fertilizers" stroke="#0088FE" fillOpacity={1} fill="url(#colorFert)" />
                            <Area type="monotone" dataKey="Chemicals" stroke="#FFA500" fillOpacity={1} fill="url(#colorChem)" />
                            <Area type="monotone" dataKey="Treatments" stroke="#228B22" fillOpacity={1} fill="url(#colorTreat)" />
                            </AreaChart>
                        </ResponsiveContainer>

                    </div>
                </div>
                <div className="col-span-3  border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px]">
                                    <div className="p-[20px]">
                                        <h2 className="text-[#0D121C] text-[20px] font-medium mb-[12px]">Inventory Usage Trends</h2>
                                        <p className="text-[#616161] text-[17px] font-medium">Monthly consumption by category</p>
                                    </div>
                                    <div className="mb-[10px]"><p className=" text-center text-[#616161] text-[19px] font-semibold">Monthly Inventory Usage</p></div>
                                    <div className='h-[60%]'>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data4} margin={{ top: 20, right: 30, left: 40, bottom: 10 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="category" />
                                        <YAxis label={{value: 'Usage Quantity',dx:-20, angle: -90, position: "insideLeft" , style: { textAnchor: 'middle', fontSize: 16, fill: '#333' }}} domain={[0,100000]} tickCount={6} />
                                        <Tooltip />
                                        <Legend iconSize={20} verticalAlign="top" iconType="plainline" height={36}  wrapperStyle={{ fontSize:"16px", fontWeight:"500"}}/>
                                        <Bar dataKey="CurrentValue" fill="#007bff" name="Current value" />
                                        <Bar dataKey="AnnualSpend" fill="#FFA500" name="Annual spend" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                    </div>
                                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-y-[10px] py-[20px] w-[80%] mx-auto text-[17px]">
                                        <div className="space-y-[10px] flex flex-col items-center">
                                            <p className="text-[#616161]  font-semibold">Total inventory value</p>
                                            <p className=" font-medium">$ 138000</p>
                                        </div>
                                        <div className="space-y-[10px] flex flex-col items-center">
                                            <p className="text-[#616161]  font-semibold">Annual spend</p>
                                            <p className=" font-medium">$ 178000</p>
                                        </div>
                                        <div className="space-y-[10px] flex flex-col items-center">
                                            <p className="text-[#616161]  font-semibold">Largest category</p>
                                            <p className="  font-medium">Fertilizers</p>
                                        </div>
                                        <div className="space-y-[10px] flex flex-col items-center">
                                            <p className="text-[#616161]  font-semibold">YoY change</p>
                                            <p className="text-[#25C462] font-medium">-8.5 %</p>
                                        </div>
                                    </div>
                </div>
            </div>
        </section>
    );
}


export default Inventory;
