import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

class ChatService {
  constructor() {
    this.messagesConnection = null;
    this.conversationsConnection = null;
    this.isConnected = false;
    this._connectionInProgress = false;
  }

  async startConnection(token, baseUrl) {
    // Prevent multiple connection attempts
    if (this.isConnected || this._connectionInProgress) {
      return this.isConnected;
    }

    this._connectionInProgress = true;

    try {
      // Create connections to both hubs
      const messagesHubUrl = `${baseUrl}/hubs/messages`;
      const conversationsHubUrl = `${baseUrl}/hubs/conversations`;

      // Messages hub connection
      this.messagesConnection = new HubConnectionBuilder()
        .withUrl(messagesHubUrl, {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .build();

      // Conversations hub connection
      this.conversationsConnection = new HubConnectionBuilder()
        .withUrl(conversationsHubUrl, {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .build();

      // Start both connections
      console.log('Starting SignalR connections...');
      await Promise.all([
        this.messagesConnection.start(),
        this.conversationsConnection.start()
      ]);

      console.log('✅ SignalR connections established successfully');
      
        // Subscribe to conversation updates
      try {
        await this.conversationsConnection.invoke('SubscribeToConversationUpdates');
        console.log('🧩 Subscribed to conversation updates');
      } catch (subscriptionError) {
        console.error('⚠️ Failed to subscribe to conversation updates:', subscriptionError);
      }
      
      this.isConnected = true;
      return true;

    } catch (error) {
      console.error('❌ SignalR connection failed:', error);
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

  async stopConnection() {
    try {
      // Don't stop if connection is in progress
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
      console.log('🔌 SignalR connection stopped');
    } catch (error) {
      console.error('Error stopping connection:', error);
    }
  }

  async subscribeToConversation(conversationId) {
    if (this.messagesConnection && this.isConnected) {
      try {
        await this.messagesConnection.invoke('SubscribeToConversations', conversationId);
        console.log(`📝 Subscribed to conversation messages: ${conversationId}`);
      } catch (error) {
        console.error('Error subscribing to conversation:', error);
      }
    }
  }

  async unsubscribeFromConversation(conversationId) {
    if (this.messagesConnection && this.isConnected) {
      try {
        await this.messagesConnection.invoke('UnsubscribeFromConversations', conversationId);
        console.log(`📝 Unsubscribed from conversation messages: ${conversationId}`);
      } catch (error) {
        console.error('Error unsubscribing from conversation:', error);
      }
    }
  }

  // Event listeners for conversations
  onNewConversation(callback) {
    if (this.conversationsConnection) {
      this.conversationsConnection.on('NewConversation', callback);
    }
  }

  onConversationUpdated(callback) {
    if (this.conversationsConnection) {
      this.conversationsConnection.on('ConversationUpdated', callback);
    }
  }

  onConversationRemoved(callback) {
    if (this.conversationsConnection) {
      this.conversationsConnection.on('ConversationRemoved', callback);
    }
  }

  // Event listeners for messages
  onNewMessage(callback) {
    if (this.messagesConnection) {
      this.messagesConnection.on('ReceiveMessage', callback);
    }
  }

  onMessageDeleted(callback) {
    if (this.messagesConnection) {
      this.messagesConnection.on('MessageDeleted', callback);
    }
  }

  onMessageEdited(callback) {
    if (this.messagesConnection) {
      this.messagesConnection.on('MessageEdited', callback);
    }
  }

  // Remove event listeners
  removeAllListeners() {
    if (this.messagesConnection) {
      this.messagesConnection.off('ReceiveMessage');
      this.messagesConnection.off('MessageDeleted');
      this.messagesConnection.off('MessageEdited');
    }
    if (this.conversationsConnection) {
      this.conversationsConnection.off('NewConversation');
      this.conversationsConnection.off('ConversationUpdated');
      this.conversationsConnection.off('ConversationRemoved');
    }
  }

  // Disconnect from both hubs
  async disconnect() {
    try {
      console.log('🔌 Disconnecting from chat hubs...');
      
      const disconnectPromises = [];
      
      if (this.messagesConnection) {
        disconnectPromises.push(this.messagesConnection.stop());
      }
      
      if (this.conversationsConnection) {
        disconnectPromises.push(this.conversationsConnection.stop());
      }
      
      await Promise.all(disconnectPromises);
      
      this.messagesConnection = null;
      this.conversationsConnection = null;
      this.isConnected = false;
      this._connectionInProgress = false;
      
      console.log('✅ Successfully disconnected from chat hubs');
    } catch (error) {
      console.error('❌ Error disconnecting from chat hubs:', error);
      // Reset state anyway
      this.messagesConnection = null;
      this.conversationsConnection = null;
      this.isConnected = false;
      this._connectionInProgress = false;
    }
  }

  // Connection status
  isConnectionActive() {
    return this.isConnected && this.messagesConnection?.state === 'Connected' && this.conversationsConnection?.state === 'Connected';
  }

  // Check if connection is in progress
  get connectionInProgress() {
    return this._connectionInProgress;
  }
}

export const chatService = new ChatService(); 