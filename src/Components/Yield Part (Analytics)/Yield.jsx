import {MoveUpRight,Droplet, Leaf,Package, Thermometer,TriangleAlert, DollarSign, Scale, Percent} from 'lucide-react';
import {Line as LineDrow} from 'rc-progress';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer ,PieChart, Pie, Cell,LineChart,Line
} from 'recharts';

const Yield = () => {
    let data1 = [
    { field: 'North Field', Current: 4900, Last: 4500, Average: 1700 },
    { field: 'South Field', Current: 4000, Last: 3000, Average: 1700 },
    { field: 'East Field', Current: 4500, Last: 6000, Average: 1700 },
    ];
    const data2 = [
    { name: "Corn", value: 4800, color: "#4285F4" },    // Blue
    { name: "Apple", value: 1700, color: "#FBBC05" },   // Orange
    { name: "Grape", value: 1350, color: "#34A853" },   // Green
    ];
    const data3 = [
    { year: '2025', predicted: 4300, actual: 4200, variance: 4171 },
    { year: '2026', predicted: 4500, actual: 4400, variance: 4455},
    { year: '2027', predicted: 4600, actual: 4580, variance: 4646 },
    { year: '2028', predicted: 4800, actual: 4770, variance: 4752 },
    { year: '2029', predicted: 5080, actual: 4880, variance: 2029},
    ];
    return (
        <section className='mb-[30px]'>
            <div className="grid grid-cols-3 gap-[30px]">
                <div className="col-span-3  xl:col-span-2  border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px]">
                    <div className="p-[20px]">
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[12px]">Yield Projections </h2>
                        <p className="text-[#616161] text-[17px] font-medium">Estimated harvest quantities by field</p>
                    </div>
                    <div className="mb-[10px]"><p className=" text-center text-[#616161] text-[17px] font-semibold">Yield Projections</p></div>
                    <div className='h-[50%] md:h-[70%]'>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data1} margin={{ top: 20, right: 30, left: 40, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis label={{value: 'Water Usage (gal)', angle: -90,dx:-10 , position: "insideLeft" , style: { textAnchor: 'middle', fontSize: 18, fill: '#333' }}} domain={[0,6000]} tickCount={14} />
                        <Tooltip />
                        <Legend iconSize={20} verticalAlign="top" iconType="plainline" height={36}  wrapperStyle={{marginTop:"-20px", fontSize:"18px"}}/>
                        <Bar barSize={40} dataKey="Current" fill="#007bff" name="Current Projection" />
                        <Bar barSize={40} dataKey="Last" fill="#FFA500" name="Last Projection" />
                        <Bar barSize={40} dataKey="Average" fill="#28a745" name="Average" />
                        </BarChart>
                    </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-[8px] py-[15px] w-[80%] mx-auto text-[17px]">
                        <div className="space-y-[10px] flex flex-col items-center">
                            <p className="text-[#616161]  font-semibold">Current Projection</p>
                            <p className=" font-medium">4800 Kg/acres</p>
                        </div>
                        <div className="space-y-[10px] flex flex-col items-center">
                            <p className="text-[#616161]  font-semibold">Last Projection</p>
                            <p className=" font-medium">4800 Kg/acres</p>
                        </div>
                        <div className="space-y-[10px] flex flex-col items-center">
                            <p className="text-[#616161]  font-semibold">change</p>
                            <div className="flex items-center space-x-3 text-[#25C462]">
                                <MoveUpRight/>
                                <p className="  font-medium">+7.6%</p>
                            </div>
                        </div>
                        <div className="space-y-[10px] flex flex-col items-center">
                            <p className="text-[#616161]  font-semibold">Target</p>
                            <p className=" font-medium">5200 Kg/acres</p>
                        </div>
                    </div>
                </div>
                <div className=" col-span-3  xl:col-span-1 grid grid-rows-2 gap-y-[30px] md:gap-y-[15px] ">
                    <div className="border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px] p-[15px]">
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[15px]">Yield by Crop Type</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Projected yields for different crops </p>
                        <div className="flex justify-center items-center mt-[20px]">
                            <PieChart width={120} height={120}>
                                <Pie data={data2} cx="50%" cy="50%" innerRadius={25} outerRadius={60} paddingAngle={0} dataKey="value">
                                    {data2.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </div>
                        <div className="mt-[10px] space-y-[10px]">
                            <div className="flex justify-between items-center text-[#0D121C] text-[18px] font-medium">
                                <div className="flex items-baseline space-x-2">
                                    <div className="h-[11px] w-[11px] bg-[#3B82F6] rounded-full"></div>
                                    <p className="">Corn</p>
                                </div>
                                <p className="">4800 Kg/acres</p>
                            </div>
                            <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full  rounded-lg" />
                        </div>
                        <div className="mt-[10px] space-y-[10px]">
                            <div className="flex justify-between items-center text-[#0D121C] text-[18px] font-medium">
                                <div className="flex items-baseline space-x-2">
                                    <div className="h-[11px] w-[11px] bg-[#F49E0B] rounded-full"></div>
                                    <p className="">Apple</p>
                                </div>
                                <p className="">1700 Kg/acres</p>
                            </div>
                            <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full  rounded-lg" />
                        </div>
                        <div className="mt-[10px] space-y-[10px]">
                            <div className="flex justify-between items-center text-[#0D121C] text-[18px] font-medium">
                                <div className="flex items-baseline space-x-2">
                                    <div className="h-[11px] w-[11px] bg-[#10B982] rounded-full"></div>
                                    <p className="">Grape</p>
                                </div>
                                <p className="">1350 Kg/acres</p>
                            </div>
                            <LineDrow percent={80} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full  rounded-lg" />
                        </div>
                    </div>
                    <div className="border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px] p-[15px]">
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[20px]">Yield Factors</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Key influences on yield performanse</p>
                        <div className="mt-[35px] pb-[15px] space-y-[20px] ">
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                    <Droplet size={25} strokeWidth={2} className='text-[#089FFC]' />
                                    <p className="">Irrigation Efficiency</p>
                                </div>
                                    <div className="px-[12px] py-[2px] rounded-[15px] bg-[rgba(37,196,98,0.10)] border-[1px] border-[#25C462]">
                                        <p className=" capitalize text-[15px] text-mainColor font-bold">High Impact</p>
                                    </div>
                                    
                                
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                    <Thermometer size={25} strokeWidth={2} className='text-[#E13939]' />
                                    <p className="">Temperature</p>
                                </div>
                                    <div className="px-[12px] py-[2px] rounded-[15px] bg-[rgba(37,196,98,0.10)] border-[1px] border-[#25C462]">
                                        <p className=" capitalize text-[15px] text-mainColor font-bold">High Impact</p>
                                    </div>
                                    
                                
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                    <Leaf size={25} strokeWidth={2} className='text-[#25C462]' />
                                    <p className="">Plant Health</p>
                                </div>
                                    <div className="px-[12px] py-[2px] rounded-[15px] bg-[rgba(37,196,98,0.10)] border-[1px] border-[#25C462]">
                                        <p className=" capitalize text-[16px] text-mainColor font-bold">High Impact</p>
                                    </div>
                                    
                                
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                    <Package size={25} strokeWidth={2} className='text-[#CD9B10]' />
                                    <p className="">Plant Health</p>
                                </div>
                                    <div className="px-[12px] py-[2px] rounded-[15px] bg-[rgba(235,178,18,0.20)] border-[1px] border-[#EBB212]">
                                        <p className=" capitalize text-[15px] text-[#CD9B10] font-bold">Medium Impact</p>
                                    </div>
                                    
                                
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-[9px] items-center text-[17px] font-medium">
                                    <TriangleAlert size={25} strokeWidth={2} className='text-[#E13939]' />
                                    <p className="">Pest Pressure</p>
                                </div>
                                    <div className="px-[12px] py-[2px] rounded-[15px] bg-[rgba(235,178,18,0.20)] border-[1px] border-[#EBB212]">
                                        <p className=" capitalize text-[15px] text-[#CD9B10] font-bold">Medium Impact</p>
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
                        <p className="text-[#616161] text-[17px] font-medium">Prediction vs. Actual Yield</p>
                    </div>
                    <div className="h-[60%] md:h-[70%] mt-[20px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data3} margin={{ top: 20, right: 30, left: 20, bottom: 0}}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis  dataKey="year" angle={0} padding={{left: 50, right: 50}}/>
                                <YAxis  label={{   value: 'Growth (cm/week)',dx:-10,   angle: -90,  position: "insideLeft" , style: { textAnchor: 'middle', fontSize: 16, fill: '#333' } }} domain={[0,6000]} tickCount={14}/>
                                <Tooltip />
                                <Legend iconSize={20} verticalAlign="top" height={36} iconType="plainline" wrapperStyle={{ fontSize:"16px", fontWeight:"500",marginTop:"-20px"}} />
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
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[20px]">Financial Projections</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Revenue and profit estimates based on yield</p>
                    </div>
                    <div className="">
                        <div className="flex justify-between items-center text-[17px] text-[#0D121C] font-medium my-[12px]">
                            <div className="flex items-center space-x-3 ">
                                <DollarSign size={20} strokeWidth={2} className='text-[#10B982]'/>
                                <p className="">Projected Revenue</p>
                            </div>
                            <p className="">$ 458750</p>
                        </div>
                        <div className="text-[#616161] text-[17px] font-semibold flex justify-between items-center">
                            <p className="">Corn: $ 285500</p>
                            <p className="">Apple: $ 350200</p>
                            <p className="">Grape: $25100</p>
                        </div>
                    </div>
                    <div className="">
                        <div className="flex justify-between items-center text-[17px] text-[#0D121C] font-medium my-[12px]">
                            <div className="flex items-center space-x-3 ">
                                <Scale size={21} strokeWidth={2} className='text-[#089FFC]'/>
                                <p className="">Estimated Costs</p>
                            </div>
                            <p className="">$ 275250</p>
                        </div>
                        <div className="text-[#616161] text-[17px] font-semibold flex justify-between items-center">
                            <p className="">Seeds: $ 52500</p>
                            <p className="">Fertilizer: $ 78750</p>
                            <p className="">Labor: $ 105000</p>
                            <p className="">Other: $ 39000</p>
                        </div>
                    </div>
                    <div className="">
                        <div className="flex justify-between items-center text-[17px] text-[#0D121C] font-medium my-[12px]">
                            <div className="flex items-center space-x-3 ">
                                <Percent size={20} strokeWidth={2} className='text-[#8C60CF]'/>
                                <p className="">Projected Profit</p>
                            </div>
                            <p className="text-[#10B982]">$ 183500</p>
                        </div>
                        <div className="text-[#616161] text-[17px] font-semibold flex justify-between items-center">
                            <p className="">Profit Margin: 40%</p>
                            <p className="">ROI: 67%</p>
                            <p className="">vs. Last Year: +12.5%</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}



export default Yield;
