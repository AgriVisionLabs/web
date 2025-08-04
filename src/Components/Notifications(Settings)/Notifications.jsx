import { Bell, Wifi, WifiOff } from 'lucide-react';
import { AllContext } from '../../Context/All.context';
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import useNotificationHub from '../../hooks/useNotificationHub';
import ToggleSwitch from '../ui/ToggleSwitch';
import { userContext } from '../../Context/User.context';

const Notifications = () => {
    const { baseUrl } = useContext(AllContext);
    const { token } = useContext(userContext);
    const { connectionStatus, notifications } = useNotificationHub();
    
    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Individual notification type states
    const [notificationTypes, setNotificationTypes] = useState({
        irrigation: false,
        task: true,
        message: false,
        alert: false,
        warning: false,
        systemUpdate: false
    });

    // Function to fetch notification preferences from API
    const fetchNotificationPreferences = async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (!token) {
                console.error('No token available for fetching notification preferences');
                setError('Authentication required');
                return;
            }

            const options = {
                url: `${baseUrl}/Accounts/notification-preferences`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios(options);
            console.log('Notification preferences fetched:', data);
            
            // Update state with fetched data (ignore isEnabled from API)
            setNotificationTypes({
                irrigation: data.irrigation,
                task: data.task,
                message: data.message,
                alert: data.alert,
                warning: data.warning,
                systemUpdate: data.systemUpdate
            });
            
        } catch (error) {
            console.error('Error fetching notification preferences:', error);
            setError('Failed to load notification preferences');
            
            // Keep default values on error
            setNotificationTypes({
                irrigation: false,
                task: true,
                message: false,
                alert: false,
                warning: false,
                systemUpdate: false
            });
        } finally {
            setLoading(false);
        }
    };

    // Function to send notification preferences to API
    const updateNotificationPreferences = async (newNotificationTypes) => {
        try {
            if (!token) {
                console.error('No token available for notification preferences update');
                return;
            }

            const requestBody = {
                isEnabled: true, // Always send true as requested
                irrigation: newNotificationTypes.irrigation,
                task: newNotificationTypes.task,
                message: newNotificationTypes.message,
                alert: newNotificationTypes.alert,
                warning: newNotificationTypes.warning,
                systemUpdate: newNotificationTypes.systemUpdate
            };

            console.log('Sending PUT request to /Accounts/notification-preferences with body:', requestBody);

            const options = {
                url: `${baseUrl}/Accounts/notification-preferences`,
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                data: requestBody,
            };

            const response = await axios(options);
            console.log('Notification preferences updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating notification preferences:', error);
            console.error('Request body that failed:', {
                isEnabled: true,
                irrigation: newNotificationTypes.irrigation,
                task: newNotificationTypes.task,
                message: newNotificationTypes.message,
                alert: newNotificationTypes.alert,
                warning: newNotificationTypes.warning,
                systemUpdate: newNotificationTypes.systemUpdate
            });
        }
    };

    // Fetch notification preferences on component mount
    useEffect(() => {
        if (token) {
            fetchNotificationPreferences();
        }
    }, [token]);

    // Handle individual toggle change
    const handleIndividualToggle = async (type) => {
        const newNotificationTypes = {
            ...notificationTypes,
            [type]: !notificationTypes[type]
        };
        
        console.log(`${type} notification toggle clicked. New state:`, newNotificationTypes[type]);
        setNotificationTypes(newNotificationTypes);

        // Send API request
        await updateNotificationPreferences(newNotificationTypes);
    };

    // Show loading state
    if (loading) {
        return (
            <section className='mb-[20px]'>
                <div className="border-[1px] border-[rgba(13,18,28,0.25)] rounded-[12px] p-[16px]">
                    <div className="flex items-center justify-center py-12 sm:py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-mainColor mx-auto mb-4"></div>
                            <p className="text-gray-500 text-sm sm:text-base">Loading notification preferences...</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className='mb-[20px]'>
            <div className="border-[1px] border-[rgba(13,18,28,0.25)] rounded-[12px] p-[16px]">
                {/* Error message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">
                            {error}. Using default settings.
                        </p>
                    </div>
                )}
                
                <div className="">
                    <div className="flex space-x-2 items-center text-[#0D121C] mb-[8px]">
                        <Bell size={20} strokeWidth={1.8}/>
                        <h2 className="text-[17px] font-medium">Notifications</h2>
                    </div>
                    <p className="text-[#9F9F9F] text-[14px] font-medium">Control what notifications you receive and how they are delivered.</p>
                </div>

                {/* Individual Notification Types */}
                <div className="mt-[16px]">
                    <h4 className="text-[15px] font-medium text-[#0D121C] mb-[12px]">Notification Types</h4>
                    
                    <div className="space-y-[8px]">
                        {/* Irrigation */}
                        <div className="flex items-start justify-between gap-3 py-[12px] border-b-[1px] border-[#0d121c1a]">
                            <div className="text-[#0D121C] flex-1 min-w-0">
                                <h3 className="text-[14px] sm:text-[15px] font-medium mb-[3px]">Irrigation</h3>
                                <p className="text-[#9F9F9F] text-[12px] sm:text-[13px] font-medium pr-2">Notifications about irrigation schedules and system status</p>
                            </div>
                            <div className="flex-shrink-0">
                                <ToggleSwitch 
                                    enabled={notificationTypes.irrigation} 
                                    onClick={() => handleIndividualToggle('irrigation')}
                                />
                            </div>
                        </div>

                        {/* Task */}
                        <div className="flex items-start justify-between gap-3 py-[12px] border-b-[1px] border-[#0d121c1a]">
                            <div className="text-[#0D121C] flex-1 min-w-0">
                                <h3 className="text-[14px] sm:text-[15px] font-medium mb-[3px]">Task</h3>
                                <p className="text-[#9F9F9F] text-[12px] sm:text-[13px] font-medium pr-2">Updates about task assignments and completions</p>
                            </div>
                            <div className="flex-shrink-0">
                                <ToggleSwitch 
                                    enabled={notificationTypes.task} 
                                    onClick={() => handleIndividualToggle('task')}
                                />
                            </div>
                        </div>

                        {/* Message */}
                        <div className="flex items-start justify-between gap-3 py-[12px] border-b-[1px] border-[#0d121c1a]">
                            <div className="text-[#0D121C] flex-1 min-w-0">
                                <h3 className="text-[14px] sm:text-[15px] font-medium mb-[3px]">Message</h3>
                                <p className="text-[#9F9F9F] text-[12px] sm:text-[13px] font-medium pr-2">Chat messages and communication notifications</p>
                            </div>
                            <div className="flex-shrink-0">
                                <ToggleSwitch 
                                    enabled={notificationTypes.message} 
                                    onClick={() => handleIndividualToggle('message')}
                                />
                            </div>
                        </div>

                        {/* Alert */}
                        <div className="flex items-start justify-between gap-3 py-[12px] border-b-[1px] border-[#0d121c1a]">
                            <div className="text-[#0D121C] flex-1 min-w-0">
                                <h3 className="text-[14px] sm:text-[15px] font-medium mb-[3px]">Alert</h3>
                                <p className="text-[#9F9F9F] text-[12px] sm:text-[13px] font-medium pr-2">Important alerts that require immediate attention</p>
                            </div>
                            <div className="flex-shrink-0">
                                <ToggleSwitch 
                                    enabled={notificationTypes.alert} 
                                    onClick={() => handleIndividualToggle('alert')}
                                />
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="flex items-start justify-between gap-3 py-[12px] border-b-[1px] border-[#0d121c1a]">
                            <div className="text-[#0D121C] flex-1 min-w-0">
                                <h3 className="text-[14px] sm:text-[15px] font-medium mb-[3px]">Warning</h3>
                                <p className="text-[#9F9F9F] text-[12px] sm:text-[13px] font-medium pr-2">Warning notifications about potential issues</p>
                            </div>
                            <div className="flex-shrink-0">
                                <ToggleSwitch 
                                    enabled={notificationTypes.warning} 
                                    onClick={() => handleIndividualToggle('warning')}
                                />
                            </div>
                        </div>

                        {/* System Update */}
                        <div className="flex items-start justify-between gap-3 py-[12px]">
                            <div className="text-[#0D121C] flex-1 min-w-0">
                                <h3 className="text-[14px] sm:text-[15px] font-medium mb-[3px]">System Update</h3>
                                <p className="text-[#9F9F9F] text-[12px] sm:text-[13px] font-medium pr-2">Notifications about system updates and maintenance</p>
                            </div>
                            <div className="flex-shrink-0">
                                <ToggleSwitch 
                                    enabled={notificationTypes.systemUpdate} 
                                    onClick={() => handleIndividualToggle('systemUpdate')}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="mt-[18px] p-[12px] bg-gray-50 rounded-[8px]">
                    <p className="text-[12px] sm:text-[13px] text-[#666666] font-medium">
                        {Object.values(notificationTypes).filter(Boolean).length} of {Object.keys(notificationTypes).length} notification types enabled
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Notifications;
