
import {Line as LineDrow} from 'rc-progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PlantHealth = () => {
    const data = [
    { name: 'Jan', healthIndex: 85 },
    { name: 'Feb', healthIndex: 78 },
    { name: 'Mar', healthIndex: 82 },
    { name: 'Apr', healthIndex: 90 },
    { name: 'May', healthIndex: 88 },
    ];
    return (
        <section className='mb-[30px]'>
            <div className="grid grid-cols-3 gap-[30px]">
                <div className="col-span-3 border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px]  p-[20px] ">
                    <div className="p-[20px]">
                        <h2 className="text-[#0D121C] text-[20px] font-medium mb-[12px]">Water Usage History</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Total water used by field over time</p>
                    </div>
                    <div className="grid grid-rows-4  w-[90%] mx-auto gap-[20px] my-[30px] ">
                        <div className="grid grid-cols-6 text-[#0D121C] md:text-[19px] font-medium">
                            <p className="">Date</p>
                            <p className="">Field</p>
                            <p className="">Disease</p>
                            <p className="flex justify-center">Confidence</p>
                            <p className="flex justify-center">Actions</p>
                            <p className="flex justify-center">Status</p>
                        </div>
                        <div className="grid grid-cols-6 text-[#616161] text-[18px] font-medium">
                            <p className="">Jun 17, 2025</p>
                            <p className="">Corn Field</p>
                            <p className="">Leaf Rust</p>
                            <p className="flex justify-center">92%</p>
                            <p className="flex justify-center">View</p>
                            <div className="flex justify-center">
                                <div className=" px-[12px] py-[2px] w-fit rounded-[15px] bg-[rgba(37,196,98,0.10)] border-[1px] border-[#25C462]">
                                    <p className=" capitalize text-[15px] text-mainColor font-bold ">Treated</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-6 text-[#616161] text-[18px] font-medium">
                            <p className="">Jun 17, 2025</p>
                            <p className="">Apple Field</p>
                            <p className="">Powdery Mildew</p>
                            <p className="flex justify-center">87%</p>
                            <p className="flex justify-center">View</p>
                            <div className="flex justify-center">
                                <div className=" px-[12px] py-[2px] w-fit rounded-[15px] bg-[rgba(205,155,16,0.20)] border-[1px] border-[#CD9B10]">
                                    <p className=" capitalize text-[15px] text-[#CD9B10] font-bold ">In progress</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-6 text-[#616161] text-[18px] font-medium">
                            <p className="">Jun 17, 2025</p>
                            <p className="">Grape Field</p>
                            <p className="">Bacterial Spot</p>
                            <p className="flex justify-center">78%</p>
                            <p className="flex justify-center">View</p>
                            <div className="flex justify-center">
                                <div className=" px-[12px] py-[2px] w-fit rounded-[15px] bg-[rgba(225,57,57,0.10)] border-[1px] border-[#E13939]">
                                    <p className=" capitalize text-[15px] text-[#E13939] font-bold ">not treated</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-3 md:col-span-1 border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px] p-[15px]">
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[20px]">AI Confidence Levels</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Disease detection accuracy</p>
                        <div className="">
                            <div className="mt-[30px] space-y-[20px]">
                            <div className="flex justify-between items-center text-[#0D121C] text-[17px] font-medium">
                                <p className="">Leaf Rust</p>
                                <p className="">92%</p>
                            </div>
                            <LineDrow percent={92} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full  rounded-lg" />
                            </div>
                            <div className="mt-[30px] space-y-[20px]">
                                <div className="flex justify-between items-center text-[#0D121C] text-[17px] font-medium">
                                    <p className="">Powdery Mildew</p>
                                    <p className="">87%</p>
                                </div>
                                <LineDrow percent={87} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full  rounded-lg" />
                            </div>
                            <div className="mt-[30px] space-y-[20px]">
                                <div className="flex justify-between items-center text-[#0D121C] text-[17px] font-medium">
                                    <p className="">Bacterial Spot</p>
                                    <p className="">78</p>
                                </div>
                                <LineDrow percent={78} strokeLinecap="round" strokeColor="#1E6930" className="h-[6.5px] text-mainColor w-full  rounded-lg" />
                            </div>
                        </div>
                </div>
                <div className="col-span-3 md:col-span-2 border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px] p-[15px]  gap-y-[40px]">
                    <div className='mb-[20px]'>
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[20px]">Health Index Trend</h2>
                        <p className="text-[#616161] text-[17px] font-medium">30-day plant health tracking</p>
                    </div>
                    <div className="h-[70%]">
                    <ResponsiveContainer width="90%" height="100%">
                        <LineChart data={data} margin={{top: 5, right: 30, left: 20, bottom: 5,}}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name"  padding={{left: 50, right: 50}}/>
                        <YAxis domain={[50, 90]} label={{ value: "Health Index", angle: -90 , marginRight:"50px", position: "insideLeft" , style: { textAnchor: 'middle', fontSize: 18, fill: '#333' }}}  tickCount={3} padding={{top: 20, bottom: 20}} />
                        <Tooltip />
                        <Legend iconSize={20} verticalAlign='top' wrapperStyle={{top:"-10px", fontSize:"17px", fontWeight:"500"}} iconType="plainline"/>
                        <Line type="monotone" dataKey="healthIndex" stroke="#10B982" activeDot={{ r: 8 }} name="Health Index"/>
                        </LineChart>
                    </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PlantHealth;
