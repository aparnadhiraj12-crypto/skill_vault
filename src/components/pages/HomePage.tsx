// HPI 1.6-V
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle2, Zap, Shield, TrendingUp, AlertTriangle, Clock, BarChart3 } from 'lucide-react';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// --- Types & Interfaces ---

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  image: string;
}

interface Stat {
  value: string;
  label: string;
  subtext: string;
}

interface ProcessStep {
  step: string;
  title: string;
  description: string;
  color: string;
}

// --- Canonical Data Sources ---

const FEATURES: Feature[] = [
  {
    id: 'retail-reviewer',
    title: 'Retail Reviewer',
    description: 'Simulate how retail compliance teams will evaluate your creative against strict guidelines.',
    icon: Shield,
    color: 'text-brightblue',
    image: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=feature-retail-reviewer'
  },
  {
    id: 'real-placement',
    title: 'Real Placement',
    description: 'Preview your ad in actual retail placement contexts to ensure perfect visibility and fit.',
    icon: Zap,
    color: 'text-limegreen',
    image: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=feature-real-placement'
  },
  {
    id: 'attention-heatmap',
    title: 'Attention Heatmap',
    description: 'Visualize where viewers focus on your creative using predictive AI eye-tracking models.',
    icon: TrendingUp,
    color: 'text-pastelpink',
    image: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=feature-heatmap'
  },
  {
    id: 'risk-score',
    title: 'Risk Score',
    description: 'Get comprehensive confidence ratings and risk analysis before you hit submit.',
    icon: CheckCircle2,
    color: 'text-softgray',
    image: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=feature-risk-score'
  },
];

const STATS: Stat[] = [
  {
    value: '47%',
    label: 'Rejection Rate',
    subtext: 'Average first-submission failure across major retailers.'
  },
  {
    value: '5d',
    label: 'Average Delay',
    subtext: 'Time lost per rejection in review cycles and revisions.'
  }
];

const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Upload & Select',
    description: 'Upload your creative assets and select the specific retailer and placement context.',
    color: 'text-limegreen'
  },
  {
    step: '02',
    title: 'Simulate & Analyze',
    description: 'Run our multi-modal simulation engine to stress-test your creative against real-world constraints.',
    color: 'text-brightblue'
  },
  {
    step: '03',
    title: 'Fix & Export',
    description: 'Apply AI-driven optimization suggestions and export your certified validation report.',
    color: 'text-pastelpink'
  }
];

// --- Utility Components ---

const AnimatedElement: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          element.classList.add('is-visible');
        }, delay);
        observer.unobserve(element);
      }
    }, { threshold: 0.1 });

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay]);

  return <div ref={ref} className={`animate-reveal ${className || ''}`}>{children}</div>;
};

const ParallaxImage: React.FC<{ src: string; alt: string; className?: string; speed?: number }> = ({ src, alt, className, speed = 0.5 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="w-full h-[120%] -mt-[10%]">
        <Image src={src} alt={alt} width={1200} className="w-full h-full object-cover" />
      </motion.div>
    </div>
  );
};

