import React from 'react';
import { Award, Zap, Play, CheckCircle2, TrendingUp, Shield } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 sm:left-20 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-teal-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-left">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium">
              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
              Trusted by 500+ Societies
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="text-slate-900">Manage Your Society</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                With Ease & Efficiency
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Complete society management solution for billing, visitor tracking, maintenance requests, and community engagement.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <button className="px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                Start Free Trial
              </button>
              <button className="px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 border-2 border-emerald-600 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                Watch Demo
              </button>
            </div>

            {/* Feature Points */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 md:gap-6 pt-2 sm:pt-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-slate-600 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">14-Day Free Trial</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Setup in 5 Minutes</span>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative mt-6 sm:mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-2xl p-3 sm:p-4 md:p-6 transform hover:scale-105 transition-all duration-300">
              <div className="relative aspect-video bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl overflow-hidden">
                {/* Dashboard Image - FIXED PATH */}
                <img 
                  src="/assets/dashboard-preview.jpg" 
                  alt="Society Management Dashboard"
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Label */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900">Society Dashboard</p>
                      <p className="text-xs text-slate-500">Real-time Analytics</p>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Badge - Active Users */}
            <div className="absolute -top-3 sm:-top-4 md:-top-6 -right-3 sm:-right-4 md:-right-6 bg-white rounded-xl shadow-lg p-2 sm:p-3 md:p-4 animate-bounce">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Active Users</p>
                  <p className="text-sm sm:text-base md:text-lg font-bold text-slate-900">10,000+</p>
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
