import { useState, useEffect, useContext } from "react";
import { Check, Crown, Star, Users, X, Calendar, Clock, AlertCircle } from "lucide-react";
import { subscriptionService } from "../../services/subscriptionService";
import { userContext } from "../../Context/User.context";
import { AllContext } from "../../Context/All.context";
import toast from "react-hot-toast";

const SubscriptionPlans = () => {
  const [plans] = useState([
    {
      id: "basic-plan",
      name: "Basic",
      price: "Free",
      currency: "EGP",
      maxFarms: 1,
      maxFields: 3,
      unlimitedAiFeatureUsage: false,
      isActive: true,
      icon: Users,
      description: "Perfect for getting started",
      availableFarmers: ["1 farm", "Up to 3 fields"],
      features: [
        "Access to the dashboard for farm and field management",
        "Basic soil health and weather insights",
        "AI-powered disease detection for limited usage",
        "Email support",
      ],
    },
    {
      id: "advanced-plan",
      name: "Advanced",
      price: "499.99 EGP/month",
      currency: "EGP",
      maxFarms: 3,
      maxFields: 5,
      unlimitedAiFeatureUsage: true,
      isActive: true,
      icon: Crown,
      description: "Best for growing operations",
      availableFarmers: ["3 farms", "Up to 5 fields"],
      features: [
        "Everything in Basic plan",
        "Advanced sensor monitoring",
        "Unlimited AI features",
        "Disease detection",
        "Automated irrigation",
        "Priority support",
        "Analytics dashboard",
      ],
      popular: true,
    },
    {
      id: "custom-plan",
      name: "Enterprise",
      price: "Custom",
      currency: "EGP",
      maxFarms: 999,
      maxFields: 999,
      unlimitedAiFeatureUsage: true,
      isActive: true,
      icon: Star,
      description: "For large scale operations",
      availableFarmers: ["Unlimited farms", "Unlimited fields"],
      features: [
        "Everything in Advanced plan",
        "Custom integrations",
        "Advanced analytics",
        "Dedicated support",
        "API access",
        "White-label options",
      ],
    },
  ]);

  // const [loading, setLoading] = useState(false);
  const [processingPlan, setProcessingPlan] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [showManagePopup, setShowManagePopup] = useState(false);

  const { token } = useContext(userContext);
  const { baseUrl } = useContext(AllContext);

  useEffect(() => {
    fetchCurrentSubscription();
  }, [token]);

  const fetchCurrentSubscription = async () => {
    if (!token) return;

    try {
      const subscription = await subscriptionService.getCurrentSubscription(
        baseUrl
      );
      setCurrentSubscription(subscription);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      if (error.response?.status === 401) {
        // Token expired, clear storage and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }
  };

  const handleSubscribe = async (planId) => {
    if (!token) {
      toast.error("Please log in to subscribe");
      return;
    }

    if (planId === "basic-plan") {
      toast.info("You are already on the Basic plan");
      return;
    }

    // Handle "Manage Plan" for Advanced plan
    if (planId === "advanced-plan" && isCurrentPlan(planId)) {
      // Show subscription details popup
      setShowManagePopup(true);
      return;
    }

    if (planId === "custom-plan") {
      toast.info("Please contact support for custom plans");
      return;
    }

    try {
      setProcessingPlan(planId);
      toast.loading("Creating checkout session...", { id: "checkout" });

      // Call your backend to create Stripe checkout session
      const response = await subscriptionService.createSubscription(
        planId,
        baseUrl
      );

      toast.dismiss("checkout");

      if (response.checkOutSession_URL) {
        // Redirect to Stripe checkout
        window.location.href = response.checkOutSession_URL;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.dismiss("checkout");

      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        // Clear local storage and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else if (error?.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0]?.[0];
        toast.error(firstError || "Failed to create subscription");
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create subscription. Please try again.");
      }
    } finally {
      setProcessingPlan(null);
    }
  };

  const isCurrentPlan = (planId) => {
    if (!currentSubscription) return planId === "basic-plan";
    
    // First check the planName to determine current plan
    if (currentSubscription.planName) {
      const planName = currentSubscription.planName.toLowerCase();
      const targetPlan = planId.replace("-plan", "").toLowerCase();
      
      // Direct plan name match
      if (planName === targetPlan) {
        return true;
      }
    }
    
    // Fallback: Check subscription status for edge cases
    // Status 2 = expired, so user falls back to basic
    if (currentSubscription.status === 2) {
      return planId === "basic-plan";
    }
    
    return false;
  };

  const getButtonText = (plan) => {
    if (isCurrentPlan(plan.id)) {
      // For Advanced plan, show "Manage Plan" instead of "Current Plan"
      if (plan.id === "advanced-plan") return "Manage Plan";
      return "Current Plan";
    }
    if (plan.id === "custom-plan") return "Contact Sales";
    return "Get Started";
  };

  const getButtonStyle = (plan) => {
    if (isCurrentPlan(plan.id)) {
      // For Advanced plan, make it clickable with green style
      if (plan.id === "advanced-plan") return "bg-[#1E6930] hover:bg-[#1E6930]/90";
      return "bg-gray-400 cursor-not-allowed";
    }
    
    // Disable Basic plan if Advanced subscription is not expired
    if (plan.id === "basic-plan" && currentSubscription && currentSubscription.status !== 2) {
      return "bg-gray-400 cursor-not-allowed";
    }
    
    if (plan.id === "custom-plan") return "bg-[#111827]";
    return "bg-[#1E6930] hover:bg-[#1E6930]/90";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSubscriptionStatus = () => {
    if (!currentSubscription) return { status: "No Subscription", color: "text-gray-500" };
    
    // Handle numeric status values: 0 = active, 1 = cancelled, 2 = expired
    if (currentSubscription.status === 0) {
      return { status: "Active", color: "text-green-500" };
    }
    
    if (currentSubscription.status === 1) {
      return { status: "Cancelled", color: "text-red-500" };
    }
    
    if (currentSubscription.status === 2) {
      return { status: "Expired", color: "text-red-500" };
    }
    
    // Fallback for string values
    if (currentSubscription.status === "cancelled" || currentSubscription.status === "canceled") {
      return { status: "Cancelled", color: "text-red-500" };
    }
    
    return { status: "Active", color: "text-green-500" };
  };

  const handleCancelSubscription = async () => {
    try {
      toast.loading("Cancelling your subscription...", { id: "cancel" });
      
      const response = await subscriptionService.cancelSubscription(baseUrl);
      
      toast.dismiss("cancel");
      toast.success("Subscription cancelled successfully");
      
      // Refresh subscription data
      await fetchCurrentSubscription();
      setShowManagePopup(false);
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.dismiss("cancel");
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to cancel subscription. Please try again.");
      }
    }
  };

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600">
          Select the perfect plan for your farming needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`
              flex flex-col justify-between
              bg-white rounded-2xl px-6 py-8 
              shadow-[0px_1px_10px_0px_#00000040] 
              ${
                plan.popular
                  ? "xl:min-h-[660px] border-2 border-[#1E6930] relative"
                  : "border border-[#D2E1D6]"
              }
            `}
          >
            {plan.popular && (
              <span className="absolute -top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-[#1E6930] py-2 px-4 rounded-full text-sm font-semibold text-white">
                Most Popular
              </span>
            )}

            <div className="space-y-6 flex-1">
              <h3 className="text-2xl font-bold text-center">{plan.name}</h3>
              <span className="text-3xl font-bold text-[#1E6930] block text-center">
                {plan.price}
              </span>
              <p className="text-base font-medium text-[#4B5563] text-center">
                {plan.description}
              </p>

              <div className="space-y-4">
                {plan.availableFarmers.map((item) => (
                  <p key={item} className="flex items-center">
                    <Check className="text-[#1E6930] mr-2" />
                    {item}
                  </p>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="text-base font-semibold">Features:</h4>
                {plan.features.map((feature) => (
                  <p key={feature} className="flex items-center space-x-2">
                    <Check className="text-[#1E6930] min-w-7 min-h-5" />
                    <span>{feature}</span>
                  </p>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSubscribe(plan.id, plan.name)}
              disabled={
                processingPlan === plan.id || 
                (isCurrentPlan(plan.id) && plan.id !== "advanced-plan") ||
                (plan.id === "basic-plan" && currentSubscription && currentSubscription.status !== 2)
              }
              className={`
                ${getButtonStyle(plan)}
                h-[45px] px-10 text-lg mx-auto w-full mt-10
                text-white font-medium rounded-lg
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {processingPlan === plan.id ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                getButtonText(plan)
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Subscription Management Popup */}
      {showManagePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Subscription Details</h3>
              <button
                onClick={() => setShowManagePopup(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Subscription Info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(currentSubscription?.startDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(currentSubscription?.endDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className={`font-medium ${getSubscriptionStatus().color}`}>
                    {getSubscriptionStatus().status}
                  </p>
                </div>
              </div>

              {currentSubscription?.planName && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Current Plan</p>
                  <p className="font-medium text-gray-900">{currentSubscription.planName}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowManagePopup(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {getSubscriptionStatus().status === "Active" && (
                <button
                  onClick={handleCancelSubscription}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
