import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const Pricing = () => {
  const plans = [
    { name: 'Basic', price: '₹999', period: '/month', flats: 'Up to 50 flats', features: ['Billing & Payments', 'Visitor Management', 'Notice Board', 'Email Support'], popular: false },
    { name: 'Professional', price: '₹1,999', period: '/month', flats: 'Up to 200 flats', features: ['Everything in Basic', 'Maintenance Requests', 'Amenity Booking', 'Priority Support', 'Mobile App'], popular: true },
    { name: 'Enterprise', price: 'Custom', period: '', flats: '200+ flats', features: ['Everything in Professional', 'Custom Integrations', 'Account Manager', '24/7 Support', 'White-label'], popular: false }
  ];

  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 px-4">
            Simple <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Transparent Pricing</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {plans.map((plan, i) => (
            <div key={i} className={`relative rounded-2xl p-6 sm:p-8 border-2 transition-all ${plan.popular ? 'border-emerald-500 shadow-2xl scale-105' : 'border-slate-200 shadow-lg'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-600">{plan.period}</span>
                </div>
                <p className="text-sm text-emerald-600 font-medium mt-2">{plan.flats}</p>
              </div>
              <div className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-slate-700">{f}</span>
                  </div>
                ))}
              </div>
              <button className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.popular ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg' : 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50'}`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
