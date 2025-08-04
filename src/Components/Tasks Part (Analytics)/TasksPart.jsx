import {Droplet,Axe,Package,Timer,TriangleAlert,UserCheck,UserX,ClipboardCheck, Truck} from 'lucide-react';
import {Line as LineDrow} from 'rc-progress';
import { XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer ,PieChart, Pie, Cell,LineChart,Line
} from 'recharts';
import { useState, useEffect, useContext } from 'react';
import { userContext } from '../../Context/User.context';
import { AllContext } from '../../Context/All.context';
import axios from 'axios';

const TasksPart = ({ farmId, timePeriodDays, timePeriodLabel }) => {
    const { token } = useContext(userContext);
    const { baseUrl } = useContext(AllContext);
    
    // State for tasks data
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [taskStatusData, setTaskStatusData] = useState([]);
    const [taskTrendData, setTaskTrendData] = useState([]);
    const [fieldDistributionData, setFieldDistributionData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [assigneeData, setAssigneeData] = useState([]);

    // Categories mapping (based on TaskCategoryType enum)
    const Categories = [
        "Irrigation",
        "Fertilization", 
        "PlantingOrHarvesting",
        "Maintenance",
        "Inspection",
        "PestAndHealthControl"
    ];

    // Priority mapping
    const Priority = ["Low", "Medium", "High"];



    // Fetch tasks data
    const fetchTasks = async () => {
        if (!token || !farmId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const options = {
                url: `${baseUrl}/farms/${farmId}/Tasks`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios(options);
            setTasks(data || []);
            processTasksData(data || []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    // Process tasks data to create chart data
    const processTasksData = (tasksData) => {
        const now = new Date();
        const filterStartDate = timePeriodDays ? new Date(now.getTime() - (timePeriodDays * 24 * 60 * 60 * 1000)) : null;
        
        // Filter tasks based on time period if specified
        const filteredTasks = timePeriodDays ? tasksData.filter(task => {
            const taskDate = new Date(task.createdAt || task.dueDate);
            return taskDate >= filterStartDate;
        }) : tasksData;
        
        // Calculate task status distribution
        const completed = filteredTasks.filter(task => task.completedAt).length;
        const inProgress = filteredTasks.filter(task => task.assignedToId && !task.completedAt).length;
        const pending = filteredTasks.filter(task => !task.assignedToId && !task.claimedById && !task.completedAt).length;
        const overdue = filteredTasks.filter(task => {
            if (task.completedAt) return false; // Already completed
            if (!task.dueDate) return false; // No due date
            return new Date(task.dueDate) < now;
        }).length;

        const total = filteredTasks.length;
        
        setTaskStatusData([
            { name: "Completed", value: completed, color: "#34A853", percentage: total ? Math.round((completed / total) * 100) : 0 },
            { name: "InProgress", value: inProgress, color: "#4285F4", percentage: total ? Math.round((inProgress / total) * 100) : 0 },
            { name: "Pending", value: pending, color: "#F49E0B", percentage: total ? Math.round((pending / total) * 100) : 0 },
            { name: "Overdue", value: overdue, color: "#E13939", percentage: total ? Math.round((overdue / total) * 100) : 0 },
        ]);

        // Calculate task completion trend (last 6 months)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const trendData = [];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = months[date.getMonth()];
            
            const monthTasks = filteredTasks.filter(task => {
                const taskDate = new Date(task.createdAt || task.dueDate);
                return taskDate.getMonth() === date.getMonth() && taskDate.getFullYear() === date.getFullYear();
            });
            
            const completedInMonth = monthTasks.filter(task => {
                if (!task.completedAt) return false;
                const completedDate = new Date(task.completedAt);
                return completedDate.getMonth() === date.getMonth() && completedDate.getFullYear() === date.getFullYear();
            }).length;
            
            trendData.push({
                month: monthName,
                Completed: completedInMonth,
                Total: monthTasks.length
            });
        }
        
        setTaskTrendData(trendData);

        // Calculate field distribution
        const fieldGroups = {};
        filteredTasks.forEach(task => {
            const fieldName = task.fieldName || 'Unknown Field';
            if (!fieldGroups[fieldName]) {
                fieldGroups[fieldName] = { high: 0, medium: 0, low: 0, total: 0 };
            }
            
            fieldGroups[fieldName].total++;
            if (task.itemPriority === 2) fieldGroups[fieldName].high++;
            else if (task.itemPriority === 1) fieldGroups[fieldName].medium++;
            else fieldGroups[fieldName].low++;
        });

        const fieldDistribution = Object.entries(fieldGroups).map(([fieldName, counts]) => ({
            fieldName,
            ...counts
        }));
        
        setFieldDistributionData(fieldDistribution);

        // Calculate category distribution
        const categoryGroups = {};
        Categories.forEach((category, index) => {
            categoryGroups[index] = { name: category, count: 0 };
        });
        
        filteredTasks.forEach(task => {
            if (task.category !== undefined && categoryGroups[task.category]) {
                categoryGroups[task.category].count++;
            }
        });

        const maxCategoryCount = Math.max(...Object.values(categoryGroups).map(cat => cat.count), 1);
        const categoryDistribution = Object.values(categoryGroups).map(category => ({
            ...category,
            displayName: category.name === "PlantingOrHarvesting" ? "Planting/Harvesting" : 
                        category.name === "PestAndHealthControl" ? "Pest & Health Control" : 
                        category.name,
            percentage: maxCategoryCount > 0 ? Math.round((category.count / maxCategoryCount) * 100) : 0
        }));
        
        setCategoryData(categoryDistribution);

        // Calculate task assignments (top assignees) - only for actually assigned tasks
        const assigneeGroups = {};
        filteredTasks.forEach(task => {
            if (task.assignedToId && task.assignedTo) {
                const assigneeId = task.assignedToId;
                const assigneeName = task.assignedTo;
                
                if (!assigneeGroups[assigneeId]) {
                    assigneeGroups[assigneeId] = { 
                        count: 0, 
                        assigneeId,
                        assigneeName 
                    };
                }
                assigneeGroups[assigneeId].count++;
            }
        });

        const sortedAssignees = Object.values(assigneeGroups)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5) // Top 5 assignees
            .map(assignee => {
                // Use the assignedTo name directly from the task data
                return {
                    ...assignee,
                    memberName: assignee.assigneeName
                };
            });
        
        setAssigneeData(sortedAssignees);
    };

    useEffect(() => {
        fetchTasks();
    }, [farmId, token, timePeriodDays]);



    if (loading) {
        return (
            <section className=''>
                <div className="grid xl:grid-cols-3 gap-[20px] mb-[16px]">
                    <div className="col-span-3 flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading tasks data...</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className=''>
            <div className="grid xl:grid-cols-3 gap-[20px] mb-[16px]">
                <div className="col-span-3 md:col-span-2 border-[1px] border-[rgba(13,18,28,0.25)] rounded-[12px]">
                    <div className="p-[16px]">
                        <h2 className="text-[#0D121C] text-[16px] font-medium mb-[8px]">Task Completion Overview</h2>
                        <p className="text-[#616161] text-[14px] font-medium">Task status and completion rates </p>
                            </div>
                    <div className="mb-[8px]"><p className="text-center text-[#616161] text-[14px] font-semibold">Task Status Distribution</p></div>
                    <div className='h-[300px]'>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Legend verticalAlign="top" iconSize={16} height={32} iconType="plainline" wrapperStyle={{ fontSize:"14px", fontWeight:"500",marginTop:"-16px"}}/>
                                <Pie data={taskStatusData} cx="50%" cy='50%' innerRadius="50%" outerRadius="90%" paddingAngle={0} dataKey="value">
                                    {taskStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-y-[6px] py-[16px] w-[80%] mx-auto text-[14px]">
                        {taskStatusData.map((status, index) => (
                            <div key={index} className="space-y-[6px] flex flex-col items-center">
                                <p className="text-[#616161] font-semibold">{status.name}</p>
                                <p className="font-medium">{status.value} ({status.percentage}%)</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-3 md:col-span-1 grid grid-rows-2 gap-y-[20px]">
                    <div className="border-[1px] row-span-2 border-[rgba(13,18,28,0.25)] rounded-[12px] p-[12px] ">
                        <h2 className="text-[#0D121C] text-[16px] font-medium mb-[10px]">Task Categories</h2>
                        <p className="text-[#616161] text-[14px] font-medium">Distribution by task type</p>
                        <div className="mt-[16px] space-y-[12px]">
                            {categoryData.map((category, index) => {
                                const icons = [
                                    <Droplet size={16} strokeWidth={2} className='text-[#089FFC]' />,
                                    <Package size={16} strokeWidth={2} className='text-[#EBB212]' />,
                                    <Truck size={16} strokeWidth={2} className='text-[#25C462]' />,
                                    <Axe size={16} strokeWidth={2} className='text-[#616161]' />,
                                    <ClipboardCheck size={16} strokeWidth={2} className='text-[#8C60CF]' />,
                                    <TriangleAlert size={16} strokeWidth={2} className='text-[#E13939]' />
                                ];
                                
                                return (
                                    <div key={index} className="">
                                <div className="flex justify-between items-center">
                                            <div className="flex space-x-[9px] items-center text-[14px] font-medium">
                                                {icons[index] || <Package size={20} strokeWidth={2} className='text-[#616161]' />}
                                                <p className="">{category.displayName || category.name}</p>
                                    </div>
                                            <p className="capitalize text-[13px] font-medium">{category.count} Tasks</p>
                                </div>
                                        <LineDrow 
                                            percent={category.percentage} 
                                            strokeLinecap="round" 
                                            strokeColor="#1E6930" 
                                            className="h-[5px] text-mainColor w-full my-[12px] rounded-lg" 
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="border-[1px] row-span-2 border-[rgba(13,18,28,0.25)] rounded-[12px] p-[12px]">
                        <h2 className="text-[#0D121C] text-[16px] font-medium mb-[10px]">Task Assignments</h2>
                        <p className="text-[#616161] text-[14px] font-medium">Top assigned users</p>
                        <div className="mt-[16px] space-y-[12px]">
                            {assigneeData.length > 0 ? (
                                assigneeData.map((assignee, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <UserCheck size={16} strokeWidth={2} className='text-[#25C462]' />
                                    <p className="text-[14px] font-medium">{assignee.memberName}</p>
                                </div>
                                <div className="px-[8px] py-[1px] rounded-[12px] bg-[#25c4621e]">
                                    <p className="text-[#0D121C] text-[12px] font-medium">{assignee.count} Tasks</p>
                                </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-[#616161] text-[14px]">No assigned tasks found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Task Completion Trend */}
                <div className="col-span-3">
                    <div className="border-[1px] border-[rgba(13,18,28,0.25)] rounded-[12px]">
                        <div className="p-[15px] mb-[10px]">
                            <h2 className="text-[#0D121C] text-[19px] font-medium mb-[15px]">Task Completion Trend</h2>
                            <p className="text-[#616161] text-[17px] font-medium">Monthly task completion overview</p>
                                    </div>
                        <div className="mb-[8px]"><p className="text-center text-[#616161] text-[14px] font-semibold">Task Completion Over Time</p></div>
                        <div className='h-[300px]'>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={taskTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 0}}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis label={{value: 'Tasks', angle: -90, position: "insideLeft", style: { textAnchor: 'middle', fontSize: 14, fill: '#333' }}} domain={[0, 'dataMax + 5']}/>
                                    <Tooltip />
                                    <Legend verticalAlign="top" iconSize={16} height={32} iconType="plainline" wrapperStyle={{ fontSize:"14px", fontWeight:"500",marginTop:"-16px"}}/>
                                    <Line type="monotone" dataKey="Completed" stroke="#3B82F6" strokeWidth={2} activeDot={{ r: 8 }} name="Completed Tasks"/>
                                    <Line type="monotone" dataKey="Total" stroke="#F49E0B" strokeWidth={2} activeDot={{ r: 8 }} name="Total Tasks"/>
                                </LineChart>
                            </ResponsiveContainer>     
                        </div>
                    </div>
                </div>
                
                {/* Field Distribution */}
                <div className="col-span-3">
                    <div className="border-[1px] border-[rgba(13,18,28,0.25)] rounded-[12px]">
                        <div className="p-[15px] mb-[10px]">
                            <h2 className="text-[#0D121C] text-[19px] font-medium mb-[15px]">Task Distribution</h2>
                        <p className="text-[#616161] text-[17px] font-medium">Tasks by field and priority</p>
                    </div>
                        <div className="w-[90%] mx-auto gap-[20px] my-[30px]">
                            <div className="grid grid-cols-5 text-[#0D121C] text-[16px] font-medium mb-4">
                            <p className="">Field</p>
                            <p className="flex justify-center">High Priority</p>
                            <p className="flex justify-center">Medium Priority</p>
                            <p className="flex justify-center">Low Priority</p>
                            <p className="flex justify-center">Total</p>
                        </div>
                            {fieldDistributionData.length > 0 ? (
                                fieldDistributionData.map((field, index) => (
                                    <div key={index} className="grid grid-cols-5 text-[#616161] text-[16px] font-medium mb-3">
                                        <p className="">{field.fieldName}</p>
                                        <p className="flex justify-center">{field.high}</p>
                                        <p className="flex justify-center">{field.medium}</p>
                                        <p className="flex justify-center">{field.low}</p>
                                        <p className="flex justify-center">{field.total}</p>
                        </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-[#616161] text-[14px]">No field data available</p>
                        </div>
                            )}
                    </div>
                </div>
                </div>
            </div>
        </section>
    );
}

export default TasksPart;
