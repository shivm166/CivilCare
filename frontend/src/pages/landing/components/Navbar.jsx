import React, { useState, useEffect } from 'react';
import { Menu, X, Zap, Phone, Mail, Home } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' }
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/98 backdrop-blur-lg shadow-lg' : 'bg-white/80 backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="#home" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all transform group-hover:scale-105">
                  <Home className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">SocietyHub</span>
                <span className="text-xs text-slate-500 font-medium -mt-1">Smart Living Solutions</span>
              </div>
            </a>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <a key={link.name} href={link.href} className="px-4 py-2 text-slate-700 hover:text-emerald-600 transition-colors font-medium text-sm rounded-lg hover:bg-emerald-50">
                  {link.name}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <button className="px-5 py-2.5 border-2 border-emerald-600 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-all text-sm">
                Login
              </button>
              <button className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all text-sm flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Get Started
              </button>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-slate-700 hover:bg-emerald-50 rounded-lg transition-colors">
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed top-20 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                {navLinks.map(link => (
                  <a key={link.name} href={link.href} onClick={handleLinkClick} className="block py-3 px-4 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors font-medium rounded-lg">
                    {link.name}
                  </a>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200">
                <button className="w-full px-5 py-3 border-2 border-emerald-600 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-all">
                  Login
                </button>
                <button className="w-full px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  Get Started Free
                </button>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm">contact@societyhub.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
