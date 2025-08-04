import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Lightbulb, 
  Leaf, 
  Award, 
  Clock, 
  MapPin, 
  Mail, 
  Download, 
  Play,
  CheckCircle,
  Calendar,
  Code,
  Smartphone,
  Palette,
  Database,
  Cpu,
  Phone,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react';
import { Button } from '../../Components/ui/Button';
import LandingNavBar from "../../Components/Navbar/LandingNavBar";

const About = () => {
  const stats = [
    { value: "9 Months", label: "Development", icon: <Clock className="w-6 h-6" /> },
    { value: "7 Members", label: "Team", icon: <Users className="w-6 h-6" /> },
    { value: "3rd Place", label: "FCI Innovation Award", icon: <Award className="w-6 h-6" /> },
    { value: "100%", label: "Passion Driven", icon: <Lightbulb className="w-6 h-6" /> }
  ];

  const values = [
    {
      icon: <Lightbulb className="w-8 h-8 text-[#1E6930]" />,
      title: "Innovation",
      description: "Pushing the boundaries of agricultural technology with cutting-edge AI and IoT solutions."
    },
    {
      icon: <Leaf className="w-8 h-8 text-[#1E6930]" />,
      title: "Sustainability", 
      description: "Creating solutions that promote sustainable farming practices and environmental stewardship."
    },
    {
      icon: <Users className="w-8 h-8 text-[#1E6930]" />,
      title: "Community",
      description: "Building tools that empower farmers and strengthen agricultural communities worldwide."
    },
    {
      icon: <Award className="w-8 h-8 text-[#1E6930]" />,
      title: "Excellence",
      description: "Delivering high-quality solutions through rigorous testing and continuous improvement."
    }
  ];

  const timeline = [
    {
      date: "Oct 2024",
      title: "Project Initiation",
      description: "Team formation, project scope definition, and initial research into agricultural challenges.",
      status: "completed"
    },
    {
      date: "Nov 2024", 
      title: "System Design",
      description: "Architecture planning, database design, and UI/UX mockups for the complete platform.",
      status: "completed"
    },
    {
      date: "Dec 2024",
      title: "AI Model Development", 
      description: "Training disease detection models and developing predictive analytics algorithms.",
      status: "completed"
    },
    {
      date: "Jan-May 2025",
      title: "Core Development",
      description: "Full-stack development of web platform, mobile app, and IoT integrations.",
      status: "completed"
    },
    {
      date: "Jun 2025",
      title: "Testing & Refinement",
      description: "Comprehensive testing, bug fixes, and performance optimizations.",
      status: "completed"
    },
    {
      date: "Jul 2025",
      title: "Final Implementation",
      description: "Final deployment, documentation, and project presentation for graduation.",
      status: "completed"
    }
  ];

  const team = [
    {
      name: "Youssef Alsafrani",
      role: "Project Leader, Backend, IoT & AI",
      initials: "Y A",
      icon: <Code className="w-5 h-5" />
    },
    {
      name: "Hussein Mohamed", 
      role: "UI/UX Designer & Frontend Developer",
      initials: "H M",
      icon: <Palette className="w-5 h-5" />
    },
    {
      name: "Mohamed Omar",
      role: "Backend Developer", 
      initials: "M O",
      icon: <Database className="w-5 h-5" />
    },
    {
      name: "Nada Elghandour",
      role: "Mobile Developer (Flutter)",
      initials: "N E",
      icon: <Smartphone className="w-5 h-5" />
    },
    {
      name: "Shehab Ahmed",
      role: "Frontend Developer",
      initials: "S A",
      icon: <Code className="w-5 h-5" />
    },
    {
      name: "Abdelrahman Tera",
      role: "UI/UX Designer & Frontend Developer",
      initials: "A T",
      icon: <Palette className="w-5 h-5" />
    },
    {
      name: "Ahmed Yousry",
      role: "Mobile Developer (Flutter)", 
      initials: "A Y",
      icon: <Smartphone className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <LandingNavBar alwaysSolid />

      {/* Hero Section */}
      <section className="py-20 pt-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Cultivating the Future of{' '}
              <span className="text-[#1E6930]">Agriculture</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-20">
              A graduation project by Computer Science students from Suez Canal University, 
              developing innovative solutions for modern farming challenges.
            </p>
            
            {/* Stats Grid */}
            <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-3 bg-[#F0FDF4] rounded-full text-[#1E6930]">
                      {stat.icon}
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                To democratize access to advanced agricultural technology by creating intuitive, 
                affordable solutions that empower farmers to optimize crop yields, reduce resource 
                waste, and contribute to global food security through data-driven decision making.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe that technology should bridge the gap between traditional farming 
                wisdom and modern innovation, making precision agriculture accessible to farmers 
                of all scales.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#1E6930] to-[#0F4A1A] rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-lg leading-relaxed">
                As a proof-of-concept graduation project, Agrivision demonstrates the potential 
                for intelligent, sustainable agricultural technology to transform farming practices 
                and contribute to a more food-secure future.
              </p>
              <div className="mt-6 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Academic Excellence in Applied Technology</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide our development process and shape our vision for the future of agriculture.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="p-3 bg-[#F0FDF4] rounded-full w-fit">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Development Timeline</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our journey from concept to implementation across the academic year.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 transform md:-translate-x-0.5"></div>

            <div className="space-y-12">
              {timeline.map((milestone, index) => (
                <div 
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-row`}
                >
                  {/* Timeline Node */}
                  <div className={`absolute left-4 md:left-1/2 w-4 h-4 rounded-full transform md:-translate-x-2 z-10 ${
                    milestone.status === 'completed' ? 'bg-[#1E6930]' : 
                    milestone.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}></div>

                  {/* Content */}
                  <div className={`w-full md:w-5/12 ml-12 md:ml-0 ${
                    index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
                  }`}>
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-3 mb-3">
                        <Calendar className="w-5 h-5 text-[#1E6930]" />
                        <span className="text-sm font-medium text-[#1E6930]">{milestone.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-4 ${
                        milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                        milestone.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {milestone.status === 'completed' ? 'Completed' :
                         milestone.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the dedicated Computer Science students bringing this vision to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="space-y-4">
                  <div className="relative mx-auto w-20 h-20 bg-gradient-to-br from-[#1E6930] to-[#0F4A1A] rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {member.initials}
                    <div className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-lg border border-gray-100">
                      <div className="text-[#1E6930]">
                        {member.icon}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Project Information</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with our team and learn more about the Agrivision graduation project.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* University Information */}
            <div className="bg-gradient-to-br from-[#1E6930] to-[#0F4A1A] rounded-2xl p-8 text-white order-2 lg:order-2">
              <h3 className="text-2xl font-bold mb-6">University Information</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Suez Canal University</p>
                    <p className="opacity-90">Faculty of Computers and Informatics</p>
                    <p className="opacity-90">Ismailia, Egypt</p>
                  </div>
                </div>
                                  <div className="flex items-center space-x-3">
                    <Mail className="w-6 h-6 flex-shrink-0" />
                    <p>agrivision.labs@gmail.com</p>
                  </div>
              </div>
            </div>

            {/* Academic Supervisor */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 order-1 lg:order-1">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Academic Supervisor</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1E6930] to-[#0F4A1A] rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                    M M
                  </div>
                  <h4 className="font-bold text-gray-900">Ass. Prof. Mohamed Ahmed Mead</h4>
                  <p className="text-gray-600 text-sm">Lecturer, Computer Science Department</p>
                  <p className="text-gray-500 text-xs">Faculty of Computers and Informatics</p>
                </div>
              </div>
            </div>

            {/* Project Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 order-3 lg:order-3">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Project Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Development Progress</span>
                  <span className="font-medium text-[#1E6930]">100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-[#1E6930] h-3 rounded-full transition-all duration-500" style={{width: '100%'}}></div>
                </div>
                <p className="text-sm text-gray-600">
                  Project development completed successfully! Final documentation and presentation have been finalized for graduation.
                </p>
                <div className="flex items-center space-x-2 text-sm text-green-600 font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>Project Completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Explore Our Work</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover the innovative features and technologies that make Agrivision a 
                  comprehensive agricultural management platform.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                <Link 
                  to="/features"
                  className="bg-[#1E6930] text-white py-3 px-10 rounded-full font-semibold hover:bg-[#0F4A1A] transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>View Project Demo</span>
                </Link>
                
                <a 
                  href="https://api.agrivisionlabs.tech/uploads/agrivision.pdf"
                  download="Agrivision_Presentation.pdf"
                  className="border-2 border-[#1E6930] text-[#1E6930] py-3 px-10 rounded-full font-semibold hover:bg-[#1E6930] hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Presentation</span>
                </a>
              </div>
            </div>
          </div>
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
            <a
              href="#features"
              className="text-sm font-medium text-[#4B5563] block"
            >
              Disease Detection
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-[#4B5563] block"
            >
              Automated Irrigation
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-[#4B5563] block"
            >
              Analytics
            </a>
          </section>
          <section className="space-y-3">
            <h4 className="text-base font-semibold capitalize">support</h4>
            <a
              href="/"
              className="text-sm font-medium text-[#4B5563] block"
            >
              Privacy Policy
            </a>
            <a
              href="#how_it_works"
              className="text-sm font-medium text-[#4B5563] block"
            >
              Terms Of Service
            </a>
            <a
              href="#how_it_works"
              className="text-sm font-medium text-[#4B5563] block"
            >
              Support
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-[#4B5563] block"
            >
              Pricing
            </a>
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
              agrivision.labs@gmail.com
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

export default About; 