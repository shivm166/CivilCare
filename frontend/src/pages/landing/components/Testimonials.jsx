import React, { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const resumeTimerRef = useRef(null);

  const testimonials = [
    { 
      name: 'Rajesh Kumar', 
      position: 'Treasurer', 
      society: 'Green Valley, Mumbai', 
      rating: 5, 
      text: 'SocietyHub transformed our billing process. Collection time reduced by 60%.', 
      avatar: 'RK' 
    },
    { 
      name: 'Priya Sharma', 
      position: 'Secretary', 
      society: 'Sunshine Heights, Bangalore', 
      rating: 5, 
      text: 'The visitor management feature is outstanding. Our security team loves it.', 
      avatar: 'PS' 
    },
    { 
      name: 'Amit Patel', 
      position: 'President', 
      society: 'Royal Gardens, Pune', 
      rating: 5, 
      text: 'Best investment for our society. Saved countless hours on administrative tasks.', 
      avatar: 'AP' 
    },
    { 
      name: 'Sneha Reddy', 
      position: 'Committee Member', 
      society: 'Ocean View, Chennai', 
      rating: 5, 
      text: 'Maintenance tracking is game-changing. Real-time updates keep us organized.', 
      avatar: 'SR' 
    },
    { 
      name: 'Vikram Singh', 
      position: 'Chairman', 
      society: 'Paradise Heights, Delhi', 
      rating: 5, 
      text: 'Communication is seamless. Announcements reach everyone instantly.', 
      avatar: 'VS' 
    }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let animationId;

    const animate = () => {
      if (!isPaused && !isDragging && scrollContainer) {
        const cardWidth = window.innerWidth < 640 ? 220 : 380;
        const gap = window.innerWidth < 640 ? 12 : 24;
        const totalWidth = (cardWidth + gap) * testimonials.length;
        
        scrollContainer.scrollLeft += 1;
        
        if (scrollContainer.scrollLeft >= totalWidth) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPaused, isDragging, testimonials.length]);

  // Clear resume timer on unmount
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
    scrollContainerRef.current.style.userSelect = 'none';
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      scrollContainerRef.current.style.cursor = 'grab';
      
      resumeTimerRef.current = setTimeout(() => {
        setIsPaused(false);
      }, 1000);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = 'grab';
    scrollContainerRef.current.style.userSelect = 'auto';
    
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 1000);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Touch drag handlers for mobile
  const handleTouchStart = (e) => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 1000);
  };

  const handleMouseEnter = () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    setIsPaused(true);
  };

  const handleContainerMouseLeave = () => {
    if (!isDragging) {
      resumeTimerRef.current = setTimeout(() => {
        setIsPaused(false);
      }, 500);
    }
  };

  return (
    <section className="py-8 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-emerald-100 text-emerald-700 rounded-full px-2.5 py-1 sm:px-4 sm:py-2 text-xs font-medium mb-2 sm:mb-4">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-emerald-600 text-emerald-600" />
            Trusted by 500+ Societies
          </div>
          <h2 className="text-xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-2 sm:mb-4 px-2">
            Loved by <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Society Leaders</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
            See what committees are saying about their experience
          </p>
        </div>

        {/* Scrollable Container Wrapper */}
        <div className="relative">
          {/* Left Gradient Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-emerald-50 to-transparent z-10 pointer-events-none"></div>
          
          {/* Right Gradient Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-emerald-50 to-transparent z-10 pointer-events-none"></div>

          {/* Scroll Container */}
          <div 
            ref={scrollContainerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleContainerMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="flex gap-3 sm:gap-6 overflow-x-auto pb-2 sm:pb-4 scrollbar-hide cursor-grab active:cursor-grabbing"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* Render testimonials twice for infinite loop effect */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div 
                key={index}
                className="flex-shrink-0 w-[220px] sm:w-[380px] bg-white rounded-lg sm:rounded-2xl p-3 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 select-none"
                onDragStart={(e) => e.preventDefault()}
              >
                {/* Star Rating */}
                <div className="flex gap-0.5 mb-2 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <Star key={starIndex} className="w-3 h-3 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-xs sm:text-base text-slate-700 italic mb-3 sm:mb-6 leading-relaxed line-clamp-3 sm:line-clamp-4">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-2 sm:gap-3 pt-2 sm:pt-4 border-t border-slate-100">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-base flex-shrink-0 shadow-md">
                    {testimonial.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 text-xs sm:text-sm truncate">{testimonial.name}</p>
                    <p className="text-xs text-slate-600 truncate">{testimonial.position}</p>
                    <p className="text-xs text-slate-500 truncate">{testimonial.society}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="text-center mt-3 sm:mt-6">
          <p className="text-xs text-slate-500 italic">
            <span className="hidden sm:inline">Drag to scroll • Hover to pause • </span>
            <span className="sm:hidden">Swipe to scroll • </span>
            Auto-scrolling
          </p>
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
