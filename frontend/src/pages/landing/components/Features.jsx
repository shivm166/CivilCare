import React from "react";
import {
  CreditCard,
  DoorOpen,
  Wrench,
  Megaphone,
  Calendar,
  Lock,
  Target,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Billing & Payments",
      description:
        "Automated billing, online payments, receipt generation, and payment tracking",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: <DoorOpen className="w-6 h-6" />,
      title: "Visitor Management",
      description:
        "QR-based visitor entry, pre-approval system, and comprehensive visit logs",
      color: "from-teal-500 to-cyan-500",
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      title: "Maintenance Requests",
      description:
        "Quick complaint registration, tracking, and real-time resolution updates",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: <Megaphone className="w-6 h-6" />,
      title: "Notice Board",
      description:
        "Digital announcements, push notifications, and event calendar management",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Amenity Booking",
      description:
        "Book clubhouse, gym, pool with real-time availability tracking",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Security & Access",
      description:
        "Digital gate passes, surveillance integration, and incident reports",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-2 text-xs sm:text-sm font-medium mb-4">
            <Target className="w-4 h-4" />
            Key Features
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 px-4">
            Everything You Need in{" "}
            <span className=" from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              One Platform
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto px-4">
            Powerful features designed to simplify society management
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all group"
            >
              <div
                className={`w-14 h-14 rounded-xl  ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <div className="text-white">{feature.icon}</div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
