import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Phone, Check, X, Home, Users, Shield, Bell } from 'lucide-react';

export default function SocietySignup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    terms: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score: 33, text: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score: 66, text: 'Medium', color: 'bg-yellow-500' };
    return { score: 100, text: 'Strong', color: 'bg-green-500' };
  };

  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(calculatePasswordStrength(formData.password));
    } else {
      setPasswordStrength({ score: 0, text: '', color: '' });
    }
  }, [formData.password]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith('91'));
  };

  const validatePassword = (password) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
  };

  const validate = (field, value) => {
    let error = '';
    
    switch (field) {
      case 'fullName':
        if (!value.trim()) error = 'Full name is required';
        else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value) error = 'Email is required';
        else if (!validateEmail(value)) error = 'Please enter a valid email address';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (!validatePassword(value)) error = 'Password must meet all requirements';
        break;
      case 'confirmPassword':
        if (!value) error = 'Please confirm your password';
        else if (value !== formData.password) error = 'Passwords do not match';
        break;
      case 'phone':
        if (value && !validatePhone(value)) error = 'Please enter a valid 10-digit phone number';
        break;
      case 'terms':
        if (!value) error = 'You must accept the terms and conditions';
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
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validate(name, fieldValue);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validate(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitting(false);
      alert('Account created successfully!');
    }
  };

  const isFormValid = () => {
    return Object.keys(formData).every(key => {
      if (key === 'phone') return true;
      return !validate(key, formData[key]);
    });
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
            <h1 className="text-5xl font-bold mb-4">Society Management Made Simple</h1>
            <p className="text-xl text-emerald-100">Join thousands of residents managing their communities effortlessly</p>
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

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <Home className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800">Society Management</h2>
          </div>
          
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600 mb-8">Join your society digital community</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      touched.fullName && errors.fullName ? 'border-red-500 focus:ring-red-500' : touched.fullName && !errors.fullName ? 'border-green-500 focus:ring-green-500' : 'border-gray-300 focus:ring-emerald-500'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {touched.fullName && !errors.fullName && formData.fullName && <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />}
                  {touched.fullName && errors.fullName && <X className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />}
                </div>
                {touched.fullName && errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
              </div>

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
                    placeholder="Create a strong password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Password Strength</span>
                      <span className={`text-xs font-medium ${passwordStrength.text === 'Weak' ? 'text-red-500' : passwordStrength.text === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>{passwordStrength.text}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all ${passwordStrength.color}`} style={{ width: `${passwordStrength.score}%` }} />
                    </div>
                    <div className="mt-2 text-xs text-gray-600 space-y-1">
                      <p className={formData.password.length >= 8 ? 'text-green-600' : ''}>• At least 8 characters</p>
                      <p className={/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? 'text-green-600' : ''}>• Upper and lowercase letters</p>
                      <p className={/[0-9]/.test(formData.password) ? 'text-green-600' : ''}>• At least one number</p>
                      <p className={/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600' : ''}>• At least one special character</p>
                    </div>
                  </div>
                )}
                {touched.password && errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      touched.confirmPassword && errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword ? 'border-green-500 focus:ring-green-500' : 'border-gray-300 focus:ring-emerald-500'
                    }`}
                    placeholder="Re-enter your password"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && <p className="mt-1 text-sm text-green-600 flex items-center gap-1"><Check className="w-4 h-4" /> Passwords match</p>}
                {touched.confirmPassword && errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-gray-400 text-xs">(Optional)</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      touched.phone && errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'
                    }`}
                    placeholder="+91-XXXXXXXXXX"
                  />
                  {touched.phone && !errors.phone && formData.phone && <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />}
                </div>
                {touched.phone && errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div>
                <label className="flex items-start cursor-pointer">
                  <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} onBlur={handleBlur} className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                  <span className="ml-2 text-sm text-gray-700">I agree to the <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium underline">Terms & Conditions</a></span>
                </label>
                {touched.terms && errors.terms && <p className="mt-1 text-sm text-red-500">{errors.terms}</p>}
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 py-2 rounded-lg">
                <Shield className="w-4 h-4" />
                <span>Secured with 256-bit encryption</span>
              </div>

              <button type="submit" disabled={!isFormValid() || isSubmitting} className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${!isFormValid() || isSubmitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'}`}>
                {isSubmitting ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg> Creating Account...</span> : 'Create Account'}
              </button>

              <p className="text-center text-sm text-gray-600">Already have an account? <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">Login here</a></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}