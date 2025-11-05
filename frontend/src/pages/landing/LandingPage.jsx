import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import ProblemSolution from './components/ProblemSolution';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import DemoForm from './components/DemoForm';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <ProblemSolution />
      <Testimonials />
      <Pricing />
      <DemoForm />
      <FAQ />
      <Footer />
    </div>
  );
}

export default LandingPage;
