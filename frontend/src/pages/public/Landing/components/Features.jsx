import React from 'react';
import { CreditCard, DoorOpen, Wrench, Megaphone, Calendar, Lock, Target } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: CreditCard,
      title: 'Billing & Payments',
      description: 'Automated billing, online payments, receipt generation, and payment tracking',
      color: 'from-emerald-500 to-teal-500',
      bgImage: '/images/billing-bg.jpg'
    },
    {
      icon: DoorOpen,
      title: 'Visitor Management',
      description: 'QR-based visitor entry, pre-approval system, and comprehensive visit logs',
      color: 'from-teal-500 to-cyan-500',
      bgImage: '/images/visitor-bg.jpg'
    },
    {
      icon: Wrench,
      title: 'Maintenance Requests',
      description: 'Quick complaint registration, tracking, and real-time resolution updates',
      color: 'from-cyan-500 to-blue-500',
      bgImage: '/images/maintenance-bg.jpg'
    },
    {
      icon: Megaphone,
      title: 'Notice Board',
      description: 'Digital announcements, push notifications, and event calendar management',
      color: 'from-blue-500 to-indigo-500',
      bgImage: '/images/notice-bg.jpg'
    },
    {
      icon: Calendar,
      title: 'Amenity Booking',
      description: 'Book clubhouse, gym, pool with real-time availability tracking',
      color: 'from-indigo-500 to-purple-500',
      bgImage: '/images/amenity-bg.jpg'
    },
    {
      icon: Lock,
      title: 'Security & Access',
      description: 'Digital gate passes, surveillance integration, and incident reports',
      color: 'from-purple-500 to-pink-500',
      bgImage: '/images/security-bg.jpg'
    }
  ];

  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-2 text-xs sm:text-sm font-medium mb-4">
            <Target className="w-4 h-4" />
            Key Features
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 px-4">
            Everything You Need in{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              One Platform
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto px-4">
            Powerful features designed to simplify society management
          </p>
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="lg:hidden">
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="flex-shrink-0 w-[85vw] sm:w-[70vw] snap-center">
                  <div className="relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-300 shadow-lg hover:shadow-2xl transition-all group h-full">
                    <div className="absolute inset-0">
                      <img
                        src={feature.bgImage}
                        alt=""
                        className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/85 to-white/80"></div>
                    </div>
                    <div className="relative p-6 h-full flex flex-col">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                      <p className="text-base text-slate-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {features.map((_, idx) => (
              <div key={idx} className="w-2 h-2 rounded-full bg-slate-300"></div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all group">
                <div className="absolute inset-0">
                  <img
                    src={feature.bgImage}
                    alt=""
                    className="w-full h-full object-cover opacity-15 group-hover:opacity-25 transition-opacity duration-300"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/85"></div>
                </div>
                <div className="relative p-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-base text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;