const Marquee: React.FC<{ children: React.ReactNode; direction?: 'left' | 'right' }> = ({ children, direction = 'left' }) => {
  return (
    <div className="flex overflow-hidden whitespace-nowrap py-4 select-none bg-secondary/10 border-y border-secondary/20">
      <motion.div
        className="flex gap-12 items-center"
        animate={{ x: direction === 'left' ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
      >
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
};

// --- Main Page Component ---

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={containerRef} className="min-h-screen bg-primary text-primary-foreground font-paragraph selection:bg-limegreen selection:text-primary overflow-clip">
      <style>{`
        .animate-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .text-stroke {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
          color: transparent;
        }
        .text-stroke-hover:hover {
          -webkit-text-stroke: 0px;
          color: #CFFF00;
        }
        .grain-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 50;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}</style>

      <div className="grain-overlay" />
      
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-limegreen z-[100] origin-left"
        style={{ scaleX }}
      />

      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-screen flex flex-col justify-between pt-20 pb-10 overflow-hidden">
        {/* Background Gradient Mesh */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-limegreen/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10s]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-secondary/30 rounded-full blur-[100px] mix-blend-screen" />
          <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] bg-brightblue/20 rounded-full blur-[80px] mix-blend-screen" />
        </div>

        {/* Top Bar - Inspired by Image */}
        <div className="relative z-10 w-full border-y border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-[120rem] mx-auto px-6 py-2 flex justify-between items-center text-xs font-mono tracking-widest text-softgray/80 uppercase">
            <span>[ SYSTEM ONLINE ]</span>
            <span className="hidden md:inline">[ RETAIL VALIDATION PROTOCOL v2.0 ]</span>
            <span>2025</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex-grow flex flex-col justify-center px-6 max-w-[120rem] mx-auto w-full">
          <AnimatedElement>
            <h1 className="font-heading text-[12vw] leading-[0.85] font-black tracking-tighter text-white mix-blend-overlay opacity-50 select-none pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center whitespace-nowrap">
              VALIDATE
            </h1>
          </AnimatedElement>

          <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <AnimatedElement delay={200}>
                <h2 className="font-heading text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] mb-8">
                  365 days of <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-limegreen via-white to-brightblue">
                    pushing boundaries
                  </span>
                </h2>
              </AnimatedElement>
              
              <AnimatedElement delay={400}>
                <p className="font-paragraph text-xl md:text-2xl text-softgray max-w-2xl leading-relaxed mb-12 border-l-2 border-limegreen pl-6">
                  Simulate retail ad creatives in real environments. Get instant feedback. Eliminate rejections before they happen.
                </p>
              </AnimatedElement>

              <AnimatedElement delay={600}>
                <div className="flex flex-wrap gap-6">
                  <Link
                    to="/upload"
                    className="group relative px-8 py-4 bg-limegreen text-black font-heading font-bold text-lg tracking-wide overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      START VALIDATING <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
                  </Link>
                  <a
                    href="#learn-more"
                    className="px-8 py-4 border border-white/30 text-white font-heading font-bold text-lg tracking-wide hover:bg-white/10 transition-colors"
                  >
                    LEARN MORE
                  </a>
                </div>
              </AnimatedElement>
            </div>

            <div className="lg:col-span-4 hidden lg:block">
               <AnimatedElement delay={800}>
                 <div className="relative aspect-[3/4] w-full max-w-md ml-auto border border-white/10 p-2 bg-white/5 backdrop-blur-sm rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="absolute top-4 left-4 z-20 bg-black/80 px-3 py-1 text-xs font-mono text-limegreen border border-limegreen/30">
                      SIMULATION_PREVIEW.JPG
                    </div>
                    <Image 
                      src="https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=hero-preview" 
                      alt="Simulation Preview" 
                      width={600} 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                 </div>
               </AnimatedElement>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full px-6 pb-6 flex justify-between items-end">
           <div className="text-xs font-mono text-softgray/50 max-w-[200px]">
             SCROLL TO EXPLORE THE PLATFORM
           </div>
           <div className="animate-bounce text-limegreen">
             ↓
           </div>
        </div>
      </section>

      {/* --- MARQUEE DIVIDER --- */}
      <section className="py-12 bg-black border-y border-white/10">
        <Marquee>
          <span className="text-4xl md:text-6xl font-heading font-black text-stroke px-8">NO MORE REJECTIONS</span>
          <span className="text-4xl md:text-6xl font-heading font-black text-white px-8">INSTANT FEEDBACK</span>
          <span className="text-4xl md:text-6xl font-heading font-black text-stroke px-8">RETAIL COMPLIANCE</span>
          <span className="text-4xl md:text-6xl font-heading font-black text-limegreen px-8">AI POWERED</span>
        </Marquee>
      </section>

      {/* --- PROBLEM SECTION --- */}
      <section id="learn-more" className="relative w-full py-32 bg-primary overflow-hidden">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            
            {/* Left: The Narrative */}
            <div className="relative">
              <div className="sticky top-32">
                <AnimatedElement>
                  <span className="inline-block px-3 py-1 mb-6 border border-destructive/50 text-destructive font-mono text-xs tracking-widest uppercase bg-destructive/10">
                    The Challenge
                  </span>
                </AnimatedElement>
                
                <AnimatedElement delay={200}>
                  <h2 className="font-heading text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
                    Creative Rejections <br />
                    <span className="text-destructive">Cost Everything.</span>
                  </h2>
                </AnimatedElement>

                <AnimatedElement delay={300}>
                  <p className="font-paragraph text-xl text-softgray mb-12 leading-relaxed max-w-xl">
                    Every rejected ad creative means delays, lost revenue, and frustrated teams. Retailers have strict requirements, and one small mistake can derail your entire campaign.
                  </p>
                </AnimatedElement>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {STATS.map((stat, idx) => (
                    <AnimatedElement key={idx} delay={400 + (idx * 100)}>
                      <div className="border-l-4 border-destructive pl-6 py-2 bg-gradient-to-r from-destructive/5 to-transparent">
                        <div className="font-heading text-6xl font-black text-white mb-2">{stat.value}</div>
                        <div className="font-heading text-lg font-bold text-destructive mb-1">{stat.label}</div>
                        <p className="font-paragraph text-sm text-softgray/70">{stat.subtext}</p>
                      </div>
                    </AnimatedElement>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Visual Evidence */}
            <div className="relative flex flex-col gap-12">
              <AnimatedElement className="w-full aspect-video bg-white/5 border border-white/10 p-1 relative overflow-hidden group">
                <div className="absolute inset-0 bg-destructive/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute top-4 right-4 z-20 bg-destructive text-white px-4 py-2 font-bold font-heading uppercase tracking-wider">
                  REJECTED
                </div>
                <Image 
                  src="https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=rejected-example-1" 
                  alt="Rejected Creative Example" 
                  width={800} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0"
                />
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent z-20">
                  <p className="font-mono text-xs text-destructive">ERROR: TEXT_OVERFLOW_SAFE_ZONE</p>
                </div>
              </AnimatedElement>

              <AnimatedElement delay={200} className="w-full aspect-video bg-white/5 border border-white/10 p-1 relative overflow-hidden group translate-x-8">
                <div className="absolute inset-0 bg-destructive/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute top-4 right-4 z-20 bg-destructive text-white px-4 py-2 font-bold font-heading uppercase tracking-wider">
                  REJECTED
                </div>
                <Image 
                  src="https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=rejected-example-2" 
                  alt="Rejected Creative Example" 
                  width={800} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0"
                />
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent z-20">
                  <p className="font-mono text-xs text-destructive">ERROR: CONTRAST_RATIO_FAIL</p>
                </div>
              </AnimatedElement>
            </div>

          </div>
        </div>
      </section>

      {/* --- SOLUTION SECTION (Horizontal Scroll) --- */}
      <section className="relative bg-secondary/5 border-t border-white/10">
        <div className="max-w-[120rem] mx-auto px-6 py-24">
          <div className="mb-24 text-center">
            <AnimatedElement>
              <span className="font-mono text-limegreen text-sm tracking-[0.2em] uppercase">The Solution</span>
            </AnimatedElement>
            <AnimatedElement delay={100}>
              <h2 className="font-heading text-5xl md:text-8xl font-black text-white mt-4 mb-6">
                SIMULATE. <span className="text-stroke text-white/20">VALIDATE.</span>
              </h2>
            </AnimatedElement>
            <AnimatedElement delay={200}>
              <p className="text-xl text-softgray max-w-2xl mx-auto">
                Test your creatives in real retail environments before submission. Get instant AI-powered feedback.
              </p>
            </AnimatedElement>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feature, index) => (
              <AnimatedElement key={feature.id} delay={index * 100} className="group relative h-[500px] border border-white/10 bg-black overflow-hidden hover:border-white/30 transition-colors">
                {/* Background Image with Parallax Effect on Hover */}
                <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
                  <Image 
                    src={feature.image} 
                    alt={feature.title} 
                    width={800} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className={`w-16 h-16 mb-6 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  
                  <h3 className="font-heading text-3xl font-bold text-white mb-3 group-hover:text-limegreen transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="font-paragraph text-softgray text-lg leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    {feature.description}
                  </p>

                  <div className="mt-6 w-full h-[1px] bg-white/20 overflow-hidden">
                    <div className="w-full h-full bg-limegreen transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  </div>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* --- PROCESS SECTION --- */}
      <section className="w-full py-32 bg-black relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        
        <div className="max-w-[100rem] mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <AnimatedElement>
              <h2 className="font-heading text-4xl md:text-6xl font-black text-white">
                SYSTEM WORKFLOW
              </h2>
            </AnimatedElement>
          </div>

          <div className="space-y-32">
            {PROCESS_STEPS.map((step, index) => (
              <div key={index} className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Text Side */}
                <div className="flex-1 text-center md:text-left">
                  <AnimatedElement>
                    <div className={`font-heading text-9xl font-black ${step.color} opacity-20 leading-none -mb-10 relative z-0`}>
                      {step.step}
                    </div>
                    <h3 className="relative z-10 font-heading text-4xl font-bold text-white mb-4">
                      {step.title}
                    </h3>
                    <p className="relative z-10 font-paragraph text-xl text-softgray max-w-md mx-auto md:mx-0">
                      {step.description}
                    </p>
                  </AnimatedElement>
                </div>

                {/* Center Marker */}
                <div className="relative flex items-center justify-center w-12 h-12 shrink-0">
                  <div className={`w-4 h-4 rounded-full ${step.color.replace('text-', 'bg-')} shadow-[0_0_20px_currentColor]`} />
                  <div className="absolute w-12 h-12 border border-white/20 rounded-full animate-ping opacity-20" />
                </div>

                {/* Visual Side */}
                <div className="flex-1">
                  <AnimatedElement delay={200} className="relative aspect-square max-w-md mx-auto bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/50" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/50" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/50" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/50" />
                    
                    <Image 
                      src={`https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=process-step-${index + 1}`}
                      alt={`Process Step ${step.step}`}
                      width={600}
                      className="w-full h-full object-cover opacity-80"
                    />
                  </AnimatedElement>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="relative w-full py-40 bg-limegreen overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-multiply" />
        
        <div className="max-w-[100rem] mx-auto px-6 text-center relative z-10">
          <AnimatedElement>
            <h2 className="font-heading text-6xl md:text-9xl font-black text-black mb-8 tracking-tighter leading-[0.9]">
              READY TO <br />
              ELIMINATE REJECTIONS?
            </h2>
          </AnimatedElement>
          
          <AnimatedElement delay={200}>
            <p className="font-paragraph text-2xl text-black/80 mb-12 max-w-3xl mx-auto font-medium">
              Join hundreds of brands validating their creatives before submission.
              Stop guessing. Start validating.
            </p>
          </AnimatedElement>
          
          <AnimatedElement delay={400}>
            <Link
              to="/upload"
              className="inline-flex items-center gap-4 bg-black text-white font-heading text-2xl font-bold px-16 py-8 hover:bg-secondary hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              GET STARTED NOW
              <ArrowRight className="w-8 h-8" />
            </Link>
          </AnimatedElement>
        </div>

        {/* Decorative Big Text */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden opacity-10 pointer-events-none">
          <div className="font-heading text-[20vw] font-black text-black leading-none whitespace-nowrap transform translate-y-1/3">
            VALIDATE NOW
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}