import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const Pricing = () => {
  const plans = [
    { name: 'Basic', price: '₹999', period: '/month', flats: 'Up to 50 flats', features: ['Billing & Payments', 'Visitor Management', 'Notice Board', 'Email Support'], popular: false },
    { name: 'Professional', price: '₹1,999', period: '/month', flats: 'Up to 200 flats', features: ['Everything in Basic', 'Maintenance Requests', 'Amenity Booking', 'Priority Support', 'Mobile App'], popular: true },
    { name: 'Enterprise', price: 'Custom', period: '', flats: '200+ flats', features: ['Everything in Professional', 'Custom Integrations', 'Account Manager', '24/7 Support', 'White-label'], popular: false }
  ];

  return (
    <section id="pricing" className="py-8 sm:py-12 lg:py-16 px-3 sm:px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-slate-900 mb-2 sm:mb-4 px-2">
            Simple{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Transparent Pricing
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Affordable and scalable plans to suit your community’s needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-xl p-4 sm:p-6 border transition-all ${
                plan.popular
                  ? 'border-emerald-500 shadow-xl scale-[1.02]'
                  : 'border-slate-200 shadow-md'
              } bg-white`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-0.5 rounded-full text-xs sm:text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl sm:text-4xl font-bold text-slate-900">
                    {plan.price}
                  </span>
                  <span className="text-slate-600 text-sm sm:text-base">
                    {plan.period}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-600 font-medium mt-1 sm:mt-2">
                  {plan.flats}
                </p>
              </div>

              <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-xs sm:text-base text-slate-700">{f}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg'
                    : 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50'
                }`}
              >
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
