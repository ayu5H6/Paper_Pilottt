import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import TypewriterText from "./TypewriterText";
import { useNavigate } from "react-router-dom";


//predicting
//started

import { ChevronRight, Star, Check, Download, ArrowRight, ArrowDown, ArrowUp, User, Code, FileText, Bookmark, Zap, Book, Award, Clock, ArrowLeft, Smartphone, BarChart, Building, MousePointer, MessageSquare, Pencil, Bell, Save, Twitter, Linkedin, Github, Sun, Moon, Play, Share } from 'lucide-react';

// Animation component for elements that fade in when scrolled into view //PaperPilot
//demo

const FadeInOnScroll = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();
  
//learn from academic
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.unobserve(domRef.current);
      }
    });
    
    //platform
    observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);
//about
  return (
    <div
      ref={domRef}
      className={`transition-opacity duration-700 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
//started

// Interactive testimonial carousel component
const TestimonialCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonials = [
    {
      quote: "PaperPilot revolutionized my research workflow. The AI analysis tools saved me countless hours reviewing literature.",
      author: "Dr. Emma Rodriguez",
      position: "Professor of Economics, Stanford University",
      avatar: "/learn1.jpg"
    },
    {
      quote: "As a non-native English speaker, the grammar checker has been invaluable for my academic writing. My papers are now published in top journals.",
      author: "Wei Zhang",
      position: "PhD Candidate, MIT",
      avatar: "/learn.jpg"
    },
    {
      quote: "The collaborative features allowed my research team to work seamlessly across three time zones. A game-changer for international collaboration.",
      author: "Professor James Wilson",
      position: "Department Chair, Oxford University",
      avatar: "/chik.jpg"
    }
  ];
//start
  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 relative overflow-hidden shadow-lg">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
      
      <div className="mb-8 relative">
        <div className="text-5xl text-blue-200 absolute -top-6 left-0">"</div>
        <p className="text-lg italic text-gray-700 relative z-10 pl-6">
          {testimonials[activeIndex].quote}
        </p>
        <div className="text-5xl text-blue-200 absolute bottom-0 right-0">"</div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
            <img 
              src={testimonials[activeIndex].avatar || "/placeholder.svg"} 
              alt={testimonials[activeIndex].author} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{testimonials[activeIndex].author}</h4>
            <p className="text-sm text-gray-600">{testimonials[activeIndex].position}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={prevTestimonial}
            //platform
            className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-colors duration-200"
            aria-label="Previous testimonial"
          >
            <ArrowLeft size={16} />
          </button>
          <button 
            onClick={nextTestimonial}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-colors duration-200"
            aria-label="Next testimonial"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex justify-center mt-4 space-x-2">
        {testimonials.map((_, index) => (
          <button 
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-6 bg-blue-600' : 'bg-gray-300'}`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Interactive stats counter that animates when in viewport
const AnimatedCounter = ({ end, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.unobserve(countRef.current);
        }
      }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [end, duration, isVisible]);

  return (
    <span ref={countRef} className="font-bold">
      {count}{suffix}
    </span>
  );
};

// Custom hook for parallax scrolling effect
function useParallax(speed = 0.5) {
  const [offset, setOffset] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const elementTop = ref.current.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight && elementTop > -ref.current.offsetHeight) {
        setOffset((windowHeight - elementTop) * speed);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { ref, style: { transform: `translateY(${offset * -0.1}px)` } };
}

