import { useContext, useEffect, useState } from 'react';
import { AllContext } from '../../Context/All.context';
import { userContext } from '../../Context/User.context';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Area, AreaChart,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const Inventory = ({ farmId, timePeriodDays, timePeriodLabel }) => {
    const { baseUrl } = useContext(AllContext);
    const { token } = useContext(userContext);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = ["Fertilizer", "Chemicals", "Treatments", "Produce"];
    const transactionReasons = ["Restock", "Usage", "Expired", "Transfer", "Manual Adjustment"];

    // Fetch inventory transactions
    const fetchTransactions = async () => {
        if (!token || !farmId) return;
        
        try {
            setLoading(true);
            const response = await axios.get(
                `${baseUrl}/farms/${farmId}/inventoryitemtransactions`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching inventory transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [farmId, token, timePeriodDays]);

    // Filter transactions by time period
    const getFilteredTransactions = () => {
        if (!timePeriodDays) return transactions;
        
        const now = new Date();
        const filterStartDate = new Date(now.getTime() - (timePeriodDays * 24 * 60 * 60 * 1000));
        
        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.transactionDate);
            return transactionDate >= filterStartDate;
        });
    };

    // Process data for charts
    const processTransactionsByCategory = () => {
        const filteredTransactions = getFilteredTransactions();
        const categoryData = categories.map(category => {
            const categoryIndex = categories.indexOf(category);
            const categoryTransactions = filteredTransactions.filter(t => t.itemCategory === categoryIndex);
            const totalQuantity = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.quantityChanged), 0);
            const totalValue = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.quantityChanged * t.unitCost), 0);
            
            return {
                category,
                transactions: categoryTransactions.length,
                totalQuantity,
                totalValue
            };
        });
        return categoryData;
    };

    const processTransactionsByReason = () => {
        const filteredTransactions = getFilteredTransactions();
        const reasonData = transactionReasons.map((reason, index) => {
            const reasonTransactions = filteredTransactions.filter(t => t.reason === index);
            return {
                name: reason,
                value: reasonTransactions.length,
                color: ['#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#10B981'][index]
            };
        }).filter(item => item.value > 0);
        return reasonData;
    };

    const processMonthlyTransactions = () => {
        const filteredTransactions = getFilteredTransactions();
        const monthlyData = {};
        filteredTransactions.forEach(transaction => {
            const date = new Date(transaction.transactionDate);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { month: monthKey, ...categories.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {}) };
            }
            
            const categoryName = categories[transaction.itemCategory];
            monthlyData[monthKey][categoryName] += Math.abs(transaction.quantityChanged);
        });
        
        return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
    };

    const categoryData = processTransactionsByCategory();
    const reasonData = processTransactionsByReason();
    const monthlyData = processMonthlyTransactions();
    const filteredTransactions = getFilteredTransactions();
    const totalTransactions = filteredTransactions.length;
    const totalSpending = filteredTransactions.reduce((sum, t) => sum + Math.abs(t.quantityChanged * t.unitCost), 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-[#616161]">Loading inventory data...</p>
            </div>
        );
    }

    return (
        <section className=''>
            <div className="grid xl:grid-cols-3 gap-[20px] mb-[16px]">
                {/* Transaction Overview */}
                <div className="col-span-3 md:col-span-2 border-[1px] border-[rgba(13,18,28,0.25)] rounded-[12px]">
                    <div className="p-[16px]">
                        <h2 className="text-[#0D121C] text-[16px] font-medium mb-[8px]">Transaction Activity by Category</h2>
                        <p className="text-[#616161] text-[14px] font-medium">Inventory transaction volumes and spending</p>
                    </div>
                    <div className="mb-[8px]"><p className="text-center text-[#616161] text-[14px] font-semibold">Transactions by Category</p></div>
                    <div className='h-[300px]'>
                    <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                            <XAxis dataKey="category" />
                                <YAxis label={{value:"Number of Transactions", angle: -90, position: "insideLeft", style: { textAnchor: 'middle', fontSize: 14, fill: '#333' }}}/>
                                <Tooltip formatter={(value, name) => [value, 'Transactions']} />
                                <Legend verticalAlign="top" iconSize={16} height={32} iconType="plainline" wrapperStyle={{ fontSize:"14px", fontWeight:"500",marginTop:"-16px"}}/>
                                <Bar dataKey="transactions" name="Transactions" barSize={32} fill="#3399FF" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-y-[6px] py-[16px] w-[80%] mx-auto text-[14px]">
                        <div className="space-y-[6px] flex flex-col items-center">
                            <p className="text-[#616161] font-semibold">Total Transactions</p>
                            <p className="font-medium">{totalTransactions}</p>
                        </div>
                        <div className="space-y-[6px] flex flex-col items-center">
                            <p className="text-[#616161] font-semibold">Categories</p>
                            <p className="font-medium">{categories.length}</p>
                        </div>
                        <div className="space-y-[6px] flex flex-col items-center">
                            <p className="text-[#616161] font-semibold">Total Spending</p>
                            <p className="font-medium">EGP {totalSpending.toLocaleString()}</p>
                        </div>
                        <div className="space-y-[6px] flex flex-col items-center">
                            <p className="text-[#616161] font-semibold">Most Active</p>
                            <p className="font-medium">{categoryData.length > 0 ? categoryData.reduce((max, cat) => cat.transactions > max.transactions ? cat : max, categoryData[0])?.category : 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Transaction Types Distribution */}
                <div className="col-span-3 md:col-span-1 border-[1px] border-[rgba(13,18,28,0.25)] rounded-[12px] p-[12px]">
                    <h2 className="text-[#0D121C] text-[16px] font-medium mb-[10px]">Transaction Types</h2>
                    <p className="text-[#616161] text-[14px] font-medium">Distribution by transaction reason</p>
                    <div className="flex justify-center items-center mt-[16px]">
                            <PieChart width={260} height={220}>
                            <Legend verticalAlign="top" iconSize={16} height={32} layout='horizontal' iconType="plainline" align="center" wrapperStyle={{ fontSize:"14px", fontWeight:"500",marginTop:"-16px", position:"absolute",top:"40px"}}/>
                            <Pie data={reasonData} cx="50%" cy="50%" innerRadius={25} outerRadius={60} paddingAngle={0} dataKey="value">
                                {reasonData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            <Tooltip />
                            </PieChart>
                    </div>
                    <div className="mt-[20px] space-y-[8px]">
                        {reasonData.map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <div className="h-[11px] w-[11px] rounded-full" style={{backgroundColor: item.color}}></div>
                                    <p className="text-[14px] font-medium">{item.name}</p>
                                </div>
                                <div className="px-[8px] py-[1px] rounded-[12px] bg-[#9f9f9f2b]">
                                    <p className="text-[#0D121C] text-[12px] font-medium">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monthly Transaction Trends */}
                <div className="col-span-3 border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px] p-[15px]">
                    <div className='mb-[30px]'>
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[20px]">Monthly Transaction Trends</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Transaction volumes by category over time</p>
                    </div>
                    <div className="mb-[10px]"><p className="text-center text-[#616161] text-[17px] font-semibold">Monthly Activity</p></div>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                                data={monthlyData}
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
                                    <linearGradient id="colorProduce" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                    </linearGradient>
                            </defs>
                            <XAxis dataKey="month" />
                                <YAxis label={{value:"Transaction Volume", dx:-10, angle: -90, position: "insideLeft", style: { textAnchor: 'middle', fontSize: 16, fill: '#333' }}}/>
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                                <Legend iconSize={20} verticalAlign="top" height={40} layout='horizontal' iconType="plainline" align="center" wrapperStyle={{ fontSize:"16px", fontWeight:"500",marginTop:"-20px", position:"absolute",top:"25px"}}/>
                                <Area type="monotone" dataKey="Fertilizer" stroke="#0088FE" fillOpacity={1} fill="url(#colorFert)" />
                            <Area type="monotone" dataKey="Chemicals" stroke="#FFA500" fillOpacity={1} fill="url(#colorChem)" />
                            <Area type="monotone" dataKey="Treatments" stroke="#228B22" fillOpacity={1} fill="url(#colorTreat)" />
                                <Area type="monotone" dataKey="Produce" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorProduce)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Transactions Table */}
                <div className="col-span-3 border-[1px] border-[rgba(13,18,28,0.25)] rounded-[15px] p-[15px]">
                    <div className='mb-[20px]'>
                        <h2 className="text-[#0D121C] text-[19px] font-medium mb-[10px]">Recent Transactions</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Latest inventory activity</p>
                                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#0d121c37]">
                                    <th className="text-left py-2 font-medium text-[#616161]">Item</th>
                                    <th className="text-left py-2 font-medium text-[#616161]">Category</th>
                                    <th className="text-left py-2 font-medium text-[#616161]">Quantity</th>
                                    <th className="text-left py-2 font-medium text-[#616161]">Reason</th>
                                    <th className="text-left py-2 font-medium text-[#616161]">Value</th>
                                    <th className="text-left py-2 font-medium text-[#616161]">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.slice(0, 10).map((transaction) => (
                                    <tr key={transaction.id} className="border-b border-[#0d121c37]">
                                        <td className="py-2 font-medium">{transaction.inventoryItemName}</td>
                                        <td className="py-2 text-[#616161]">{categories[transaction.itemCategory]}</td>
                                        <td className="py-2">{transaction.quantityChanged > 0 ? '+' : ''}{transaction.quantityChanged} {transaction.measurementUnit}</td>
                                        <td className="py-2">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                transaction.reason === 0 ? 'bg-green-100 text-green-800' :
                                                transaction.reason === 1 ? 'bg-blue-100 text-blue-800' :
                                                transaction.reason === 2 ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {transactionReasons[transaction.reason]}
                                            </span>
                                        </td>
                                        <td className="py-2">EGP {(Math.abs(transaction.quantityChanged) * transaction.unitCost).toLocaleString()}</td>
                                        <td className="py-2 text-[#616161]">{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {transactions.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-[#616161]">No transactions found</p>
                                    </div>
                        )}
                                    </div>
                </div>
            </div>
        </section>
    );
}


export default Inventory;
