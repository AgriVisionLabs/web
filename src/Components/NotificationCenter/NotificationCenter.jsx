import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCheck, Droplets, AlertTriangle, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useNotificationHub from '../../hooks/useNotificationHub';
import toast from 'react-hot-toast';

const NotificationCenter = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    connectionStatus, 
    unreadCount,
    isLoadingInitial,
    markAsRead,
    markAllAsRead,
    clearNotifications 
  } = useNotificationHub();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const [isClearingAll, setIsClearingAll] = useState(false);
  const [timeUpdateTrigger, setTimeUpdateTrigger] = useState(0);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Auto-update timestamps every 5 seconds for real-time feel (only when dropdown is open for performance)
  useEffect(() => {
    if (!isOpen) return; // Only update when dropdown is open
    
    const interval = setInterval(() => {
      setTimeUpdateTrigger(prev => prev + 1);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleNotificationClick = () => {
    if (isMobile) {
      // Navigate to notifications page on mobile
      navigate('/notifications');
    } else {
      // Toggle dropdown on desktop
      setIsOpen(!isOpen);
    }
  };

  const getNotificationIcon = (type) => {
    // Show water icon for irrigation type (0)
    if (type === 0) {
      return <Droplets className="w-5 h-5 text-green-500" />; // Irrigation
    }
    // Show message icon for message type (2)
    if (type === 2) {
      return <MessageSquare className="w-5 h-5 text-purple-500" />; // Message
    }
    // Show alert icon for alert type (3)
    if (type === 3) {
      return <AlertTriangle className="w-5 h-5 text-red-500" />; // Alert
    }
    return null; // No icon for other types
  };

  const getNotificationColor = (type) => {
    const colorMap = {
      0: 'border-green-200 bg-green-50', // Irrigation
      1: 'border-green-200 bg-green-50', // Task
      2: 'border-purple-200 bg-purple-50', // Message
      3: 'border-red-200 bg-red-50', // Alert
      4: 'border-yellow-200 bg-yellow-50', // Warning
      5: 'border-gray-200 bg-gray-50' // SystemUpdate
    };
    return colorMap[type] || 'border-gray-200 bg-gray-50';
  };

  const getNotificationTypeText = (type) => {
    const typeMap = {
      0: 'Irrigation',
      1: 'Task',
      2: 'Message',
      3: 'Alert',
      4: 'Warning',
      5: 'System Update'
    };
    return typeMap[type] || 'Notification';
  };

  const formatTime = (dateString) => {
    const serverDate = new Date(dateString);
    const now = new Date();
    
    // Get user's timezone offset in minutes (negative for ahead of UTC, positive for behind)
    const timezoneOffsetMinutes = now.getTimezoneOffset();
    
    // Adjust server date to user's local timezone
    // If user is GMT+3, getTimezoneOffset() returns -180, so we subtract -180 (add 180)
    const adjustedDate = new Date(serverDate.getTime() - (timezoneOffsetMinutes * 60 * 1000));
    
    const diffInSeconds = Math.floor((now - adjustedDate) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    
    if (diffInSeconds < 10) return 'Just now';
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`; // Less than 7 days
    
    // For dates older than a week, show just the date without time (use adjusted date)
    return adjustedDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDropdownNotificationClick = async (notification) => {
    console.log('🖱️ Notification clicked:', notification.id, 'isRead:', notification.isRead);
    
    if (!notification.isRead) {
      try {
        console.log('📤 Calling markAsRead for notification:', notification.id);
        await markAsRead(notification.id);
        console.log('✅ markAsRead completed for notification:', notification.id);
      } catch (error) {
        console.error('❌ Error in handleDropdownNotificationClick:', error);
        toast.error('Failed to mark notification as read');
      }
    } else {
      console.log('ℹ️ Notification already read, skipping API call');
    }
  };

  const handleMarkAllAsRead = async () => {
    if (isMarkingAllRead) return;
    
    setIsMarkingAllRead(true);
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  const handleClearAll = async () => {
    if (isClearingAll) return;
    
    setIsClearingAll(true);
    try {
      await clearNotifications();
      toast.success('All notifications cleared');
    } catch (error) {
      toast.error('Failed to clear notifications');
    } finally {
      setIsClearingAll(false);
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': 
      case 'reconnecting': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={handleNotificationClick}
        className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Desktop Notification Dropdown - Only show on desktop */}
      {!isMobile && isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[700px] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Action Buttons */}
            {notifications.length > 0 && (
              <div className="flex space-x-2 mt-3">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={isMarkingAllRead}
                    className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isMarkingAllRead ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
                    ) : (
                      <CheckCheck className="w-4 h-4" />
                    )}
                    <span>{isMarkingAllRead ? 'Marking...' : 'Mark all read'}</span>
                  </button>
                )}
                <button
                  onClick={handleClearAll}
                  disabled={isClearingAll}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isClearingAll ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent"></div>
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  <span>{isClearingAll ? 'Clearing...' : 'Clear all'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[500px] overflow-y-auto">
            {isLoadingInitial ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-mainColor border-t-transparent mx-auto mb-3"></div>
                <p className="text-sm">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No notifications yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  You'll see notifications from your farm operations here
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleDropdownNotificationClick(notification)}
                    className={`relative p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.isRead ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type) && (
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600">
                            {getNotificationTypeText(notification.type)}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatTime(notification.createdOn)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-900">
                          {notification.message}
                        </p>
                      </div>
                      
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-center text-gray-500">
                Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                {unreadCount > 0 && ` • ${unreadCount} unread`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close - Desktop only */}
      {!isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationCenter; 