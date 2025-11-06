import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import ProblemSolution from './components/ProblemSolution';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Home Section - Hero */}
      <section id="home">
        <Hero />
      </section>

      {/* Features Section */}
      <section id="features">
        <Features />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works">
        <HowItWorks />
      </section>

      {/* Problem Solution Section (optional - not in navbar) */}
      <section id="problem-solution">
        <ProblemSolution />
      </section>

      {/* Testimonials Section (optional - not in navbar) */}
      <section id="testimonials">
        <Testimonials />
      </section>

      {/* Pricing Section */}
      <section id="pricing">
        <Pricing />
      </section>

      {/* FAQ Section */}
      <section id="faq">
        <FAQ />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
