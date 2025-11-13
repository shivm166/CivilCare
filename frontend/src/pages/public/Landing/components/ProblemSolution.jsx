import React from 'react';
import { XCircle, CheckCircle2 } from 'lucide-react';

export default function ProblemSolution({ className = '' }) {
  const problems = [
    'Manual billing and collection tracking',
    'Paper-based complaints and requests',
    'No visitor tracking system',
    'Communication gaps with residents',
    'Lack of transparency in finances',
  ];
  const solutions = [
    'Automated billing with online payment gateway',
    'Digital complaint management with status tracking',
    'Smart visitor management with QR codes',
    'Instant notifications and announcements',
    'Complete financial transparency dashboard',
  ];

  return (
    <section
      aria-labelledby="ps-heading"
      className={`py-8 sm:py-12 lg:py-16 px-4 bg-gray-50 ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <h2
            id="ps-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight"
          >
            From <span className="text-red-600">Challenges</span> to{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Solutions
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            Make community management effortless — reduce paperwork, improve
            transparency and keep residents informed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Problems column */}
          <article
            className="group rounded-2xl p-4 sm:p-6 border transition-shadow duration-200 shadow-sm hover:shadow-md bg-white/80 border-red-100"
            aria-labelledby="problems-title"
          >
            <header className="flex items-center gap-3 mb-4">

              <h3 id="problems-title" className="text-xl sm:text-2xl font-semibold text-red-900">
                Traditional Challenges
              </h3>
            </header>

            <ul className="space-y-3 sm:space-y-4">
              {problems.map((p, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg p-3 sm:p-3.5 bg-red-50/60"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <XCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <p className="text-sm sm:text-sm leading-snug text-slate-700">{p}</p>
                </li>
              ))}
            </ul>

            {/* subtle footer on large screens */}
            <div className="hidden lg:flex items-center justify-end mt-6 text-xs text-slate-500">
              Problems snapshot
            </div>
          </article>

          {/* Solutions column */}
          <article
            className="group rounded-2xl p-4 sm:p-6 border transition-transform duration-200 hover:-translate-y-1 bg-white/80 border-emerald-100 shadow-sm"
            aria-labelledby="solutions-title"
          >
            <header className="flex items-center gap-3 mb-4">
              <h3 id="solutions-title" className="text-xl sm:text-2xl font-semibold text-emerald-900">
                Modern Solutions
              </h3>
            </header>

            <ul className="space-y-3 sm:space-y-4">
              {solutions.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg p-3 sm:p-3.5 bg-emerald-50/60"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <p className="text-sm sm:text-sm leading-snug text-slate-700">{s}</p>
                </li>
              ))}
            </ul>

            <div className="hidden lg:flex items-center justify-end mt-6 text-xs text-slate-500">
              Solutions snapshot
            </div>
          </article>
        </div>
      </div>

      {/* Mobile-only compact adjustments using utility classes */}
      <style jsx>{`
        /* extra fine-tuned mobile shrink using CSS variables and media query */
        @media (max-width: 640px) {
          section[aria-labelledby='ps-heading'] {
            padding-top: 1.25rem; /* reduce vertical padding */
            padding-bottom: 1.25rem;
          }

          /* slightly reduce card padding and font size for very small screens */
          .group > ul > li {
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
          }

          .group h3 {
            font-size: 1rem;
          }

          .group p {
            font-size: 0.86rem;
          }
        }
      `}</style>
    </section>
  );
}
