import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  
  const faqs = [
    { q: 'How do I get started with SocietyHub?', a: 'Simply sign up for a free 14-day trial, add your society details, invite residents, and start managing. Our onboarding team will guide you through the setup process.' },
    { q: 'Is there a setup fee or hidden charges?', a: 'No hidden charges. Our pricing is completely transparent. You only pay the monthly subscription fee based on your chosen plan. No setup fees, no surprises.' },
    { q: 'Can residents access the platform on mobile?', a: 'Yes! SocietyHub has dedicated mobile apps for both iOS and Android. Residents can make payments, raise complaints, book amenities, and stay updated on the go.' },
    { q: 'How secure is our society data?', a: 'We use bank-grade 256-bit SSL encryption for all data transmission. Your data is stored in secure cloud servers with regular backups and strict access controls.' },
    { q: 'Do you provide training for committee members?', a: 'Absolutely! We provide comprehensive training sessions, video tutorials, and dedicated support to ensure your committee members are comfortable using all features.' },
    { q: 'What payment gateways do you support?', a: 'We support all major Indian payment gateways including Razorpay, PayU, and Paytm. Residents can pay via UPI, credit/debit cards, net banking, and wallets.' },
    { q: 'Can we customize features for our society?', a: 'Yes! Our Professional and Enterprise plans offer customization options. You can configure workflows, add custom fields, and tailor the platform to your needs.' },
    { q: 'Is there a contract period?', a: 'No long-term contracts required. You can choose monthly or annual billing. Cancel anytime with no penalties. We believe in earning your trust, not locking you in.' }
  ];

  return (
    <section id="faq" className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Frequently Asked <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden hover:border-emerald-300 transition-colors">
              <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-emerald-50 transition-colors">
                <span className="font-semibold text-slate-900 text-sm sm:text-base pr-4">{faq.q}</span>
                {openIndex === index ? (
                  <ChevronDown className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200">
          <p className="text-lg font-semibold text-slate-900 mb-2">Still have questions?</p>
          <p className="text-slate-600 mb-4">Our team is here to help you 24/7</p>
          <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
