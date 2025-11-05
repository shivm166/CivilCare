import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Check, X, Home, Users, Shield, Bell, LogIn } from 'lucide-react';

export default function SocietyLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const validate = (field, value) => {
    let error = '';
    
    switch (field) {
      case 'email':
        if (!value) error = 'Email is required';
        else if (!validateEmail(value)) error = 'Please enter a valid email address';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 6) error = 'Password must be at least 6 characters';
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = type === 'checkbox' ? checked : value;
    
    if (name === 'email') processedValue = value.toLowerCase();
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    
    if (touched[name]) {
      const error = validate(name, processedValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validate(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    ['email', 'password'].forEach(key => {
      const error = validate(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitting(false);
      alert('Login successful!');
    }
  };

  const isFormValid = () => {
    return !validate('email', formData.email) && !validate('password', formData.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-12 flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-white max-w-lg">
          <div className="mb-8">
            <Home className="w-16 h-16 mb-4" />
            <h1 className="text-5xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-xl text-emerald-100">Log in to access your society management dashboard</p>
          </div>
          
          <div className="space-y-6 mt-12">
            <div className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <Users className="w-8 h-8 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Community Connect</h3>
                <p className="text-emerald-100">Stay connected with your neighbors</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <Shield className="w-8 h-8 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Secure & Private</h3>
                <p className="text-emerald-100">Your data is encrypted and protected</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <Bell className="w-8 h-8 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Real-time Notifications</h3>
                <p className="text-emerald-100">Never miss important announcements</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <Home className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800">Society Management</h2>
          </div>
          
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
              <p className="text-gray-600">Access your society dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      touched.email && errors.email ? 'border-red-500 focus:ring-red-500' : touched.email && !errors.email ? 'border-green-500 focus:ring-green-500' : 'border-gray-300 focus:ring-emerald-500'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {touched.email && !errors.email && formData.email && <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />}
                  {touched.email && errors.email && <X className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />}
                </div>
                {touched.email && errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      touched.password && errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {touched.password && errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remember me</span>
                </label>
                <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={!isFormValid() || isSubmitting}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                  !isFormValid() || isSubmitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Login
                  </span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 py-2 rounded-lg">
                <Shield className="w-4 h-4" />
                <span>Secured with 256-bit encryption</span>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600">
                  Don't have an account? <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">Sign up here</a>
                </p>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-emerald-600 transition-colors">Help Center</a>
              <span>•</span>
              <a href="#" className="hover:text-emerald-600 transition-colors">Contact Support</a>
              <span>•</span>
              <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}