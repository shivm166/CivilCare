import React from 'react';
import { Users, Shield, Bell, TrendingUp } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    { number: '1', title: 'Create Your Account', description: 'Register your society in under 2 minutes', icon: <Users className="w-6 sm:w-8 h-6 sm:h-8" /> },
    { number: '2', title: 'Add Society Details', description: 'Configure blocks, flats, residents, and amenities', icon: <Shield className="w-6 sm:w-8 h-6 sm:h-8" /> },
    { number: '3', title: 'Invite Residents', description: 'Send invitations via email or SMS', icon: <Bell className="w-6 sm:w-8 h-6 sm:h-8" /> },
    { number: '4', title: 'Start Managing', description: 'Access dashboard and streamline operations', icon: <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8" /> }
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 px-4">
            Get Started in <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">4 Simple Steps</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all h-full">
                <div className="w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white text-xl sm:text-2xl font-bold">{step.number}</span>
                </div>
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <div className="text-emerald-600">{step.icon}</div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 text-center">{step.title}</h3>
                <p className="text-sm sm:text-base text-slate-600 text-center leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