// Interactive feature showcase with tabs
const FeatureShowcase = () => {
  const [activeTab, setActiveTab] = useState("research");
  const navigate = useNavigate();
  const features = {
    research: {
      title: "Research Assistant",
      description: "Upload papers and get AI-powered summaries, key findings, and related research recommendations.",
      icon: <FileText size={48} className="text-blue-600" />,
      image: "/research.jpg",
      route: "/pdf-uploader"
    },
    writing: {
      title: "Advanced Writing Tools",
      description: "AI grammar checking, style suggestions, and automated citations in any format you need.",
      icon: <Book size={48} className="text-green-600" />,
      image: "/gogo.jpg",
      route: "/article-reader"
    },
    collaboration: {
      title: "Real-time Collaboration",
      description: "Work with peers across the globe with our real-time document editor with commenting and version control.",
      icon: <User size={48} className="text-purple-600" />,
      image: "/gigi.jpg",
      route: "/realtime-editor"
     
    },
    analytics: {
      title: "Academic Analytics",
      description: "Track your research progress, writing trends, and productivity with detailed analytics dashboards.",
      icon: <Zap size={48} className="text-yellow-600" />,
      image: "/chik.jpg",
      route: "/citation-generator"
      
    }
  };
//versities
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="flex flex-wrap">
        <div className="w-full lg:w-1/3 bg-gray-50 p-6 lg:p-8 border-r border-gray-200" id="target-section">
          <h3 className="text-2xl font-bold mb-6">Platform Features</h3>
          <div className="space-y-2">
            {Object.entries(features).map(([key, feature]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center w-full p-4 rounded-lg transition-all duration-300 ${
                  activeTab === key 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'hover:bg-gray-100'
                }`}
                aria-selected={activeTab === key}
              >
                <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                  activeTab === key ? 'bg-white' : 'bg-gray-100'
                } mr-3`}>
                  {React.cloneElement(feature.icon, { size: 20 })}
                </div>
                <span className="font-medium">{feature.title}</span>
                {activeTab === key && (
                  <ChevronRight size={16} className="ml-auto text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="w-full lg:w-2/3 p-6 lg:p-8">
          <div className="flex items-center mb-4">
            {features[activeTab].icon}
            <h3 className="text-2xl font-bold ml-4">{features[activeTab].title}</h3>
          </div>
          <p className="text-lg text-gray-700 mb-6">
            {features[activeTab].description}
          </p>
          <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden shadow-inner">
            <img
              src={features[activeTab].image || "/placeholder.svg"}
              alt={features[activeTab].title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            
              <button onClick={() => {
  console.log(features[activeTab].route);
  navigate(features[activeTab].route);
}}
 className="bg-white text-blue-800 px-4 py-2 rounded-lg font-medium flex items-center">
                Try It Now <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Interactive FAQ accordion
const FAQAccordion = ({ faqItems }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {faqItems.map((item, index) => (
        <div 
          key={index} 
          className={`border rounded-xl overflow-hidden transition-all duration-300 ${
            activeIndex === index ? 'border-blue-400 shadow-md' : 'border-gray-200'
          }`}
        >
          <button
            className="w-full flex justify-between items-center p-5 text-left"
            onClick={() => toggleAccordion(index)}
            aria-expanded={activeIndex === index}
          >
            <span className="font-medium text-lg">{item.question}</span>
            <div className={`transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`}>
              <ArrowDown size={20} />
            </div>
          </button>
          <div 
            className={`overflow-hidden transition-all duration-300 ${
              activeIndex === index ? 'max-h-56' : 'max-h-0'
            }`}
            aria-hidden={activeIndex !== index}
          >
            <div className="p-5 pt-0 bg-gray-50">
              <p className="text-gray-700">{item.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Trial form with validation
const TrialForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    role: "",
    usage: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const roles = ["Student", "Professor", "Researcher", "Writer", "Other"];
  const usageCases = ["Research Papers", "Thesis Writing", "Article Publishing", "Collaborative Projects", "Other"];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    
    if (!formData.role) {
      newErrors.role = "Please select your role";
    }
    
    if (!formData.usage) {
      newErrors.usage = "Please select how you'll use PaperPilot";
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form after success message
      setTimeout(() => {
        setFormData({
          email: "",
          role: "",
          usage: ""
        });
        setIsSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
      {isSuccess ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-4">We'll be in touch with your free trial details shortly.</p>
        </div>
      ) : (
        //powerful
        <>
          <h3 className="text-2xl font-bold mb-6">Start Your Free Trial</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                Work Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="you@organization.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="role">
                Your Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.role ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select your role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                How will you use PaperPilot?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {usageCases.map((usage) => (
                  <label key={usage} className="flex items-center">
                    <input
                      type="radio"
                      name="usage"
                      value={usage}
                      checked={formData.usage === usage}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-gray-700">{usage}</span>
                  </label>
                ))}
              </div>
              {errors.usage && <p className="text-red-500 text-xs mt-1">{errors.usage}</p>}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Start Free Trial"
              )}
            </button>
            
            <p className="text-center text-xs text-gray-500 mt-4">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
        </>
      )}
    </div>
  );
};

// Timeline component for roadmap
const Roadmap = () => {
  const milestones = [
    {
      date: "2023 Q4",
      title: "Platform Launch",
      description: "Initial release with core writing and collaboration features",
      icon: <Zap size={20} className="text-purple-500" />,
      color: "purple"
    },
    {
      //platform
      date: "2024 Q1",
      title: "AI Research Assistant",
      description: "AI-powered research analysis and recommendation engine",
      icon: <FileText size={20} className="text-blue-500" />,
      color: "blue"
    },
    {
      date: "2024 Q2",
      title: "Mobile Applications",
      description: "Native iOS and Android apps for on-the-go productivity",
      icon: <Smartphone size={20} className="text-green-500" />,
      color: "green"
    },
    {
      date: "2024 Q4",
      title: "Institution Integration",
      description: "LMS integration with major university systems",
      icon: <Building size={20} className="text-yellow-500" />,
      color: "yellow"
    },
    {
      date: "2025 Q2",
      title: "Advanced Analytics",
      description: "Comprehensive research impact and productivity metrics",
      icon: <BarChart size={20} className="text-red-500" />,
      color: "red"
    }
  ];
  
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-8 bottom-0 w-0.5 bg-gray-300 hidden md:block"></div>
      
      <div className="space-y-12">
        {milestones.map((milestone, index) => (
          <FadeInOnScroll 
            key={index} 
            delay={index * 200} 
            className="flex flex-col md:flex-row"
          >
            <div className="flex md:w-1/4 mb-4 md:mb-0">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-${milestone.color}-100 flex items-center justify-center z-10`}>
                {milestone.icon}
              </div>
              <div className="ml-4 md:ml-0">
                <div className={`font-semibold text-${milestone.color}-600`}>{milestone.date}</div>
              </div>
            </div>
            <div className="md:w-3/4 pl-10 md:pl-16">
              <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
              <p className="text-gray-600">{milestone.description}</p>
              {index < milestones.length - 1 && (
                <div className="h-8 w-0.5 bg-gray-300 ml-0 mt-4 md:hidden"></div>
              )}
            </div>
          </FadeInOnScroll>
        ))}
      </div>
    </div>
  );
};

const About = () => {
  //platform
  // Create refs for various sections
  const heroRef = useRef(null);
  const instructorsRef = useRef(null);
  const featuresRef = useRef(null);
  
  // Parallax effects
  const heroParallax = useParallax(0.3);
  const statsParallax = useParallax(0.2);
   
  //platform
  // State for sticky header
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  
  // Example statistics data
  const stats = [
    { number: 25, suffix: "K+", label: "Active Students", icon: <User size={24} className="text-blue-500" /> },
    { number: 300, suffix: "+", label: "Expert Instructors", icon: <Award size={24} className="text-purple-500" /> },
    { number: 95, suffix: "%", label: "Satisfaction Rate", icon: <Star size={24} className="text-yellow-500" /> },
    { number: 500, suffix: "+", label: "Research Papers", icon: <FileText size={24} className="text-green-500" /> }
  ];
  
  // Example instructors data
  const instructors = [
    { 
      name: " Bhumi Bhatt", 
      specialty: "Full Stack Developer & AI Enthusiast", 
      image: "/bhumi.jpg",
      publications: 43,
      students: 1248,
      bio: "Leading expert in natural language processing with 15+ years experience in academia and industry research."
    },
    { 
      name: "Megha Bhatt", 
      specialty: "Full Stack Developer & AI Enthusiast", 
      image: "/learn1.jpg",
      publications: 67,
      students: 2105,
      bio: "Award-winning educator specializing in machine learning algorithms and their applications in academic research."
    },
    { 
      name: "Ayush Thakur", 
      specialty: "Data Science & Statistics", 
      image: "/learn.jpg",
      publications: 38,
      students: 1722,
      bio: "Former lead data scientist at Google Research, focusing on statistical methods for large-scale data analysis."
    }
  ];
  
  // Features data
  const features = [
    { 
      title: "AI Grammar Checker", 
      description: "Our advanced natural language processing engine identifies complex grammatical errors, suggests style improvements, and helps perfect your academic writing style.",
      image: "/research.jpg",
      icon: <Code size={24} className="text-blue-500" />
    },
    { 
      title: "PDF Document Analysis", 
      description: "Upload research papers and our AI extracts key findings, methodologies, and citations while generating comprehensive summaries tailored to your research focus.",
      image: "/chik.jpg",
      icon: <FileText size={24} className="text-purple-500" />
    },
    { 
      title: "Realtime Collaboration", 
      description: "Seamlessly collaborate with research partners across institutions with conflict-free editing, commenting, and version control in a secure environment.",
      image: "/gogo.jpg", 
      icon: <User size={24} className="text-green-500" />
    }
  ];

  // FAQ items
  const faqItems = [
    {
      question: "How can PaperPilot improve my academic writing?",
      answer: "PaperPilot uses advanced AI to analyze your writing style, identify grammar issues, suggest improvements for clarity and flow, and ensure proper citation formatting. Our system learns from millions of academic papers to provide discipline-specific recommendations that align with publication standards in your field."
    },
    {
      question: "Can I collaborate with others on the platform?",
      answer: "Our real-time collaborative editor allows multiple researchers to work simultaneously on the same document with character-by-character synchronization. You can track changes, leave contextual comments, assign tasks, and maintain a complete version history. We support permission controls to manage access levels for different collaborators."
    },
    {
      question: "How does the PDF analyzer work?",
      answer: "Our PDF analyzer uses machine learning to extract structured information from research papers. It identifies key sections, methodologies, findings, data tables, and citations. The system then generates comprehensive summaries, highlights connections to your existing research, and identifies potential gaps or opportunities for your work."
    },
    {
      question: "Is PaperPilot suitable for different academic disciplines?",
      answer: "PaperPilot supports researchers across disciplines from humanities to hard sciences. We offer specialized tools for different fields, including STEM-specific equation editors, citation styles for over 20 disciplines, field-specific writing guidelines, and integrations with major research databases and repositories relevant to your area of study."
    }
  ];

  // Create progress bar for scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / totalScroll) * 100;
      document.documentElement.style.setProperty('--scroll-progress', `${scrolled}%`);
      
      // Header becomes sticky after hero section
      if (heroRef.current) {
        setIsHeaderSticky(window.scrollY > heroRef.current.offsetHeight - 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle horizontal scroll for instructors section
  const scroll = (direction) => {
    const container = instructorsRef.current;
    const scrollAmount = direction === "left" ? -300 : 300;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Demo user account data for interactive demo
  const [demoUser, setDemoUser] = useState({
    papers: 14,
    citations: 47,
    collaborators: 8,
    recentActivity: [
      { type: 'edit', paper: 'Neural Networks in Academic Writing', time: '2 hours ago' },
      { type: 'comment', paper: 'Climate Change Analysis', time: '1 day ago' },
      { type: 'publish', paper: 'Machine Learning Applications', time: '3 days ago' }
    ]
  });

  // Toggle dark/light mode demo
  const [isDarkMode, setIsDarkMode] = useState(false);

  // User preferences state
  const [userPreferences, setUserPreferences] = useState({
    notifications: true,
    autoSave: true,
    citations: 'APA',
    aiAssistant: true
  });

  const togglePreference = (key) => {
    setUserPreferences({
      ...userPreferences,
      [key]: !userPreferences[key]
    });
  };

  return (
    <div className={`relative w-full min-h-screen overflow-hidden ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Progress bar indicator */}
      <div className="fixed top-0 left-0 h-1 bg-blue-600 z-50" style={{ width: 'var(--scroll-progress, 0%)' }}></div>
      
      {/* Sticky header after scrolling past hero */}
      
      
      {/* Hero section sarah */}
      
      <section className="relative pt-24 pb-32 md:pt-32 md:pb-48 overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-b from-slate-50/40 to-transparent dark:from-slate-900/10 dark:to-transparent rounded-bl-full transform translate-x-1/4 -translate-y-1/4 blur-3xl"></div>
        <div className="absolute bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-purple-100/50 to-slate-100/30 dark:from-purple-900/20 dark:to-slate-900/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-slate-500/20 dark:bg-slate-400/20 rounded-full"></div>
        <div className="absolute top-1/2 right-1/3 w-6 h-6 bg-purple-500/20 dark:bg-purple-400/20 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-slate-500/20 dark:bg-slate-400/20 rounded-full animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center max-w-7xl mx-auto">
          <div className="w-full md:w-1/2 md:pr-12">
            <div className="space-y-6">
              <span className="inline-block px-4 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-full">
                Academic Research Platform
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-black leading-tight">
                Revolutionize Your Academic Research
              </h1>

              <p className="text-lg md:text-2xl text-gray-600 text-gray-300 leading-relaxed">
                PaperPilot combines AI-powered writing assistance, literature analysis, and seamless collaboration tools
                designed specifically for academic researchers.
              </p>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-2">
              <a href="#target-section">
  <button className="px-8 py-5 text-md bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 text-white font-medium rounded-full transition-all hover:scale-105 shadow-md inline-flex items-center">
    Get Started <ArrowRight size={14} className="ml-4" />
  </button>
</a>

              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 mt-12 md:mt-0">
            <div className="relative">
              {/* Floating elements around the demo */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-slate-500/10 dark:bg-slate-500/20 backdrop-blur-lg rounded-lg rotate-12 animate-pulse"></div>
              <div className="absolute -bottom-4 right-12 w-20 h-8 bg-purple-500/10 dark:bg-purple-500/20 backdrop-blur-lg rounded-lg -rotate-6"></div>
              <div className="absolute top-12 -left-6 w-16 h-16 bg-slate-300/10 dark:bg-slate-300/20 backdrop-blur-lg rounded-lg rotate-45"></div>

              {/* Editor Interface */}
              <div className="backdrop-blur-sm backdrop-filter rounded-2xl shadow-2xl overflow-hidden transform rotate-1">
                {/* Browser-like toolbar */}
                <div className="bg-gradient-to-r from-blue-50 to-gray-100 bg-white bg-blue-800 px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-center flex-1 text-sm font-medium">PaperPilot Editor</div>
                </div>

                <div className="bg-blue bg-white p-6">
                  <div className="flex items-center mb-5 space-x-2">
                    <span className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300 rounded-full font-medium">
                      Paper
                    </span>
                    <span className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium">
                      Analysis
                    </span>
                    <span className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium">
                      Citations
                    </span>
                  </div>

                  <div className="h-64 overflow-hidden text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-light">
  <h2 className="text-lg font-semibold text-gray-900 dark:text-black mb-2">
    How Paper Pilot Empowers Your Academic Journey
  </h2>
  <p className="mb-3 text-gray-900 dark:text-black">
    Paper Pilot is your AI-powered co-pilot for smarter, faster, and more accurate academic work. Designed with students and researchers in mind, it offers a seamless suite of tools that ensure precision and productivity:
  </p>
  <ol className="list-decimal text-gray-900 dark:text-black pl-5 space-y-2 mb-3">
  <li>
      <strong>Real-Time Collaboration</strong> lets you co-write and edit documents live with peers or mentors, all inside your workspace.
    </li>
    <li>
      <strong>Citation Generator</strong> produces perfectly formatted references (APA, MLA, etc.)—no stress, just click.
    </li>
    
    <li>
      <strong>AI Grammar Checker</strong> instantly refines your writing style, correcting complex grammar and enhancing clarity.
    </li>
   
  </ol>
  <p>
    With cutting-edge AI and a student-friendly design, Paper Pilot guarantees 100% accuracy, real-time efficiency, and peace of mind for your academic needs.
  </p>
</div>


                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock size={14} className="mr-1" /> Auto-saved 2 minutes ago
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle wave divider */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-16 md:h-24 lg:h-32 rotate-180"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.44,118.92,163.28,69.56,321.39,56.44Z"
            className="fill-current text-gray-50 dark:text-gray-800"
          ></path>
        </svg>
      </div>
    </section>
  
      
      {/* Stats section */}
      <section className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} py-16 relative`}>
        <div className="container mx-auto px-4" {...statsParallax}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <FadeInOnScroll key={index} delay={index * 200}>
                <div className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-xl shadow-sm p-6 border`}>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    {stat.icon}
                  </div>
                  <h3 className="text-3xl font-bold mb-2">
                    <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{stat.label}</p>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
        
        <div className={`absolute -top-1 left-0 right-0 h-8 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}></div>
      </section>
      
      {/* Features section */}
      <section id="features" ref={featuresRef} className="py-20">
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Tools for Academic Excellence</h2>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
                Our comprehensive platform integrates cutting-edge AI technologies with collaborative tools designed specifically for researchers and academics.
              </p>
            </div>
          </FadeInOnScroll>
          
          <FeatureShowcase />
          
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FadeInOnScroll key={index} delay={index * 200}>
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm p-6 border hover:shadow-md transition-shadow`}>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>{feature.description}</p>
                  <div className="rounded-lg overflow-hidden mb-4">
                    <img 
                      src={feature.image || "/placeholder.svg"} 
                      alt={feature.title}
                      className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105" 
                    />
                  </div>
                  <a href="#" className="text-blue-600 dark:text-blue-400 font-medium flex items-center hover:underline">
                    Learn more <ChevronRight size={16} className="ml-1" />
                  </a>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>
      
      {/* Instructors section */}
<section id="instructors" className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
  <div className="container mx-auto px-4">
    <FadeInOnScroll>
      <div className="text-center mb-10">
        <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Learn from Academic Experts
        </h2>
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
          Our platform is developed in collaboration with leading researchers and educators from prestigious institutions worldwide.
        </p>
      </div>
    </FadeInOnScroll>
    
    <div className="relative">
      <div 
        ref={instructorsRef}
        className="flex overflow-x-auto pb-6 hide-scrollbar snap-x snap-mandatory gap-4 px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {instructors.map((instructor, index) => (
          <div 
            key={index}
            className={`min-w-[100px] md:min-w-[100px] snap-center ${
              isDarkMode ? 'bg-gray-800 ring-1 ring-gray-700' : 'bg-white shadow-md'
            } rounded-lg overflow-hidden flex-shrink-0 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
          >
            <div className="relative h-24 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
              <div className="absolute bottom-0 left-4 transform translate-y-1/2">
                <div className={`w-16 h-16 rounded-full ${
                  isDarkMode ? 'ring-2 ring-gray-800' : 'ring-2 ring-white'
                } overflow-hidden`}>
                  <img 
                    src={instructor.image || "/placeholder.svg"} 
                    alt={instructor.name}
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </div>
            
            <div className="w-100 pt-8 pb-3 px-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {instructor.name}
                  </h3>
                  <p className="text-blue-500 text-sm font-medium">
                    {instructor.specialty}
                  </p>
                </div>
                <div className={`flex items-center ${
                  isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'
                } px-2 py-1 rounded text-xs font-medium`}>
                  {instructor.publications} Publications
                </div>
              </div>
              
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm line-clamp-3 mb-3`}>
                {instructor.bio}
              </p>
              
              <div className="flex justify-between items-center">
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {instructor.students} Students
                </div>
                <button className={`text-sm px-3 py-1 rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' 
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                } transition-colors font-medium flex items-center gap-1`}>
                  View Profile
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-6 gap-2">
        <button 
          onClick={() => scroll("left")}
          className={`w-10 h-10 rounded-full ${
            isDarkMode 
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' 
              : 'bg-white hover:bg-gray-100 text-gray-700'
          } shadow-md flex items-center justify-center transition-colors`}
          aria-label="Scroll left"
        >
          <ArrowLeft size={18} />
        </button>
        
        <button 
          onClick={() => scroll("right")}
          className={`w-10 h-10 rounded-full ${
            isDarkMode 
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' 
              : 'bg-white hover:bg-gray-100 text-gray-700'
          } shadow-md flex items-center justify-center transition-colors`}
          aria-label="Scroll right"
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  </div>
</section>

      {/* Testimonials section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Researchers Are Saying</h2>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
                Join thousands of satisfied academics who have transformed their research process with PaperPilot.
              </p>
            </div>
          </FadeInOnScroll>
          
          <TestimonialCarousel />
        </div>
      </section>
      
      {/* Interactive demo section */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience PaperPilot</h2>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
                Get a feel for how our platform can streamline your research workflow.
              </p>
            </div>
          </FadeInOnScroll>
          
          <div className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} rounded-2xl shadow-xl overflow-hidden border`}>
            <div className={`flex items-center justify-between ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'} p-4 border-b`}>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div>
                  <h4 className="font-medium">Research Dashboard</h4>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last active: Just now</p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              <div className={`lg:col-span-2 p-6 ${isDarkMode ? 'border-gray-600' : 'border-gray-100'} border-r`}>
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Research Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4`}>
                      <h4 className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Papers</h4>
                      <div className="text-2xl font-bold">{demoUser.papers}</div>
                    </div>
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4`}>
                      <h4 className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Citations</h4>
                      <div className="text-2xl font-bold">{demoUser.citations}</div>
                    </div>
                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4`}>
                      <h4 className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Collaborators</h4>
                      <div className="text-2xl font-bold">{demoUser.collaborators}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {demoUser.recentActivity.map((activity, index) => (
                      <div key={index} className={`flex items-center p-3 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg`}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mr-3">
                          {activity.type === 'edit' && <Pencil size={16} />}
                          {activity.type === 'comment' && <MessageSquare size={16} />}
                          {activity.type === 'publish' && <FileText size={16} />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.paper}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{activity.time}</p>
                        </div>
                        <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">View</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Settings</h3>
                <div className="space-y-4">
                  <div className={`flex items-center justify-between p-3 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg`}>
                    <div className="flex items-center">
                      <Bell size={18} className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span>Notifications</span>
                    </div>
                    <button 
                      onClick={() => togglePreference('notifications')}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${
                        userPreferences.notifications ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                      aria-checked={userPreferences.notifications}
                      role="switch"
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                        userPreferences.notifications ? 'translate-x-6' : ''
                      }`} />
                    </button>
                  </div>
                  
                  <div className={`flex items-center justify-between p-3 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg`}>
                    <div className="flex items-center">
                      <Save size={18} className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span>Auto-Save</span>
                    </div>
                    <button 
                      onClick={() => togglePreference('autoSave')}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${
                        userPreferences.autoSave ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                      aria-checked={userPreferences.autoSave}
                      role="switch"
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                        userPreferences.autoSave ? 'translate-x-6' : ''
                      }`} />
                    </button>
                  </div>
                  
                  <div className={`flex items-center justify-between p-3 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg`}>
                    <div className="flex items-center">
                      <FileText size={18} className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span>Citation Style</span>
                    </div>
                    <select className={`text-sm p-1 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                      <option>APA</option>
                      <option>MLA</option>
                      <option>Chicago</option>
                      <option>Harvard</option>
                    </select>
                  </div>
                  
                  <div className={`flex items-center justify-between p-3 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg`}>
                    <div className="flex items-center">
                      <Zap size={18} className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span>AI Assistant</span>
                    </div>
                    <button 
                      onClick={() => togglePreference('aiAssistant')}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${
                        userPreferences.aiAssistant ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                      aria-checked={userPreferences.aiAssistant}
                      role="switch"
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                        userPreferences.aiAssistant ? 'translate-x-6' : ''
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Roadmap section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Product Roadmap</h2>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
                We're constantly improving PaperPilot with new features and capabilities.
              </p>
            </div>
          </FadeInOnScroll>
          
          <Roadmap />
        </div>
      </section>
      
      {/* FAQ section */}
      <section id="faq" className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
                Find answers to common questions about PaperPilot.
              </p>
            </div>
          </FadeInOnScroll>
          
          <FAQAccordion faqItems={faqItems} />
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
              <FadeInOnScroll>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Research Process?</h2>
                <p className="text-lg opacity-90 mb-8">
                  Join thousands of researchers who are using PaperPilot to streamline their academic workflow and produce higher quality research.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <button className="px-8 py-3 bg-white text-blue-700 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center">
                    Start 14-Day Free Trial
                  </button>
                  <button className="px-8 py-3 border border-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    Schedule a Demo
                  </button>
                </div>
              </FadeInOnScroll>
            </div>
            
            <div className="w-full lg:w-1/2">
              <FadeInOnScroll>
                <TrialForm />
              </FadeInOnScroll>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Book size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold">PaperPilot</h3>
              </div>
              <p className="text-gray-400 mb-4">
                The complete research workflow platform for academics and researchers.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors" aria-label="Twitter">
                  <Twitter size={16} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors" aria-label="LinkedIn">
                  <Linkedin size={16} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors" aria-label="GitHub">
                  <Github size={16} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Roadmap</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Academic Partners</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500">&copy; {new Date().getFullYear()} PaperPilot. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Custom styles for scrollbar hiding and animations */}
      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        /* Custom color classes for roadmap */
        .bg-purple-100 { background-color: rgba(237, 233, 254, var(--tw-bg-opacity)); }
        .text-purple-500 { color: rgba(139, 92, 246, var(--tw-text-opacity)); }
        .text-purple-600 { color: rgba(124, 58, 237, var(--tw-text-opacity)); }
        
        .bg-blue-100 { background-color: rgba(219, 234, 254, var(--tw-bg-opacity)); }
        .text-blue-500 { color: rgba(59, 130, 246, var(--tw-text-opacity)); }
        .text-blue-600 { color: rgba(37, 99, 235, var(--tw-text-opacity)); }
        
        .bg-green-100 { background-color: rgba(209, 250, 229, var(--tw-bg-opacity)); }
        .text-green-500 { color: rgba(16, 185, 129, var(--tw-text-opacity)); }
        .text-green-600 { color: rgba(5, 150, 105, var(--tw-text-opacity)); }
        
        .bg-yellow-100 { background-color: rgba(254, 243, 199, var(--tw-bg-opacity)); }
        .text-yellow-500 { color: rgba(245, 158, 11, var(--tw-text-opacity)); }
        .text-yellow-600 { color: rgba(217, 119, 6, var(--tw-text-opacity)); }
        
        .bg-red-100 { background-color: rgba(254, 226, 226, var(--tw-bg-opacity)); }
        .text-red-500 { color: rgba(239, 68, 68, var(--tw-text-opacity)); }
        .text-red-600 { color: rgba(220, 38, 38, var(--tw-text-opacity)); }
        
        /* Dark mode overrides */
        .dark .bg-purple-100 { background-color: rgba(91, 33, 182, 0.2); }
        .dark .bg-blue-100 { background-color: rgba(29, 78, 216, 0.2); }
        .dark .bg-green-100 { background-color: rgba(4, 120, 87, 0.2); }
        .dark .bg-yellow-100 { background-color: rgba(180, 83, 9, 0.2); }
        .dark .bg-red-100 { background-color: rgba(185, 28, 28, 0.2); }
      `}</style>
    </div>
  );
};

export default About;
