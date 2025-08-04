import { useState, useEffect, useCallback, useRef, useContext } from 'react';
import * as signalR from '@microsoft/signalr';
import { userContext } from '../Context/User.context';
import { AllContext } from '../Context/All.context';
import { chatService } from '../services/chatService';
import axios from 'axios';
import toast from 'react-hot-toast';

const useNotificationHub = () => {
  const { token, userId } = useContext(userContext);
  const { baseUrl } = useContext(AllContext);
  
  // Helper function to check if browser Notification API is available
  const isNotificationSupported = () => {
    return typeof Notification !== 'undefined' && 'permission' in Notification;
  };
  
  const [connection, setConnection] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const connectionRef = useRef(null);
  const initialLoadRef = useRef(false);
  
  // Chat connection states
  const [chatConnected, setChatConnected] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState(null);
  const chatConnectedRef = useRef(false);
  
  // Calculate unread count from notifications array
  const unreadCount = notifications.filter(notif => !notif.isRead).length;
  
  // Use refs to store current values without causing effect re-runs
  const tokenRef = useRef(token);
  const userIdRef = useRef(userId);
  const baseUrlRef = useRef(baseUrl);
  
  // Update refs when values change
  tokenRef.current = token;
  userIdRef.current = userId;
  baseUrlRef.current = baseUrl;

  // Reset initial load flag when user changes or logs out
  useEffect(() => {
    if (!token || !userId) {
      initialLoadRef.current = false;
      setNotifications([]);
    }
  }, [token, userId]);

  // Load initial notifications from the API
  const loadInitialNotifications = useCallback(async () => {
    if (!tokenRef.current || initialLoadRef.current) {
      return;
    }

    setIsLoadingInitial(true);
    try {
      console.log('📥 Loading initial notifications...');
      const options = {
        url: `${baseUrlRef.current}/notifications`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenRef.current}`,
          'Content-Type': 'application/json'
        },
      };
      const response = await axios(options);

      const initialNotifications = response.data || [];
      console.log(`✅ Loaded ${initialNotifications.length} initial notifications`);
      
      // Sort notifications by createdOn date in descending order (newest first)
      const sortedNotifications = initialNotifications.sort((a, b) => 
        new Date(b.createdOn) - new Date(a.createdOn)
      );
      console.log(`📊 Sorted ${sortedNotifications.length} notifications by creation date (newest first)`);
      
      // Set initial notifications (they should already have isRead status from API)
      setNotifications(sortedNotifications);
      initialLoadRef.current = true;
      
    } catch (error) {
      console.error('❌ Failed to load initial notifications:', error);
      // Don't fail completely, just continue without initial notifications
      setNotifications([]);
      initialLoadRef.current = true;
    } finally {
      setIsLoadingInitial(false);
    }
  }, []); // Empty dependency array since we use refs

  // Fetch notification preferences
  const fetchNotificationPreferences = useCallback(async () => {
    if (!tokenRef.current) return null;
    
    try {
      const options = {
        url: `${baseUrlRef.current}/Accounts/notification-preferences`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenRef.current}`,
        },
      };
      const { data } = await axios(options);
      setNotificationPreferences(data);
      return data;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      return null;
    }
  }, []);

  // Connect to chat hubs
  const connectToChatHubs = useCallback(async () => {
    if (!tokenRef.current || !baseUrlRef.current || chatConnectedRef.current) {
      return;
    }

    try {
      console.log('🔗 Connecting to chat hubs...');
      const connected = await chatService.startConnection(tokenRef.current, baseUrlRef.current);
      
      if (connected) {
        console.log('✅ Chat hubs connected successfully');
        setChatConnected(true);
        chatConnectedRef.current = true;
        
        // Set up message event listeners for notifications
        setupChatEventListeners();
      } else {
        console.log('❌ Failed to connect to chat hubs');
        setChatConnected(false);
        chatConnectedRef.current = false;
      }
    } catch (error) {
      console.error('Error connecting to chat hubs:', error);
      setChatConnected(false);
      chatConnectedRef.current = false;
    }
  }, []);

  // Set up chat event listeners for notifications
  const setupChatEventListeners = useCallback(() => {
    if (!chatService.messagesConnection || !chatService.conversationsConnection) {
      return;
    }

    // Listen for new messages
    chatService.messagesConnection.on('ReceiveMessage', (message) => {
      console.log('📧 New message received:', message);
      
      // Check if message notifications are enabled and message is not from current user
      if (notificationPreferences?.message && message.senderId !== userIdRef.current) {
        toast.success('📧 You have a new message!', {
          duration: 4000,
          position: 'top-right',
        });
      }
    });

    // Listen for new conversations
    chatService.conversationsConnection.on('ConversationCreated', (conversation) => {
      console.log('💬 New conversation created:', conversation);
      
      // Check if message notifications are enabled
      if (notificationPreferences?.message) {
        toast.success('💬 You have a new conversation!', {
          duration: 4000,
          position: 'top-right',
        });
      }
    });

    console.log('✅ Chat event listeners set up successfully');
  }, [notificationPreferences]);

  const connectToHub = useCallback(async () => {
    // Early return if no authentication
    if (!tokenRef.current || !userIdRef.current) {
      console.log('No token or userId available for notification hub');
      return;
    }
    
    // If already connected, don't create another connection
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      console.log('Notification hub already connected, skipping...');
      setConnectionStatus('connected');
      return;
    }
    
    // If connecting, wait for current connection attempt
    if (connectionRef.current?.state === signalR.HubConnectionState.Connecting) {
      console.log('Notification hub connection in progress, waiting...');
      return;
    }

    try {
      // Clean up any existing connection first
      if (connectionRef.current) {
        console.log('Cleaning up existing notification connection...');
        await connectionRef.current.stop();
        connectionRef.current = null;
        setConnection(null);
      }

      setConnectionStatus('connecting');
      console.log('Creating new notification SignalR connection...');
      
      // Create connection with JWT token
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrlRef.current}/hubs/notifications`, {
          accessTokenFactory: () => tokenRef.current,
        })
        .withAutomaticReconnect([0, 2000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Warning) // Reduced logging
        .build();

      // Set up event handlers before starting connection
      newConnection.on('ReceiveNotification', (notificationResponse) => {
        console.log('📨 Received notification:', notificationResponse.id);
        setNotifications(prev => {
          // Check if notification already exists to prevent duplicates
          const exists = prev.some(notif => notif.id === notificationResponse.id);
          if (exists) {
            console.log('⚠️ Duplicate notification detected, skipping:', notificationResponse.id);
            return prev;
          }
          
          // Add new notification (unread by default) and maintain sorted order
          const newNotification = { ...notificationResponse, isRead: false };
          console.log('✅ Adding new notification:', notificationResponse.id);
          
          // Insert notification and maintain descending order by createdOn
          const updatedNotifications = [newNotification, ...prev].sort((a, b) => 
            new Date(b.createdOn) - new Date(a.createdOn)
          );
          
          return updatedNotifications;
        });
        
        // Show browser notification if API is available and permission granted
        if (isNotificationSupported() && Notification.permission === 'granted') {
          try {
            new Notification('Agrivision Notification', {
              body: notificationResponse.message,
              icon: '/agrivisoin-logo-black.png'
            });
          } catch (error) {
            console.warn('Failed to show browser notification:', error);
          }
        }
      });

      // Connection state handlers
      newConnection.onreconnecting(() => {
        console.log('📡 Notification hub reconnecting...');
        setConnectionStatus('reconnecting');
      });

      newConnection.onreconnected(() => {
        console.log('📡 Notification hub reconnected');
        setConnectionStatus('connected');
        // Re-subscribe after reconnection
        subscribeToNotifications(newConnection);
      });

      newConnection.onclose((error) => {
        console.log('📡 Notification hub connection closed:', error?.message || 'Unknown reason');
        setConnectionStatus('disconnected');
        
        // Only clear connection ref if this is the current connection
        if (connectionRef.current === newConnection) {
          connectionRef.current = null;
          setConnection(null);
        }
      });

      // Start connection
      console.log('🚀 Starting notification hub connection...');
      await newConnection.start();
      console.log('✅ Notification hub connection established');
      
      // Update state
      setConnectionStatus('connected');
      connectionRef.current = newConnection;
      setConnection(newConnection);

      // Subscribe to notifications for current user
      await subscribeToNotifications(newConnection);

    } catch (error) {
      console.error('❌ Notification hub connection error:', error);
      setConnectionStatus('error');
      
      // Clean up failed connection
      if (connectionRef.current) {
        connectionRef.current = null;
        setConnection(null);
      }
    }
  }, []); // Empty dependency array since we access current values from refs

  const subscribeToNotifications = async (conn) => {
    try {
      await conn.invoke('SubscribeToNotificationUpdates');
      console.log('Successfully subscribed to notification updates');
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
    }
  };

  const disconnectFromHub = useCallback(async () => {
    if (connectionRef.current) {
      try {
        await connectionRef.current.stop();
      } catch (error) {
        console.error('Error stopping SignalR connection:', error);
      }
      connectionRef.current = null;
      setConnection(null);
      setConnectionStatus('disconnected');
    }
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    console.log('🔄 markAsRead function called with ID:', notificationId);
    
    try {
      // Optimistically update the UI first
      console.log('🎨 Optimistically updating UI for notification:', notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );

      // Call the API to mark as read on the server
      const url = `${baseUrlRef.current}/notifications/${notificationId}/mark-read`;
      console.log('📡 Making API request to:', url);
      console.log('🔑 Using token:', tokenRef.current ? 'Token available' : 'No token');
      
      const headers = {
        Authorization: `Bearer ${tokenRef.current}`,
        'Content-Type': 'application/json'
      };
      
      const response = await axios.post(url, {}, { headers });

      console.log('✅ API response received:', response.status, response.data);
      console.log(`✅ Successfully marked notification ${notificationId} as read`);
    } catch (error) {
      console.error('❌ Failed to mark notification as read:', error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Revert the optimistic update on error
      console.log('⏪ Reverting optimistic update for notification:', notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: false }
            : notif
        )
      );
      
      // Re-throw the error so it can be caught by the calling function
      throw error;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      // First, check if there are any unread notifications BEFORE optimistic update
      const unreadNotifications = notifications.filter(notif => !notif.isRead);
      
      if (unreadNotifications.length === 0) {
        console.log('📝 No unread notifications to mark as read');
        return;
      }

      console.log(`📤 Marking all ${unreadNotifications.length} notifications as read...`);
      
      // Optimistically update UI AFTER we know we have unread notifications
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      
      // Call the bulk mark-read endpoint
      const url = `${baseUrlRef.current}/notifications/mark-read`;
      console.log('📡 Making API request to:', url);
      console.log('🔑 Using token:', tokenRef.current ? 'Token available' : 'No token');
      
      const headers = {
        Authorization: `Bearer ${tokenRef.current}`,
        'Content-Type': 'application/json'
      };
      
      console.log('🟡 About to make axios request');
      console.log('🟡 URL:', url);
      console.log('🟡 Headers:', headers);
      console.log('🟡 baseUrlRef.current:', baseUrlRef.current);
      console.log('🟡 tokenRef.current exists:', !!tokenRef.current);
      
      const response = await axios.post(url, {}, { headers });
      console.log('🟡 axios call completed successfully');
      console.log('✅ API response received:', response.status, response.data);
      console.log(`✅ Successfully marked all ${unreadNotifications.length} notifications as read`);
    } catch (error) {
      console.error('❌ Failed to mark all notifications as read:', error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: `${baseUrlRef.current}/notifications/mark-read`
      });
      
      // Revert the optimistic update on error - reload from server
      await loadInitialNotifications();
      
      // Re-throw the error so it can be caught by the calling function
      throw error;
    }
  }, [notifications, loadInitialNotifications]);

  const clearNotifications = useCallback(async () => {
    try {
      let previousNotifications = [];
      
      // Optimistically update the UI and store previous state
      setNotifications(prev => {
        previousNotifications = [...prev];
        return [];
      });

      // Call the API to clear notifications on the server
      const options = {
        url: `${baseUrlRef.current}/notifications/clear`,
        method: "POST",
        data: {},
        headers: {
          Authorization: `Bearer ${tokenRef.current}`,
          'Content-Type': 'application/json'
        },
      };
      await axios(options);

      console.log('✅ Cleared all notifications');
    } catch (error) {
      console.error('❌ Failed to clear notifications:', error);
      
      // Revert the optimistic update on error
      setNotifications(previousNotifications);
    }
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if (isNotificationSupported() && Notification.permission === 'default') {
      Notification.requestPermission().catch(error => {
        console.warn('Failed to request notification permission:', error);
      });
    }
  }, []);

  // Connect when component mounts and token is available
  useEffect(() => {
    let isMounted = true;

    const initializeConnection = async () => {
      if (token && userId && isMounted) {
        // First fetch notification preferences
        await fetchNotificationPreferences();
        
        // Load initial notifications
        await loadInitialNotifications();
        
        // Connect to chat hubs for message notifications
        if (isMounted) {
          await connectToChatHubs();
        }
        
        // Then connect to SignalR for real-time updates
        if (isMounted) {
          await connectToHub();
        }
      }
    };

    initializeConnection();

    // Cleanup on unmount or when dependencies change
    return () => {
      isMounted = false;
      if (connectionRef.current) {
        connectionRef.current.stop().catch(console.error);
        connectionRef.current = null;
      }
      // Cleanup chat connections
      if (chatConnectedRef.current) {
        chatService.disconnect().catch(console.error);
        setChatConnected(false);
        chatConnectedRef.current = false;
      }
    };
  }, [token, userId, connectToHub, loadInitialNotifications, fetchNotificationPreferences, connectToChatHubs]);

  return {
    connection,
    notifications,
    connectionStatus,
    unreadCount,
    isLoadingInitial,
    connectToHub,
    disconnectFromHub,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    // Chat-related exports
    chatConnected,
    notificationPreferences,
    connectToChatHubs
  };
};

export default useNotificationHub; 