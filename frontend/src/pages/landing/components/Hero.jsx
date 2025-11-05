import React from 'react';
import { Award, Zap, Play, CheckCircle2, TrendingUp, Shield } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 sm:left-20 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-teal-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-2 text-xs sm:text-sm font-medium">
              <Award className="w-4 h-4" />
              Trusted by 500+ Societies
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="text-slate-900">Manage Your Society</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                With Ease & Efficiency
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Complete society management solution for billing, visitor tracking, maintenance requests, and community engagement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
                <Zap className="w-5 h-5" />
                Start Free Trial
              </button>
              <button className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-emerald-600 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6 pt-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-slate-600 justify-center lg:justify-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 justify-center lg:justify-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">14-Day Free Trial</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 justify-center lg:justify-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Setup in 5 Minutes</span>
              </div>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 transform hover:scale-105 transition-all">
              <div className="aspect-video bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Shield className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
                  </div>
                  <p className="text-slate-600 font-medium text-sm sm:text-base">Dashboard Preview</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 bg-white rounded-xl shadow-lg p-3 sm:p-4 animate-bounce hidden sm:block">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Active Users</p>
                  <p className="text-base sm:text-lg font-bold text-slate-900">10,000+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
