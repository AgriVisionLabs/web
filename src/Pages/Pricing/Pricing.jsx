import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../Components/ui/Button';
import { 
  Check, 
  ChevronDown, 
  ChevronUp,
  Shield,
  Users,
  Headphones,
  Star,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter
} from 'lucide-react';
import { footerFeatures, footerSupport, pricing } from "../Landing/data";
import Pricing from "../../Components/Landing/Pricing/Pricing";
import LandingNavBar from "../../Components/Navbar/LandingNavBar";

const PricingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);



  const addOns = [
    {
      name: "Sensor Unit",
      price: 2500,
      description: "Complete environmental monitoring system with advanced sensors",
      features: [
        "Soil moisture monitoring",
        "Temperature and humidity tracking",
        "Rechargeable battery lasting 1 month",
        "Real-time data transmission",
        "Mobile app notifications",
        "Historical data logging"
      ]
    },
    {
      name: "Irrigation Unit",
      price: 2500,
      description: "Smart irrigation control system for automated water management",
      features: [
        "Smart plug for irrigation pump control",
        "Schedule-based automation",
        "Sensor-driven irrigation rules",
        "Remote control via mobile app",
        "Energy-efficient operation",
        "Integration with sensor units"
      ]
    }
  ];

  const trustIndicators = [
    {
      icon: Shield,
      title: "Secure Platform", 
      description: "We implement security best practices to protect your data"
    },
    {
      icon: Users, 
      title: "Great Impact",
      description: "Transforming agriculture with cutting-edge technology"
    },
    {
      icon: Headphones,
      title: "Expert Support",
      description: "Agricultural specialists available 24/7"
    }
  ];

  const testimonials = [
    {
      name: "Abdelrahman Tera",
      role: "Organic Farm Owner",
      location: "Port Fouad, EG",
      review: "Agrivision helped us increase yield by 20% last season! The disease detection feature saved our tomato crop."
    },
    {
      name: "Shehab Ahmed",
      role: "Farm Manager",
      location: "Ismailia, EG",
      review: "The smart irrigation system reduced our water usage by 30% while improving grape quality. Incredible technology!"
    },
    {
      name: "Hussein Mohamed",
      role: "Organic Farm Owner",
      location: "Ismailia, EG", 
      review: "Real-time sensor data have transformed how we plan our seasons. Highly recommended!"
    }
  ];

  const faqs = [
    {
      question: "Why isn't Agrivision completely free?",
      answer: "While we offer a generous free tier, our advanced AI models, real-time data processing, and 24/7 infrastructure require significant computational resources and ongoing development. Our pricing ensures we can continue innovating and providing reliable, cutting-edge agricultural technology that delivers real ROI for farmers."
    },
    {
      question: "What are the limitations of the free plan?", 
      answer: "The Starter plan includes 10 AI disease scans per month, basic weather data, and supports up to 3 fields on 1 farm. You won't have access to automation features, team collaboration, or advanced analytics. It's perfect for small farms wanting to try our technology before upgrading."
    },
    {
      question: "Can I upgrade or downgrade my plan anytime?",
      answer: "Yes! You can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your current billing cycle. We'll prorate any charges and ensure a smooth transition."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with Agrivision within the first 30 days, we'll provide a full refund, no questions asked."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise customers. All payments are processed securely through Stripe with bank-level encryption."
    },
    {
      question: "Is there a setup fee or long-term contract?",
      answer: "No setup fees and no long-term contracts required. You can cancel anytime. We believe our platform should earn your business every month through value, not lock you in with contracts."
    },
    {
      question: "How does the yearly discount work?",
      answer: "When you choose yearly billing, you get 25% off the monthly rate (equivalent to 2 months free). You'll be billed once per year, and you can still cancel anytime with a prorated refund for unused time."
    },
    {
      question: "What kind of support is included?",
      answer: "Starter plan includes email support with 48-hour response time. Professional includes priority email and chat support with 24-hour response. Enterprise includes 24/7 phone support with dedicated account management and guaranteed response times."
    }
  ];



  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <LandingNavBar alwaysSolid />

      {/* Hero Section */}
      <section className="bg-[#FAFBFC] py-20 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Simple, Transparent{' '}
            <span className="text-[#1E6930]">Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your farm. Start free, upgrade when you're ready.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-10 bg-gradient-to-b from-gray-50 to-white">
        <div className="sm:w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 items-center px-5 md:px-10">
          {pricing.map((block, index) => (
            <Pricing
              key={index}
              title={block.title}
              price={block.price}
              desc={block.desc}
              availableFarmers={block.availableFarmers}
              features={block.features}
            />
          ))}
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-bold text-gray-900 mb-4">You Could Also Get</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Supercharge your farming operations with our premium hardware
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {addOns.map((addon, index) => (
              <div
                key={addon.name}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{addon.name}</h3>
                    <span className="text-2xl font-bold text-[#1E6930]">{addon.price} L.E</span>
                  </div>
                  <p className="text-gray-600">{addon.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {addon.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-full font-semibold transition-all duration-300">
                  Order
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Security Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-bold text-gray-900 mb-4">Trusted & Secure</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your data and payments are protected by industry-leading security measures
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {trustIndicators.map((indicator, index) => {
              const IconComponent = indicator.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-[#E8F0EA] p-4 rounded-xl inline-block mb-4">
                    <IconComponent className="h-8 w-8 text-[#1E6930]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{indicator.title}</h3>
                  <p className="text-gray-600">{indicator.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-6">We accept:</p>
            <div className="flex justify-center">
              <img src="/stripe.png" alt="Stripe" className="h-24 px-6 py-2 bg-gray-100 rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real results from real farmers using Agrivision
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-[0px_1px_10px_0px_#00000040] border border-[#D2E1D6] space-y-6 flex flex-col"
              >
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-[#FACC1B]" fill="#FACC1B" />
                  ))}
                </div>

                <p className="text-sm font-medium text-[#4B5563] flex-1">
                  "{testimonial.review}"
                </p>

                <div className="flex items-center space-x-4">
                  <span className="flex items-center justify-center bg-green-900 w-10 h-10 rounded-full text-white">
                    {(testimonial.name || "").charAt(0).toUpperCase()}
                  </span>

                  <div>
                    <p className="text-sm font-bold capitalize">{testimonial.name}</p>
                    <span className="block text-sm font-semibold text-[#4B5563]">
                      {testimonial.role}
                    </span>
                    <span className="block text-sm font-semibold text-[#4B5563]">
                      {testimonial.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#1E6930] to-[#0F4A1A]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-base font-bold text-white mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join farmers who are revolutionizing their operations with Agrivision
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button className="bg-white text-[#1E6930] px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg">
              Start for Free
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#1E6930] transition-all">
              Pricing
            </button>
          </div>
          <p className="text-green-200 text-sm text-center">
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

export default PricingPage; 