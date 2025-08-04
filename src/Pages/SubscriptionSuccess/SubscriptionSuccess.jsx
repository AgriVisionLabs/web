import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, CreditCard, Calendar, Crown } from 'lucide-react';
import { Helmet } from 'react-helmet';

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session_id = searchParams.get('session_id');
    if (session_id) {
      setSessionId(session_id);
    }
    setLoading(false);
  }, [searchParams]);

  const handleGoToSettings = () => {
    navigate('/settings');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E6930]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Subscription Success - Agrivision</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            {/* Success Icon */}
            <div className="mx-auto mb-6 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Thank you for subscribing to Agrivision. Your subscription has been activated successfully.
            </p>

            {/* Session Info */}
            {sessionId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <p className="text-sm text-gray-500 mb-2">Transaction ID:</p>
                <p className="text-sm font-mono text-gray-800 break-all">{sessionId}</p>
              </div>
            )}

            {/* Features Reminder */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
                <Crown className="w-5 h-5 text-[#1E6930] mr-2" />
                What's Next?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>Access advanced features</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>Unlimited AI-powered insights</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>Priority customer support</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>Advanced analytics dashboard</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGoToDashboard}
                className="bg-[#1E6930] hover:bg-[#1E6930]/90 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
              >
                Go to Dashboard
              </button>
              
              <button
                onClick={handleGoToSettings}
                className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                View Subscription
              </button>
            </div>

            {/* Support Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Need help? Contact our support team at{' '}
                <a 
                  href="mailto:support@agrivisionlabs.tech" 
                  className="text-[#1E6930] hover:underline"
                >
                  support@agrivisionlabs.tech
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess; 