import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, CreditCard } from 'lucide-react';
import { subscriptionService } from '../../services/subscriptionService';
import { userContext } from '../../Context/User.context';
import { AllContext } from '../../Context/All.context';

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const { token } = useContext(userContext);
  const { baseUrl } = useContext(AllContext);

  useEffect(() => {
    // Your backend webhook will handle the subscription confirmation
    // This page is just for user feedback
    console.log('Stripe session ID:', sessionId);
    
    // Simulate loading and then fetch updated subscription
    const timer = setTimeout(async () => {
      if (token) {
        try {
          const currentSub = await subscriptionService.getCurrentSubscription(token, baseUrl);
          setSubscription(currentSub);
        } catch (error) {
          console.error('Error fetching subscription:', error);
        }
      }
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [sessionId, token, baseUrl]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center font-manrope">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Processing your subscription...</h2>
          <p className="text-gray-600">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center font-manrope px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 animate-pulse" />
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded mx-auto"></div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful! 🎉
        </h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Thank you for subscribing to AgriVision! Your subscription is now active and you can start enjoying all the premium features.
        </p>

        {/* Subscription Details */}
        {subscription && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Subscription Details
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Plan:</span>
                <span className="font-medium text-gray-800">{subscription.planName || 'Advanced'}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span>Session ID:</span>
                <span className="font-mono text-xs">{sessionId?.substring(0, 20)}...</span>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-blue-800 mb-2">What's Next?</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• You will receive a confirmation email shortly</li>
            <li>• Access to premium features is now available</li>
            <li>• Explore your enhanced dashboard</li>
            <li>• Set up additional farms and fields</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoToDashboard}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 flex items-center justify-center"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
          
          <button
            onClick={handleGoToHome}
            className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </button>
        </div>

        {/* Support Note */}
        <p className="text-xs text-gray-500 mt-6">
          Having issues? Contact us at{' '}
          <a href="mailto:support@agrivisionlabs.tech" className="text-blue-600 hover:underline">
            support@agrivisionlabs.tech
          </a>
        </p>
      </div>
    </div>
  );
};

export default SubscriptionSuccess; 