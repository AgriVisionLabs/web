import {
  Sprout,
  Droplet,
  Bug,
  Cpu,
  ClipboardCheck,
  Archive,
  ChartColumn,
  MapPin,
  Zap,
  Scan,
  UsersRound,
} from "lucide-react";
export const features = [
  {
    icon: <Sprout className={"text-white"} />,
    title: "Crop Selection",
    desc: "Choose the right crop at the right time – no guesswork, just data.",
  },
  {
    icon: <Droplet className="text-white" />,
    title: "Smart Irrigation",
    desc: "Connect field devices to remotely control and monitor irrigation units in real time.",
  },
  {
    icon: <Bug className="text-white" />,
    title: "Disease Detection",
    desc: "AI models detect signs of disease from images and video data.",
  },
  {
    icon: <UsersRound className="text-white" />,
    title: "Multi-Tenant",
    desc: "Seamlessly manage multiple farms under one account with robust tenant separation.",
  },
  {
    icon: <Cpu className="text-white" />,
    title: "Sensor Integration",
    desc: "Real-time monitoring of soil moisture, temperature, and envrionmental data.",
  },
  {
    icon: <ClipboardCheck className="text-white" />,
    title: "Task Management",
    desc: "Stay ahead of the season with streamlined task scheduling – no confusion, just coordination.",
  },
  {
    icon: <Archive className="text-white" />,
    title: "Inventory Logging",
    desc: "Record actual harvest and compare against forecasts.",
  },
  {
    icon: <ChartColumn className="text-white" />,
    title: "Reports & Analytics",
    desc: "Generate detailed reports and gain actionable insights with ease.",
  },
];

export const how_it_work = [
  {
    icon: <MapPin className={"text-white"} />,
    title: "Create Farm Profile",
    desc: "Set up your farm profile by choosing the number of fields, selecting your crops, and adding team members to collaborate and manage your agricultural operations.",
    steps: [
      "Multiple field management",
      "Crop selection and planning",
      "Team collaboration tools",
      "Role-based access control",
    ],
  },
  {
    icon: <Zap className={"text-white"} />,
    title: "Add Sensors & Irrigation Units",
    desc: "Install and configure sensor and irrigation unit devices for complete automation and real-time monitoring of your field conditions.",
    steps: [
      "IoT sensor integration",
      "Automated irrigation control",
      "Real-time data monitoring",
      "Environmental tracking",
    ],
  },
  {
    icon: <Scan className={"text-white"} />,
    title: "Scan & Analyze Crops",
    desc: "Use our AI-Powered scanning to get instant disease detection and comprehensive health analysis of your crops in real-time.",
    steps: [
      "AI disease detection",
      "Crop health analysis",
      "Real-time scanning",
      "Treatment recommendation",
    ],
  },
  {
    icon: <ClipboardCheck className={"text-white"} />,
    title: "Manage Tasks & Inventory",
    desc: "Organize your daily operations with comprehensive task management and inventory tracking to optimize your farm’s productivity and efficiency",
    steps: [
      "Task scheduling",
      "inventory management",
      "Progress tracking",
      "Resource optimization",
    ],
  },
];

export const pricing = [
  {
    title: "Basic",
    price: "Free",
    desc: "Perfect for small farms getting started with precision agriculture",
    availableFarmers: ["1 Farm", "Up to 3 Fields"],
    features: [
      "Access To The Dashboard For Farm And Field Management",
      "Basic Soil Health And Weather Insights",
      "AI-Powered Disease Detection For Limited Usage",
    ],
  },
  {
    title: "Advanced",
    price: "499.99 L.E / month",
    desc: "Comprehensive solution for growing agricultural operations",
    availableFarmers: ["Up To 3 Farms", "Up to 5 Fields Per Farm"],
    features: [
      "All Free Plan Features",
      "Advanced Analytics And Predictive Insights",
      "Unlimited AI-Powered Disease Dtetection",
      "Customizable Automation Rules For Irrigation And Sensor Integration",
    ],
  },
  {
    title: "Enterprise",
    price: "Custom",
    desc: "Tailored solutions for large-scale agricultural enterprises ",
    availableFarmers: ["Unlimited Farms", "Unlimited Fields Per Farm"],
    features: [
      "All Advanced Plan Features",
      "Dedicated Account Manager For Personalized Support",
      "Custom Integration & API Access",
      "Priority Support & Training",
    ],
  },
];

export const reviews = [
  {
    review:
      "“Agrivision helped us increase yield by 20% last season! The disease detection feature saved our tomato crop.”",
    name: "Abdelrahman Tera",
    role: "Organic Farm Owner",
    loc: "Port Fouad, EG",
  },
  {
    review:
      "“The smart irrigation system reduced our water usage by 30% while improving grape quality. Incredible technology!”",
    name: "Shehab Ahmed",
    role: "Farm Manager",
    loc: "Ismailia, EG",
  },
  {
    review:
      "“Real-time sensor data have transformed how we plan our seasons. Highly recommended!”",
    name: "Hussein Mohamed",
    role: "Organic Farm Owner",
    loc: "Ismailia, EG",
  },
];

export const footerFeatuers = [
  {
    title: "Disease Detection",
    href: "#features",
  },
  {
    title: "Automated Irrigation",
    href: "#features",
  },
  {
    title: "Analytics",
    href: "#features",
  },
];

export const footerSupport = [
  {
    title: "Privacy Policy",
    href: "/",
  },
  {
    title: "Terms Of Service",
    href: "#how_it_works",
  },
  {
    title: "Support",
    href: "#how_it_works",
  },
  {
    title: "Pricing",
    href: "#pricing",
  },
];
