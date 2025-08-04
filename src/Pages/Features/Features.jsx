import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../Components/ui/Button';
import { 
  Bug, 
  Droplets, 
  BarChart3, 
  Smartphone, 
  Check, 
  Play, 
  Sprout, 
  Wifi, 
  Database, 
  Shield, 
  Zap,
  Leaf,
  TrendingUp,
  MapPin,
  Clock,
  Users,
  Globe,
  CheckCircle,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  Droplet,
  UsersRound,
  Cpu,
  ClipboardCheck,
  Archive,
  ChartColumn,
  User,
  CreditCard,
  X
} from 'lucide-react';
import { footerFeatures, footerSupport } from "../Landing/data";
import LandingNavBar from "../../Components/Navbar/LandingNavBar";

const FeaturesPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openVideoModal = (videoUrl) => {
    setCurrentVideoUrl(videoUrl);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setCurrentVideoUrl('');
  };

  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isVideoModalOpen) {
        closeVideoModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVideoModalOpen]);

  const mainFeatures = [
    {
      id: 0,
      title: "Farm Profiles",
      subtitle: "Complete farm management system",
      description: "Comprehensive farm profile management allowing you to create, edit, and organize multiple farms with detailed information and weather forecasting.",
      icon: User,
      color: "from-green-500 to-green-600",
      videoUrl: "https://api.agrivisionlabs.tech/uploads/farm_profile.mp4",
      benefits: [
        "Create and manage multiple farm profiles",
        "Weather forecast based on location",
        "Detailed farm information storage",
        "Easy switching between farms"
      ],
      techSpecs: [
        "Multi-farm support",
        "Location-based weather integration",
        "Custom farm details",
        "Weather forecasting system"
      ]
    },
    {
      id: 1,
      title: "Subscription",
      subtitle: "Flexible pricing plans",
      description: "Comprehensive subscription management with multiple pricing tiers to fit farms of all sizes and requirements.",
      icon: CreditCard,
      color: "from-blue-500 to-blue-600",
      videoUrl: "https://api.agrivisionlabs.tech/uploads/subscription.mp4",
      benefits: [
        "Multiple subscription tiers",
        "Secure payment processing",
        "Easy plan upgrades/downgrades",
        "Transparent pricing"
      ],
      techSpecs: [
        "Stripe payment integration",
        "Monthly/yearly billing",
        "Plan comparison tools",
        "Automated billing management"
      ]
    },
    {
      id: 2,
      title: "Irrigation Control",
      subtitle: "Smart water management",
      description: "Advanced irrigation control system that allows remote monitoring and control of irrigation units with smart scheduling and automation.",
      icon: Droplets,
      color: "from-cyan-500 to-cyan-600",
      videoUrl: "https://api.agrivisionlabs.tech/uploads/irrigation_control.mp4",
      benefits: [
        "Remote irrigation control",
        "Smart scheduling system",
        "Water usage optimization",
        "Real-time monitoring"
      ],
      techSpecs: [
        "IoT device integration",
        "Mobile app control",
        "Automated scheduling",
        "Usage analytics"
      ]
    },
    {
      id: 3,
      title: "Sensors & Devices",
      subtitle: "IoT monitoring network",
      description: "Comprehensive sensor and device management system for monitoring soil conditions, weather data, and environmental factors.",
      icon: Cpu,
      color: "from-purple-500 to-purple-600",
      videoUrl: "https://api.agrivisionlabs.tech/uploads/sensors_devices.mp4",
      benefits: [
        "Real-time sensor monitoring",
        "Device health tracking",
        "Environmental data collection",
        "Alert notifications"
      ],
      techSpecs: [
        "Multiple sensor types",
        "Wireless connectivity",
        "Battery monitoring",
        "Data visualization"
      ]
    },
    {
      id: 4,
      title: "Disease Detection",
      subtitle: "AI-powered diagnostics",
      description: "Advanced AI disease detection system that identifies crop diseases, pests, and nutrient deficiencies from images and videos.",
      icon: Bug,
      color: "from-red-500 to-red-600",
      videoUrl: "https://api.agrivisionlabs.tech/uploads/disease_detection.mp4",
      benefits: [
        "AI-powered disease identification",
        "Early detection capabilities",
        "Treatment recommendations",
        "Image and video analysis"
      ],
      techSpecs: [
        "95% accuracy rate",
        "14 crop types supported",
        "Dual AI models",
        "Instant results"
      ]
    }
  ];



  const additionalFeatures = [
    {
      icon: User,
      title: "Farm Profiles",
      description: "Create and manage comprehensive farm profiles with weather forecasting and detailed information."
    },
    {
      icon: CreditCard,
      title: "Subscription Management",
      description: "Flexible pricing plans with secure payment processing and easy plan management."
    },
    {
      icon: Droplets,
      title: "Irrigation Control",
      description: "Smart irrigation control with remote monitoring and automated scheduling systems."
    },
    {
      icon: Cpu,
      title: "Sensors & Devices",
      description: "Real-time monitoring of soil moisture, temperature, and environmental data through IoT sensors."
    },
    {
      icon: Bug,
      title: "Disease Detection",
      description: "AI-powered disease identification from images and videos with treatment recommendations."
    },
    {
      icon: ClipboardCheck,
      title: "Task Management",
      description: "Stay ahead of the season with streamlined task scheduling and team coordination."
    },
    {
      icon: Archive,
      title: "Inventory Management",
      description: "Comprehensive inventory tracking with harvest logging and forecasting capabilities."
    },
    {
      icon: ChartColumn,
      title: "Analytics & Reports",
      description: "Generate detailed reports and gain actionable insights with advanced data visualization."
    }
  ];

  const integrationFeatures = [
    {
      icon: Wifi,
      title: "IoT Sensor Network",
      description: "Connect soil moisture, temperature, and humidity sensors for real-time field monitoring.",
      specs: ["Wireless connectivity", "30-day rechargeable battery", "Soil moisture monitoring", "Temperature & humidity tracking"]
    },
    {
      icon: Smartphone,
      title: "Cross-Platform Mobile Access",
      description: "Unified mobile experience across iOS and Android devices with seamless data synchronization.",
      specs: ["Native iOS & Android apps", "Offline data access", "Real-time notifications", "Cloud synchronization"]
    },
    {
      icon: BarChart3,
      title: "Advanced Reporting System",
      description: "Generate comprehensive reports and analytics based on your farming activities and operational data.",
      specs: ["Custom report generation", "Activity tracking", "Performance metrics", "Data visualization"]
    },
    {
      icon: Users,
      title: "Multi-Farm Management",
      description: "Efficiently manage multiple farms and fields under a single account with organized data separation.",
      specs: ["Multiple farm support", "Field organization", "Tenant separation", "Centralized dashboard"]
    }
  ];

  const activeFeatureData = mainFeatures[activeFeature];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <LandingNavBar alwaysSolid />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Features That{' '}
            <span className="text-[#1E6930]">Transform Farming</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Cutting-edge technology that revolutionizes farm management with AI-powered insights, 
            automated systems, and data-driven decisions for the modern farmer.
          </p>
        </div>
      </section>

      {/* Interactive Feature Showcase */}
      <section className="pb-10 pt-2 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Feature Cards */}
            <div className="space-y-6">
              {mainFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                const isActive = activeFeature === index;
                
                return (
                  <div
                    key={feature.id}
                    onClick={() => setActiveFeature(index)}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      isActive
                        ? 'bg-[#E8F0EA] text-[#35473D] border-transparent shadow-xl'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        isActive ? 'bg-[#1E6930]/10' : 'bg-gray-100'
                      }`}>
                        <IconComponent className={`h-8 w-8 ${
                          isActive ? 'text-[#1E6930]' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{feature.title}</h3>
                        <p className={`text-sm ${
                          isActive ? 'text-[#35473D]' : 'text-gray-500'
                        }`}>
                          {feature.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column - Dynamic Feature Details */}
            <div className="bg-[#E8F0EA] p-8 rounded-3xl text-[#35473D]">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2 text-[#35473D]">{activeFeatureData.title}</h2>
                <p className="text-lg text-[#35473D] font-medium mb-4">{activeFeatureData.subtitle}</p>
                <p className="text-lg text-[#35473D] leading-relaxed">
                  {activeFeatureData.description}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-[#35473D]">Key Benefits</h3>
                <div className="space-y-3">
                  {activeFeatureData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-[#1E6930]" />
                      <span className="text-[#35473D]">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-[#35473D]">Technical Specifications</h3>
                <div className="space-y-2">
                  {activeFeatureData.techSpecs.map((spec, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#1E6930] rounded-full"></div>
                      <span className="text-[#35473D]">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => openVideoModal(activeFeatureData.videoUrl)}
                className="bg-[#1E6930] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0F4A1A] transition-all flex items-center space-x-2 w-fit"
              >
                <Play className="h-5 w-5" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
        </div>
      </section>



      {/* Additional Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-bold text-gray-900 mb-4">Complete Farm Management</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to run a modern, efficient farm operation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <div className="bg-[#E8F0EA] p-4 rounded-xl inline-block mb-4">
                    <IconComponent className="h-8 w-8 text-[#1E6930]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enterprise Integrations Section */}
      <section className="py-20 bg-gradient-to-r from-[#1E6930] to-[#0F4A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-bold text-white mb-4">Advanced Platform Features</h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Comprehensive capabilities that power your agricultural operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {integrationFeatures.map((integration, index) => {
              const IconComponent = integration.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/20 transition-all duration-300"
                >
                  <div className="bg-white/20 p-4 rounded-xl inline-block mb-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{integration.title}</h3>
                  <p className="text-green-100 mb-4">{integration.description}</p>
                  <div className="space-y-2">
                    {integration.specs.map((spec, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-300" />
                        <span className="text-green-100 text-sm">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join farmers who are transforming their operations with Agrivision
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                                    <Link to="/signUp" className="bg-[#1E6930] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#1E6930]/90 transition-all shadow-lg text-center">
              Start for Free
            </Link>
            <Link to="/pricing" className="border-2 border-[#1E6930] text-[#1E6930] px-8 py-4 rounded-full font-semibold hover:bg-[#1E6930] hover:text-white transition-all text-center">
              Pricing
            </Link>
          </div>
          <p className="text-gray-500 text-sm text-center">
            30-day money-back guarantee • Cancel anytime
          </p>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={closeVideoModal}
        >
          <div className="relative w-full max-w-4xl mx-auto">
            <button
              onClick={closeVideoModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div 
              className="bg-black rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={currentVideoUrl}
                controls
                autoPlay
                className="w-full h-auto max-h-[70vh] object-contain"
                onError={(e) => {
                  console.error('Video failed to load:', e);
                }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] py-10 px-5">
        <div className="lg:w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <section className="space-y-3">
            <img src="/blackLogo.png" className="w-24 h-8" />
            <p className="text-sm font-medium text-[#4B5563] flex-1">
              We aim to be your primary partner in boosting your agricultural
              efficiency.
            </p>
          </section>
          <section className="space-y-3">
            <h4 className="text-base font-semibold capitalize">features</h4>
            {footerFeatures.map((link) => (
              <a
                key={link.title}
                href={link.href}
                className="text-sm font-medium text-[#4B5563] block"
              >
                {link.title}
              </a>
            ))}
          </section>
          <section className="space-y-3">
            <h4 className="text-base font-semibold capitalize">support</h4>
            {footerSupport.map((link) => (
              <a
                key={link.title}
                href={link.href}
                className="text-sm font-medium text-[#4B5563] block"
              >
                {link.title}
              </a>
            ))}
          </section>
          <section className="space-y-3">
            <h4 className="text-base font-semibold capitalize">contact us</h4>
            <a
              href="/"
              className="text-sm font-medium text-[#4B5563] flex items-center"
            >
              <Phone className="text-[#4B5563] mr-2" size={15} />
              +20 155 555 5555
            </a>
            <a
              href=""
              className="text-sm font-medium text-[#4B5563] flex items-center"
            >
              <Mail className="text-[#4B5563] mr-2" size={15} />
              contact@agrivisionlabs.tech
            </a>

            <div className="flex items-center space-x-2">
              <Facebook className="text-[#4B5563]" size={20} />
              <Twitter className="text-[#4B5563]" size={20} />
              <Instagram className="text-[#4B5563]" size={20} />
            </div>
          </section>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage; 