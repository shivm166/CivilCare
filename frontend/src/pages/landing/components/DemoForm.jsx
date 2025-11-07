import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import PageLoader from "../../components/common/PageLoader";

const DemoForm = () => {
  const [formData, setFormData] = useState({
    societyName: "",
    name: "",
    email: "",
    phone: "",
    flats: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.societyName.trim())
      newErrors.societyName = "Society name is required";
    if (!formData.name.trim()) newErrors.name = "Your name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Invalid phone number";
    }
    if (!formData.flats) newErrors.flats = "Please select number of flats";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        societyName: "",
        name: "",
        email: "",
        phone: "",
        flats: "",
        message: "",
      });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <section
      id="contact"
      className="py-12 sm:py-16 lg:py-20 px-4  from-emerald-50 via-teal-50 to-cyan-50"
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Request a{" "}
            <span className=" from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Free Demo
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            See how SocietyHub can transform your community management
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Thank You!
            </h3>
            <p className="text-slate-600">
              We'll get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Society Name *
              </label>
              <input
                type="text"
                name="societyName"
                value={formData.societyName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 ${
                  errors.societyName ? "border-red-300" : "border-slate-200"
                } rounded-xl focus:border-emerald-500 focus:outline-none transition-colors`}
                placeholder="Enter your society name"
              />
              {errors.societyName && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.societyName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 ${
                  errors.name ? "border-red-300" : "border-slate-200"
                } rounded-xl focus:border-emerald-500 focus:outline-none transition-colors`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 ${
                  errors.email ? "border-red-300" : "border-slate-200"
                } rounded-xl focus:border-emerald-500 focus:outline-none transition-colors`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 ${
                  errors.phone ? "border-red-300" : "border-slate-200"
                } rounded-xl focus:border-emerald-500 focus:outline-none transition-colors`}
                placeholder="+91 98765 43210"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Number of Flats *
              </label>
              <select
                name="flats"
                value={formData.flats}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 ${
                  errors.flats ? "border-red-300" : "border-slate-200"
                } rounded-xl focus:border-emerald-500 focus:outline-none transition-colors`}
              >
                <option value="">Select range</option>
                <option value="<50">Less than 50</option>
                <option value="50-100">50 - 100</option>
                <option value="100-200">100 - 200</option>
                <option value="200+">200+</option>
              </select>
              {errors.flats && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.flats}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                placeholder="Tell us about your requirements..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4  from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {<PageLoader />}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Request Demo
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default DemoForm;
