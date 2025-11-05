import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    { name: 'Rajesh Kumar', position: 'Treasurer', society: 'Green Valley, Mumbai', rating: 5, text: 'SocietyHub transformed our billing process. Collection time reduced by 60%.', avatar: 'RK' },
    { name: 'Priya Sharma', position: 'Secretary', society: 'Sunshine Heights, Bangalore', rating: 5, text: 'The visitor management feature is outstanding. Security loves it.', avatar: 'PS' },
    { name: 'Amit Patel', position: 'President', society: 'Royal Gardens, Pune', rating: 5, text: 'Best investment for our society. Saved countless hours.', avatar: 'AP' }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 px-4">
            Loved by <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Society Leaders</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm sm:text-base text-slate-700 italic mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {t.avatar}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{t.name}</p>
                  <p className="text-xs text-slate-600 truncate">{t.position}</p>
                  <p className="text-xs text-slate-500 truncate">{t.society}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
