import { HubConnectionBuilder } from '@microsoft/signalr';
import toast from 'react-hot-toast';
import axios from 'axios';

class GlobalNotificationService {
  constructor() {
    this.messagesConnection = null;
    this.conversationsConnection = null;
    this.isConnected = false;
    this._connectionInProgress = false;
    this.notificationPreferences = null;
    this.baseUrl = null;
    this.token = null;
    this.userId = null;
    
    // Event listeners
    this.newMessageListeners = [];
    this.newConversationListeners = [];
  }

  // Initialize the service with user credentials and preferences
  async initialize(baseUrl, token, userId) {
    console.log('🔔 Global notification service initialization started:', { baseUrl, userId });
    
    this.baseUrl = baseUrl;
    this.token = token;
    this.userId = userId;
    
    // Fetch notification preferences
    await this.fetchNotificationPreferences();
    
    // Start SignalR connections
    const connectionResult = await this.startConnections();
    
    console.log('🔔 Global notification service initialization completed:', { 
      success: connectionResult, 
      preferences: this.notificationPreferences 
    });
    
    return connectionResult;
  }

  // Fetch user notification preferences
  async fetchNotificationPreferences() {
    try {
      console.log('📋 Fetching notification preferences from:', `${this.baseUrl}/Accounts/notification-preferences`);
      console.log('📋 Using token:', this.token ? `${this.token.substring(0, 20)}...` : 'No token');
      
      const response = await axios.get(`${this.baseUrl}/Accounts/notification-preferences`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      this.notificationPreferences = response.data;
      console.log('📋 Notification preferences loaded:', this.notificationPreferences);
      console.log('📋 Message notifications enabled:', this.notificationPreferences?.message);
    } catch (error) {
      console.error('❌ Failed to fetch notification preferences:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      // Default to disabled if fetch fails
      this.notificationPreferences = {
        isEnabled: false,
        message: false
      };
    }
  }

  // Start SignalR connections
  async startConnections() {
    if (this.isConnected || this._connectionInProgress) {
      return this.isConnected;
    }

    this._connectionInProgress = true;

    try {
      // Create connections to both hubs
      const messagesHubUrl = `${this.baseUrl}/hubs/messages`;
      const conversationsHubUrl = `${this.baseUrl}/hubs/conversations`;

      // Messages hub connection
      this.messagesConnection = new HubConnectionBuilder()
        .withUrl(messagesHubUrl, {
          accessTokenFactory: () => this.token,
        })
        .withAutomaticReconnect()
        .build();

      // Conversations hub connection
      this.conversationsConnection = new HubConnectionBuilder()
        .withUrl(conversationsHubUrl, {
          accessTokenFactory: () => this.token,
        })
        .withAutomaticReconnect()
        .build();

      // Start both connections
      console.log('🌐 Starting global SignalR connections...');
      console.log('🌐 Messages hub URL:', messagesHubUrl);
      console.log('🌐 Conversations hub URL:', conversationsHubUrl);
      
      try {
        await Promise.all([
          this.messagesConnection.start(),
          this.conversationsConnection.start()
        ]);

        console.log('✅ Global SignalR connections established successfully');
      } catch (connectionError) {
        console.error('❌ SignalR connection error:', connectionError);
        throw connectionError;
      }
      
      // Subscribe to conversation updates
      try {
        await this.conversationsConnection.invoke('SubscribeToConversationUpdates');
        console.log('🧩 Subscribed to global conversation updates');
      } catch (subscriptionError) {
        console.error('⚠️ Failed to subscribe to global conversation updates:', subscriptionError);
      }

      // Set up event listeners
      this.setupEventListeners();
      
      this.isConnected = true;
      return true;

    } catch (error) {
      console.error('❌ Global SignalR connection failed:', error);
      this.isConnected = false;
      
      // Clean up failed connections
      if (this.messagesConnection) {
        try {
          await this.messagesConnection.stop();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      if (this.conversationsConnection) {
        try {
          await this.conversationsConnection.stop();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      
      return false;
    } finally {
      this._connectionInProgress = false;
    }
  }

  // Set up event listeners for notifications
  setupEventListeners() {
    try {
      console.log('🔧 Setting up global notification event listeners...');
      
      // New conversation listener
      this.conversationsConnection.on('NewConversation', (conversation) => {
        console.log('📥 Global: New conversation received:', conversation);
        this.handleNewConversation(conversation);
      });

      // New message listener
      this.messagesConnection.on('NewMessage', (message) => {
        console.log('📥 Global: New message received:', message);
        this.handleNewMessage(message);
      });

      console.log('✅ Global notification event listeners set up successfully');
    } catch (error) {
      console.error('❌ Error setting up global notification event listeners:', error);
    }
  }

  // Handle new conversation notification
  handleNewConversation(conversation) {
    console.log('🔔 Handling new conversation notification:', {
      conversation,
      preferences: this.notificationPreferences
    });
    
    // Check if message notifications are enabled
    if (!this.notificationPreferences?.isEnabled || !this.notificationPreferences?.message) {
      console.log('🔕 Message notifications disabled, skipping toast');
      return;
    }

    console.log('🔔 Message notifications enabled, showing toast');

    // Get conversation display name
    const conversationName = this.getConversationDisplayName(conversation);
    
    // Show toast notification
    toast.success(`New conversation: ${conversationName}`, {
      duration: 4000,
      position: 'top-right',
      icon: '💬'
    });

    // Notify listeners
    this.newConversationListeners.forEach(listener => listener(conversation));
  }

  // Handle new message notification
  handleNewMessage(message) {
    console.log('🔔 Handling new message notification:', {
      message,
      preferences: this.notificationPreferences,
      userId: this.userId
    });
    
    // Check if message notifications are enabled
    if (!this.notificationPreferences?.isEnabled || !this.notificationPreferences?.message) {
      console.log('🔕 Message notifications disabled, skipping toast');
      return;
    }

    // Don't show notification for own messages
    if (message.senderId === this.userId) {
      console.log('🔕 Own message, skipping toast');
      return;
    }

    console.log('🔔 Message notifications enabled, showing toast');

    // Get sender name
    const senderName = this.getSenderName(message);
    
    // Show toast notification
    toast.success(`New message from ${senderName}`, {
      duration: 4000,
      position: 'top-right',
      icon: '💬'
    });

    // Notify listeners
    this.newMessageListeners.forEach(listener => listener(message));
  }

  // Get conversation display name (similar to Chat component logic)
  getConversationDisplayName(conversation) {
    // For group conversations, use the conversation name
    if (conversation.isGroup) {
      return conversation.name;
    }
    
    // For 1-to-1 conversations, find the other user's name
    if (conversation.membersList && conversation.membersList.length === 2) {
      const otherUser = conversation.membersList.find(member => 
        member.id !== this.userId && member.email !== this.userId
      );
      
      if (otherUser) {
        // Return full name if available, otherwise use email
        if (otherUser.firstName && otherUser.lastName) {
          return `${otherUser.firstName} ${otherUser.lastName}`;
        } else if (otherUser.firstName) {
          return otherUser.firstName;
        } else if (otherUser.userName) {
          return otherUser.userName;
        } else {
          return otherUser.email;
        }
      }
    }
    
    // Fallback to conversation name
    return conversation.name;
  }

  // Get sender name for messages
  getSenderName(message) {
    // Return provided sender name if exists
    if (message.senderName) {
      return message.senderName;
    }
    
    // If this is current user
    if (message.senderId === this.userId) {
      return 'You';
    }
    
    // Fallback to partial senderId or Unknown
    return `User ${message.senderId?.substring(0, 8) || 'Unknown'}`;
  }

  // Add event listeners
  onNewMessage(callback) {
    this.newMessageListeners.push(callback);
  }

  onNewConversation(callback) {
    this.newConversationListeners.push(callback);
  }

  // Remove event listeners
  removeAllListeners() {
    this.newMessageListeners = [];
    this.newConversationListeners = [];
  }

  // Stop connections
  async stopConnections() {
    try {
      if (this._connectionInProgress) {
        console.log('⚠️ Connection in progress, skipping stop');
        return;
      }
      
      if (this.messagesConnection) {
        await this.messagesConnection.stop();
      }
      if (this.conversationsConnection) {
        await this.conversationsConnection.stop();
      }
      this.isConnected = false;
      console.log('🛑 Global SignalR connections stopped');
    } catch (error) {
      console.error('❌ Error stopping global SignalR connections:', error);
    }
  }

  // Check if connected
  isConnectionActive() {
    return this.isConnected;
  }

  // Get connection progress
  get connectionInProgress() {
    return this._connectionInProgress;
  }

  // Refresh notification preferences
  async refreshPreferences() {
    await this.fetchNotificationPreferences();
  }

  // Update token (for token refresh scenarios)
  async updateToken(newToken) {
    this.token = newToken;
    
    // Reinitialize connections with new token
    if (this.isConnected) {
      await this.stopConnections();
      await this.startConnections();
    }
  }

  // Test method to manually trigger a notification
  testNotification() {
    console.log('🧪 Testing notification service...');
    console.log('🧪 Current state:', {
      isConnected: this.isConnected,
      preferences: this.notificationPreferences,
      token: this.token ? 'Present' : 'Missing',
      userId: this.userId
    });
    
    // Test toast
    toast.success('Test notification from global service', {
      duration: 4000,
      position: 'top-right',
      icon: '🧪'
    });
  }
}

// Create singleton instance
const globalNotificationService = new GlobalNotificationService();

export default globalNotificationService; 