import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, CreditCard, RefreshCw, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet';

const SubscriptionFailure = () => {
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

  const handleTryAgain = () => {
    navigate('/settings');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleContactSupport = () => {
    window.open('mailto:support@agrivisionlabs.tech?subject=Subscription Payment Issue', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Subscription Failed - Agrivision</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Failure Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            {/* Failure Icon */}
            <div className="mx-auto mb-6 w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>

            {/* Failure Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Failed
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              We're sorry, but your payment could not be processed. Don't worry, no charges were made to your account.
            </p>

            {/* Session Info */}
            {sessionId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <p className="text-sm text-gray-500 mb-2">Session ID:</p>
                <p className="text-sm font-mono text-gray-800 break-all">{sessionId}</p>
              </div>
            )}

            {/* Common Reasons */}
            <div className="bg-red-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                Common Reasons for Payment Failure
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-left">
                <div className="flex items-start">
                  <XCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                  <span>Insufficient funds</span>
                </div>
                <div className="flex items-start">
                  <XCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                  <span>Expired credit card</span>
                </div>
                <div className="flex items-start">
                  <XCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                  <span>Incorrect card details</span>
                </div>
                <div className="flex items-start">
                  <XCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                  <span>Bank declined the transaction</span>
                </div>
                <div className="flex items-start">
                  <XCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                  <span>Payment was cancelled</span>
                </div>
                <div className="flex items-start">
                  <XCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                  <span>Technical issues</span>
                </div>
              </div>
            </div>

            {/* What to do next */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What can you do?
              </h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p>• Check your card details and try again</p>
                <p>• Contact your bank if the card should be working</p>
                <p>• Try using a different payment method</p>
                <p>• Contact our support team if the issue persists</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleTryAgain}
                className="bg-[#1E6930] hover:bg-[#1E6930]/90 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
              
              <button
                onClick={handleContactSupport}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Contact Support
              </button>
              
              <button
                onClick={handleGoToDashboard}
                className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go to Dashboard
              </button>
            </div>

            {/* Support Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Need immediate help? Contact our support team at{' '}
                <a 
                  href="mailto:support@agrivisionlabs.tech" 
                  className="text-[#1E6930] hover:underline"
                >
                  support@agrivisionlabs.tech
                </a>
                {' '}or call us at{' '}
                <a 
                  href="tel:+971-XXX-XXXX" 
                  className="text-[#1E6930] hover:underline"
                >
                  +971-XXX-XXXX
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionFailure; 