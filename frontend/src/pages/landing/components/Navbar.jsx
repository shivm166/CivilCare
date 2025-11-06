import React, { useState, useEffect } from 'react';
import { Menu, X, Zap, Phone, Mail, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ];

  // Smooth scroll function
  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const navbarHeight = 80; // Height of navbar (h-20 = 80px)
      const targetPosition = targetElement.offsetTop - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      setMobileMenuOpen(false);
    }
  };

  const handleLinkClick = (e, href) => {
    handleSmoothScroll(e, href);
  };

  const handleLoginClick = () => {
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/98 backdrop-blur-lg shadow-lg' : 'bg-white/80 backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section - Only Image */}
            <a 
              href="#home" 
              onClick={(e) => handleSmoothScroll(e, '#home')}
              className="flex items-center group"
            >
              <img 
                src="/assets/logo.png" 
                alt="CivilCare Logo"
                className="h-30 w-auto object-contain transition-transform transform group-hover:scale-105"
              />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="px-4 py-2 text-slate-700 hover:text-emerald-600 transition-colors font-medium text-md rounded-lg hover:bg-emerald-50 cursor-pointer"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Desktop Login Button */}
            <div className="hidden lg:flex items-center gap-3">
              <button 
                className="px-5 py-2.5 border-2 border-emerald-600 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-all text-sm"
                onClick={() =>{
                  navigate("/login")
                }}
                >
                Login
              </button>
              <button className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all text-sm flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Login
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-2 text-slate-700 hover:bg-emerald-50 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" 
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          ></div>
          <div className="fixed top-20 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {navLinks.map(link => (
                  <a 
                    key={link.name} 
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="block py-3 px-4 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors font-medium rounded-lg cursor-pointer"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              {/* Mobile Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <button 
                  onClick={handleLoginClick}
                  className="w-full px-5 py-3 border-2 border-emerald-600 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-all"
                >
                  Login
                </button>
                <button className="w-full px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  Get Started Free
                </button>
              </div>

              {/* Contact Information */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <a href="tel:+919876543210" className="flex items-center gap-3 text-slate-600 hover:text-emerald-600 transition-colors">
                  <Phone className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm">+91 98765 43210</span>
                </a>
                <a href="mailto:contact@societyhub.com" className="flex items-center gap-3 text-slate-600 hover:text-emerald-600 transition-colors">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm">contact@societyhub.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
