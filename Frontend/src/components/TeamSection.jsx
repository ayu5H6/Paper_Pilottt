import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';

const About = () => {
  // Animation effect on scroll
  useEffect(() => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => observer.observe(el));
    
    return () => {
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  // Team members data
  const teamMembers = [
    { name: "Dr. Alexandra Chen", role: "Chief Education Officer", background: "Former Harvard Professor with 15+ years in EdTech" },
    { name: "Michael Okonjo", role: "AI Research Director", background: "PhD in Machine Learning with focus on educational applications" },
    { name: "Sarah Martinez", role: "User Experience Lead", background: "Specialized in designing accessible learning interfaces" },
    { name: "James Robinson", role: "Data Science Expert", background: "Leads AI-driven personalization in learning." },
    { name: "Olivia Bennett", role: "Educational Content Strategist", background: "Curates high-quality AI-powered learning content." }
  ];

  return (
    <div className="bg-slate-900 text-white">
      {/* Hero Section with Particle Animation */}
      <section
        className="relative w-full h-[85vh] flex items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: `url('/image.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          <div className="particles-container">
            {[...Array(15)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-red-400 opacity-70"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 20 + 5}px`,
                  height: `${Math.random() * 20 + 5}px`,
                  animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="z-10 max-w-3xl text-white animate-on-scroll opacity-0 transition-all duration-1000 translate-y-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">About WisdomWave</h1>
          <p className="mt-4 text-xl">"Transforming Education Through AI Innovation"</p>
          <a 
            href="/services" 
            className="mt-8 inline-block px-8 py-4 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Discover Our Mission
          </a>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 animate-on-scroll opacity-0 transition-all duration-1000 -translate-x-10">
            <h2 className="text-4xl font-semibold text-red-400 mb-6">Our Story</h2>
            <p className="text-lg text-gray-300 mb-4">
              Founded in 2023, WisdomWave began with a simple mission: to democratize education through the power of artificial intelligence.
            </p>
            <p className="text-lg text-gray-300 mb-6">
              We believe that technology should enhance human potential, not replace it. Our AI-powered educational tools are designed to support learners of all ages and backgrounds, making quality education more accessible than ever before.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              <div className="h-1 w-24 bg-red-500"></div>
              <p className="text-red-400 font-semibold">Learn. Grow. Succeed.</p>
            </div>
          </div>
          <div className="md:w-1/2 relative h-80 md:h-96 animate-on-scroll opacity-0 transition-all duration-1000 translate-x-10">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-blue-500/20 rounded-lg transform rotate-3"></div>
            <div className="absolute inset-0 bg-gray-800 rounded-lg shadow-2xl transform -rotate-3 overflow-hidden">
              <div className="absolute inset-0 bg-opacity-80 flex items-center justify-center">
                <div className="text-center p-8">
                  <h3 className="text-2xl font-bold mb-4">Our Impact</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-3xl font-bold text-red-400">50K+</p>
                      <p className="text-sm text-gray-400">Active Users</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-red-400">100+</p>
                      <p className="text-sm text-gray-400">Educational Partners</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-red-400">25+</p>
                      <p className="text-sm text-gray-400">Countries Reached</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-red-400">4.9</p>
                      <p className="text-sm text-gray-400">User Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Educational Philosophy Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto bg-gradient-to-b from-slate-900 to-slate-800">
        <h2 className="text-4xl font-semibold text-center text-red-400 mb-16 animate-on-scroll opacity-0 transition-all duration-1000">Our Educational Philosophy</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "🧠",
              title: "Personalized Learning",
              description: "Our AI adapts to your unique learning style, pace, and preferences, creating a truly personalized educational experience.",
            },
            {
              icon: "🌍",
              title: "Global Accessibility",
              description: "We're committed to breaking down barriers to education, making high-quality learning resources available worldwide.",
            },
            {
              icon: "🔄",
              title: "Continuous Improvement",
              description: "Education never stops evolving, and neither do we. Our tools are constantly refined based on the latest research.",
            },
          ].map((item, index) => (
            <div 
              key={index} 
              className="p-8 bg-gray-800 rounded-lg shadow-lg text-center hover:shadow-2xl transition transform duration-500 animate-on-scroll opacity-0"
              style={{ transitionDelay: `${index * 200}ms`, transform: 'translateY(20px)' }}
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-2xl font-semibold text-red-400 mb-4">{item.title}</h3>
              <p className="text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Our Services Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-semibold text-center text-red-400 mb-12 animate-on-scroll opacity-0 transition-all duration-1000">Our Services</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "📖 Article Reader",
              description: "Process complex academic papers and articles with our AI-powered reader that highlights key concepts and explains difficult terms.",
            },
            {
              title: "📑 Text Summarizer",
              description: "Convert lengthy educational materials into concise, easy-to-understand summaries without losing important information.",
            },
            {
              title: "📝 Grammar Checker",
              description: "Improve your academic writing with our intelligent grammar checker that offers context-aware suggestions and explanations.",
            },
            {
              title: "🖊️ Collaboration Editor",
              description: "Enhance group projects with our real-time collaborative editor featuring AI-powered assistance and feedback.",
            },
          ].map((service, index) => (
            <div 
              key={index} 
              className="p-6 bg-gray-800 rounded-lg shadow-lg text-center group hover:bg-gradient-to-br hover:from-red-900/50 hover:to-red-700/30 transition transform duration-500 animate-on-scroll opacity-0"
              style={{ transitionDelay: `${index * 150}ms`, transform: 'translateY(20px)' }}
            >
              <div className="group-hover:scale-110 transition-transform duration-300">
                <h3 className="text-2xl font-semibold text-red-400 mb-3">{service.title}</h3>
                <p className="text-gray-300">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Team Section with Swiper */}
      <section className="py-20 px-6 max-w-7xl mx-auto animate-on-scroll opacity-0 transition-all duration-1000">
        <h2 className="text-4xl font-semibold text-center text-red-400 mb-12">Our Expert Team</h2>
        
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="py-12"
        >
          {teamMembers.map((member, index) => (
            <SwiperSlide key={index}>
              <div className="p-6 bg-gray-800 rounded-lg shadow-lg text-center h-full">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-red-400 to-red-600 mb-4 flex items-center justify-center text-2xl font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                <p className="text-red-400 mb-2">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.background}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-r from-red-900/30 to-slate-900">
        <div className="max-w-4xl mx-auto text-center animate-on-scroll opacity-0 transition-all duration-1000">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Learning Experience?</h2>
          <p className="text-xl text-gray-300 mb-8">Join thousands of students, educators, and lifelong learners who are already using WisdomWave to enhance their educational journey.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition transform hover:scale-105 font-medium">Get Started For Free</a>
            <a href="/demo" className="px-8 py-4 bg-transparent border-2 border-red-600 text-white rounded-lg hover:bg-red-600/20 transition transform hover:scale-105 font-medium">Request Demo</a>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">WisdomWave</h3>
              <p className="text-gray-400">Empowering education through AI innovation, making learning more accessible, personalized, and effective.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-red-400 transition">About Us</a></li>
                <li><a href="/services" className="text-gray-400 hover:text-red-400 transition">Services</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-red-400 transition">Educational Blog</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-red-400 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
  {/* Twitter */}
  <a href="#" className="text-gray-400 hover:text-red-400 transition text-2xl">
    <i className="fab fa-twitter"></i>
  </a>

  {/* Instagram */}
  <a href="#" className="text-gray-400 hover:text-red-400 transition text-2xl">
    <i className="fab fa-instagram"></i>
  </a>

  {/* LinkedIn */}
  <a href="#" className="text-gray-400 hover:text-red-400 transition text-2xl">
    <i className="fab fa-linkedin"></i>
  </a>

  {/* Gmail (Using Envelope Icon) */}
  <a href="mailto:your-email@gmail.com" className="text-gray-400 hover:text-red-400 transition text-2xl">
    <i className="fas fa-envelope"></i>
  </a>
</div>

            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500">&copy; 2025 WisdomWave. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* CSS Keyframes for animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.7;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-10px) translateX(20px);
            opacity: 0.7;
          }
          75% {
            transform: translateY(10px) translateX(10px);
            opacity: 0.5;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.7;
          }
        }
        
        .animate-on-scroll {
          opacity: 0;
          transition: opacity 1s ease-out, transform 1s ease-out;
        }
        
        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0) translateX(0);
        }
        
        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
        }
        
        @media (prefers-reduced-motion) {
          .animate-on-scroll {
            transition: none;
            opacity: 1;
            transform: none;
          }
          
          [style*="animation"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default About;
