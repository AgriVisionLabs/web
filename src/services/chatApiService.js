import axios from 'axios';

class ChatApiService {
  constructor() {
    this.baseUrl = null;
    this.token = null;
  }

  setConfig(baseUrl, token) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  // Conversation API methods
  async getConversations() {
    try {
      const response = await axios.get(`${this.baseUrl}/conversations`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  async getConversation(conversationId) {
    try {
      const response = await axios.get(`${this.baseUrl}/conversations/${conversationId}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  }

  async createConversation(data) {
    try {
      const response = await axios.post(`${this.baseUrl}/conversations`, data, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  async deleteConversation(conversationId) {
    try {
      await axios.delete(`${this.baseUrl}/conversations/${conversationId}`, {
        headers: this.getAuthHeaders()
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }

  async addMembersToConversation(conversationId, membersList) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/conversations/${conversationId}/members`,
        { membersList },
        {
          headers: this.getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding members to conversation:', error);
      throw error;
    }
  }

  async removeMemberFromConversation(conversationId, userId) {
    try {
      await axios.delete(
        `${this.baseUrl}/conversations/${conversationId}/members/${userId}`,
        {
          headers: this.getAuthHeaders()
        }
      );
    } catch (error) {
      console.error('Error removing member from conversation:', error);
      throw error;
    }
  }

  async promoteMemberToAdmin(conversationId, userId) {
    try {
      await axios.put(
        `${this.baseUrl}/conversations/${conversationId}/members/${userId}/admin`,
        {},
        {
          headers: this.getAuthHeaders()
        }
      );
    } catch (error) {
      console.error('Error promoting member to admin:', error);
      throw error;
    }
  }

  async clearConversation(conversationId) {
    try {
      await axios.post(
        `${this.baseUrl}/conversations/${conversationId}/clear`,
        {},
        {
          headers: this.getAuthHeaders()
        }
      );
    } catch (error) {
      console.error('Error clearing conversation:', error);
      throw error;
    }
  }

  // Message API methods
  async getMessages(conversationId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/conversations/${conversationId}/messages`,
        {
          headers: this.getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async sendMessage(conversationId, content) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/conversations/${conversationId}/messages`,
        { content },
        {
          headers: this.getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async deleteMessage(conversationId, messageId) {
    try {
      await axios.delete(
        `${this.baseUrl}/conversations/${conversationId}/messages/${messageId}`,
        {
          headers: this.getAuthHeaders()
        }
      );
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  async editMessage(conversationId, messageId, content) {
    try {
      const response = await axios.put(
        `${this.baseUrl}/conversations/${conversationId}/messages/${messageId}`,
        { content },
        {
          headers: this.getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  }
}

export const chatApiService = new ChatApiService(); 