import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, X, Droplets, AlertTriangle, MessageSquare } from 'lucide-react';
import useNotificationHub from '../../hooks/useNotificationHub';
import toast from 'react-hot-toast';

const NotificationsPage = () => {
  const { 
    notifications, 
    unreadCount,
    isLoadingInitial,
    markAsRead,
    markAllAsRead,
    clearNotifications 
  } = useNotificationHub();

  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const [isClearingAll, setIsClearingAll] = useState(false);
  const [timeUpdateTrigger, setTimeUpdateTrigger] = useState(0);

  // Auto-update timestamps every 5 seconds for real-time feel
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUpdateTrigger(prev => prev + 1);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

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

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await markAsRead(notification.id);
      } catch (error) {
        toast.error('Failed to mark notification as read');
      }
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

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Action Header - Only show action buttons */}
      {notifications.length > 0 && (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Stats */}
            <p className="text-sm text-gray-600">
              {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
              {unreadCount > 0 && ` • ${unreadCount} unread`}
            </p>
            
            {/* Action Buttons */}
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={isMarkingAllRead}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm text-green-600 hover:text-green-800 font-medium bg-green-50 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isMarkingAllRead ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
                  ) : (
                    <CheckCheck className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {isMarkingAllRead ? 'Marking...' : 'Mark all read'}
                  </span>
                </button>
              )}
              <button
                onClick={handleClearAll}
                disabled={isClearingAll}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isClearingAll ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent"></div>
                ) : (
                  <X className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {isClearingAll ? 'Clearing...' : 'Clear all'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="max-w-4xl mx-auto p-4">
        {isLoadingInitial ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-mainColor border-t-transparent mb-4"></div>
            <h2 className="text-xl font-medium text-gray-600 mb-2">Loading notifications...</h2>
            <p className="text-gray-500 text-center">
              Please wait while we fetch your notifications
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <Bell className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-gray-600 mb-2">No notifications yet</h2>
            <p className="text-gray-500 text-center">
              You'll see notifications from your farm operations here
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {notifications.map((notification, index) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`relative p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.isRead ? 'bg-green-50' : ''
                } ${index === notifications.length - 1 ? 'border-b-0 rounded-b-lg' : ''} ${index === 0 ? 'rounded-t-lg' : ''}`}
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
                    
                    <p className="text-sm text-gray-900 leading-relaxed">
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
    </div>
  );
};

export default NotificationsPage; 