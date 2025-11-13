import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react";

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/"); // Go to homepage directly
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to from-blue-100 via-indigo-100 to-purple-100 relative overflow-hidden">
      {/* Floating Glow Circles */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-3xl opacity-20 animate-float"
          style={{
            width: `${100 + Math.random() * 150}px`,
            height: `${100 + Math.random() * 150}px`,
            background: i % 2 === 0 ? "#a5b4fc" : "#f9a8d4",
            top: `${Math.random() * 90}%`,
            left: `${Math.random() * 90}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${5 + Math.random() * 10}s`,
          }}
        />
      ))}

      {/* Main Popup Card */}
      <div className="card w-[90%] sm:w-[400px] glass shadow-2xl border border-white/40 text-center animate-popup relative z-10">
        <div className="card-body">
          {/* Glowing 404 Heading */}
          <h1 className="text-8xl font-extrabold bg-gradient-to- from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-glow">
            404
          </h1>

          <h2 className="text-2xl font-semibold text-gray-800">
            Page Not Found
          </h2>

          <p className="text-gray-600 mt-2">
            Oops! The page you’re trying to reach doesn’t exist or was moved.
          </p>

          {/* Go Back Button */}
          <button
            onClick={handleGoBack}
            className="btn btn-primary mt-6 flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <ArrowLeftCircle size={20} />
            Go to Home
          </button>
        </div>
      </div>

      {/* Bottom Soft Glow */}
      <div className="absolute bottom-0 w-full h-64 bg-gradient-to- from-indigo-300/20 to-transparent blur-3xl"></div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-25px);
          }
        }
        @keyframes glow {
          0%,
          100% {
            text-shadow: 0 0 10px rgba(147, 197, 253, 0.7);
          }
          50% {
            text-shadow: 0 0 20px rgba(167, 139, 250, 0.9);
          }
        }
        @keyframes popup {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(30px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-float {
          animation: float ease-in-out infinite;
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        .animate-popup {
          animation: popup 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PageNotFound;
