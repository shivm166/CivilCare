import React from 'react';
import { XCircle, CheckCircle2 } from 'lucide-react';

const ProblemSolution = () => {
  const problems = ['Manual billing and collection tracking', 'Paper-based complaints and requests', 'No visitor tracking system', 'Communication gaps with residents', 'Lack of transparency in finances'];
  const solutions = ['Automated billing with online payment gateway', 'Digital complaint management with status tracking', 'Smart visitor management with QR codes', 'Instant notifications and announcements', 'Complete financial transparency dashboard'];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 px-4">
            From <span className="text-red-600">Challenges</span> to <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Solutions</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 sm:p-8 border-2 border-red-200">
            <h3 className="text-xl sm:text-2xl font-bold text-red-900 mb-6 flex items-center gap-3">
              <XCircle className="w-6 sm:w-8 h-6 sm:h-8 flex-shrink-0" />
              <span>Traditional Challenges</span>
            </h3>
            <div className="space-y-4">
              {problems.map((problem, index) => (
                <div key={index} className="flex items-start gap-3 bg-white/80 rounded-lg p-3 sm:p-4">
                  <XCircle className="w-5 sm:w-6 h-5 sm:h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-slate-700">{problem}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 sm:p-8 border-2 border-emerald-200">
            <h3 className="text-xl sm:text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
              <CheckCircle2 className="w-6 sm:w-8 h-6 sm:h-8 flex-shrink-0" />
              <span>Modern Solutions</span>
            </h3>
            <div className="space-y-4">
              {solutions.map((solution, index) => (
                <div key={index} className="flex items-start gap-3 bg-white/80 rounded-lg p-3 sm:p-4">
                  <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-slate-700">{solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
