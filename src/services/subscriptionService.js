import axios from 'axios';

export const subscriptionService = {
  // Create subscription checkout session
  createSubscription: async (planId, baseUrl) => {
    const apiUrl = baseUrl || 'https://api.agrivisionlabs.tech';
    
    // Get token to verify it exists
    const token = localStorage.getItem('token');
    console.log('Token available:', !!token);
    console.log('Token (first 20 chars):', token?.substring(0, 20) + '...');
    
    const requestBody = {
      planId: "9D3ACBBE-7C8C-4AED-9C72-F8E8057C1AC1"
    };
    
    console.log('Request URL:', `${apiUrl}/Subscriptions`);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    try {
      const response = await axios.post(`${apiUrl}/Subscriptions`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Subscription API Error:', error);
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      console.error('Request headers that were sent:', error.config?.headers);
      throw error;
    }
  },
  
  // Get user's current subscription status
  getCurrentSubscription: async (baseUrl) => {
    const apiUrl = baseUrl || 'https://api.agrivisionlabs.tech';
    try {
      const response = await axios.get(`${apiUrl}/Subscriptions`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // No subscription found
      }
      throw error;
    }
  },

  // Create customer portal session for managing subscription
  createCustomerPortalSession: async (baseUrl) => {
    const apiUrl = baseUrl || 'https://api.agrivisionlabs.tech';
    
    const token = localStorage.getItem('token');
    console.log('Creating customer portal session...');
    
    try {
      const response = await axios.post(`${apiUrl}/Subscriptions/portal`, {}, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      
      console.log('Portal session response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Portal session API Error:', error);
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      throw error;
    }
  },

  // Cancel subscription
  cancelSubscription: async (baseUrl) => {
    const apiUrl = baseUrl || 'https://api.agrivisionlabs.tech';
    
    const token = localStorage.getItem('token');
    console.log('Cancelling subscription...');
    
    try {
      const response = await axios.post(`${apiUrl}/Subscriptions/cancel`, {}, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      
      console.log('Cancel subscription response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Cancel subscription API Error:', error);
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      throw error;
    }
  }
}; 