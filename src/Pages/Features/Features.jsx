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
  ChartColumn
} from 'lucide-react';
import { footerFeatures, footerSupport } from "../Landing/data";
import LandingNavBar from "../../Components/Navbar/LandingNavBar";

const FeaturesPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const mainFeatures = [
    {
      id: 0,
      title: "AI Disease Detection",
      subtitle: "95% accuracy across 14 crops",
      description: "Advanced computer vision technology that identifies crop diseases, pests, and nutrient deficiencies using dual AI models for both images and videos.",
      icon: Bug,
      color: "from-red-500 to-red-600",
      benefits: [
        "Early detection prevents crop loss",
        "Supports 14 crops with 38 disease classes",
        "Dual model system for images and videos",
        "Treatment recommendations included"
      ],
      techSpecs: [
        "Two specialized models trained on 60,000+ images",
        "Image analysis: Almost instant detection",
        "Video analysis: ~1 minute processing time",
        "95% accuracy rate across all supported crops"
      ]
    },
    {
      id: 1,
      title: "Smart Irrigation",
      subtitle: "40% water reduction guaranteed",
      description: "Intelligent water management system that optimizes irrigation schedules based on soil moisture.",
      icon: Droplets,
      color: "from-blue-500 to-blue-600",
      benefits: [
        "Reduces water usage by up to 40%",
        "Prevents over/under watering",
        "Automated scheduling",
        "Remote control via mobile app"
      ],
      techSpecs: [
        "IoT soil moisture sensors",
        "Weather API integration",
        "Compatible with existing irrigation systems"
      ]
    },
    {
      id: 2,
      title: "Reports & Analytics",
      subtitle: "Data-driven insights",
      description: "Comprehensive analytics dashboard that generates detailed reports and insights based on your farm activities, user inputs, and system actions.",
      icon: BarChart3,
      color: "from-green-500 to-green-600",
      benefits: [
        "Detailed activity reports",
        "User input analysis",
        "System action tracking",
        "Data visualization charts",
        "Performance monitoring"
      ],
      techSpecs: [
        "Real-time data processing",
        "Custom report generation",
        "Interactive dashboard",
        "Export capabilities"
      ]
    },
    {
      id: 3,
      title: "Mobile Command Center",
      subtitle: "Farm management anywhere",
      description: "Complete mobile management platform that puts your entire farm operation in your pocket with real-time monitoring and control.",
      icon: Smartphone,
      color: "from-purple-500 to-purple-600",
      benefits: [
        "Monitor farms from anywhere",
        "Real-time alerts and notifications",
        "Remote device control",
        "Offline functionality",
        "Team collaboration tools"
      ],
      techSpecs: [
        "iOS and Android apps",
        "Offline synchronization",
        "Push notifications"
      ]
    }
  ];



  const additionalFeatures = [
    {
      icon: Sprout,
      title: "Crop Selection",
      description: "Choose the right crop at the right time – no guesswork, just data."
    },
    {
      icon: Droplet,
      title: "Smart Irrigation",
      description: "Connect field devices to remotely control and monitor irrigation units in real time."
    },
    {
      icon: Bug,
      title: "Disease Detection",
      description: "AI models detect signs of disease from images and video data."
    },
    {
      icon: UsersRound,
      title: "Multi-Tenant",
      description: "Seamlessly manage multiple farms under one account with robust tenant separation."
    },
    {
      icon: Cpu,
      title: "Sensor Integration",
      description: "Real-time monitoring of soil moisture, temperature, and environmental data."
    },
    {
      icon: ClipboardCheck,
      title: "Task Management",
      description: "Stay ahead of the season with streamlined task scheduling – no confusion, just coordination."
    },
    {
      icon: Archive,
      title: "Inventory Logging",
      description: "Record actual harvest and compare against forecasts."
    },
    {
      icon: ChartColumn,
      title: "Reports & Analytics",
      description: "Generate detailed reports and gain actionable insights with ease."
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

              <button className="bg-[#1E6930] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0F4A1A] transition-all flex items-center space-x-2">
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