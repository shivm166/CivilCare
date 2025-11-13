import React from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const footerLinks = {
    product: ["Features", "How It Works", "Pricing", "FAQ"],
    company: ["About Us", "Careers", "Blog", "Help Center", "Contact Us", "Training Videos"],
    legal: ["Privacy Policy", "Terms of Service"],
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 mb-8">
          {/* Logo & Description - Takes 4 columns */}
          <div className="lg:col-span-4">
            <div className="flex items-center mb-4">
              <img 
                src="/assets/logo.png" 
                alt="CivilCare Logo"
                className="h-30 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-sm text-slate-400 mb-5 leading-relaxed pr-4">
              Simplifying society management with smart, integrated solutions for modern communities.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-2.5">
              {[
                { Icon: Facebook, label: "Facebook", href: "#" },
                { Icon: Twitter, label: "Twitter", href: "#" },
                { Icon: Linkedin, label: "LinkedIn", href: "#" },
                { Icon: Instagram, label: "Instagram", href: "#" }
              ].map(({ Icon, label, href }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-slate-800 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600 rounded-lg flex items-center justify-center transition-all transform hover:scale-110"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections - Takes 8 columns */}
          <div className="lg:col-span-8 grid grid-cols-3 gap-8">
            {/* Product Links */}
            <div>
              <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Product</h3>
              <ul className="space-y-2.5">
                {footerLinks.product.map((link, i) => (
                  <li key={i}>
                    <a
                      href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Company</h3>
              <ul className="space-y-2.5">
                {footerLinks.company.map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Legal</h3>
              <ul className="space-y-2.5">
                {footerLinks.legal.map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden mb-6">
          {/* Social Links */}
          <div className="flex gap-2.5 justify-center mb-6">
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 bg-slate-800 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600 rounded-lg flex items-center justify-center transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          {/* Collapsible Links */}
          <div className="space-y-2">
            {Object.entries(footerLinks).map(([category, links]) => (
              <details key={category} className="group">
                <summary className="flex items-center justify-between cursor-pointer bg-slate-800/50 px-3 py-2.5 rounded-lg font-semibold text-white text-xs uppercase tracking-wider">
                  {category}
                  <span className="text-emerald-500 text-sm transition-transform group-open:rotate-180">▼</span>
                </summary>
                <ul className="mt-1.5 space-y-1.5 px-3 py-2">
                  {links.map((link, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-xs text-slate-400 hover:text-emerald-400 transition-colors block py-1"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>

        {/* Get In Touch Section */}
        <div className="border-t border-slate-700/50 pt-6 mb-6">
          <h3 className="font-bold text-white mb-4 text-center lg:text-left text-sm lg:text-base">Get In Touch</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
            <a 
              href="tel:+919876543210" 
              className="flex items-center gap-2.5 p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-xl transition-all group"
            >
              <div className="w-10 h-10 bg-emerald-600/10 group-hover:bg-emerald-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Call Us</p>
                <p className="text-xs sm:text-sm font-medium text-slate-300">+91 98765 43210</p>
              </div>
            </a>

            <a 
              href="mailto:contact@civilcare.com" 
              className="flex items-center gap-2.5 p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-xl transition-all group"
            >
              <div className="w-10 h-10 bg-emerald-600/10 group-hover:bg-emerald-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Email Us</p>
                <p className="text-xs sm:text-sm font-medium text-slate-300">contact@civilcare.com</p>
              </div>
            </a>

            <div className="flex items-center gap-2.5 p-3 bg-slate-800/30 rounded-xl">
              <div className="w-10 h-10 bg-emerald-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Location</p>
                <p className="text-xs sm:text-sm font-medium text-slate-300">Mumbai, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-slate-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p className="text-xs text-slate-400">
              © 2025 CivilCare. All rights reserved. Made with <span className="text-red-500">❤️</span> in India
            </p>
            <div className="flex items-center gap-3 text-xs">
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Privacy</a>
              <span className="text-slate-700">•</span>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Terms</a>
              <span className="text-slate-700">•</span>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
