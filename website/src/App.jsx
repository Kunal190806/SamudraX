import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, BatteryCharging, Wifi, Anchor, Droplets, Sun, Waves, Layers, Cpu, ShieldAlert, Navigation, Menu, X } from 'lucide-react';
import InteractiveModelViewer from './components/InteractiveModelViewer';
import ModelViewer from './components/ModelViewer';
import ScrollExplodeViewer from './components/ScrollExplodeViewer';
import MoltenMetal from './components/MoltenMetal';
import './App.css';

const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.05 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-brand" style={{ color: 'white' }}>SAMUDRA<span style={{ color: '#ff2a2a' }}>X</span></div>
        <div className="nav-links desktop-only">
          <a href="#challenge">The Challenge</a>
          <a href="#solution">Architecture</a>
          <a href="#energy">Hybrid Energy</a>
          <a href="#anatomy">Platform Anatomy</a>
          <a href="#demo">Technical Demo</a>
        </div>
        <button
          className="nav-toggle mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <a href="#challenge" onClick={() => setMobileMenuOpen(false)}>The Challenge</a>
          <a href="#solution" onClick={() => setMobileMenuOpen(false)}>Architecture</a>
          <a href="#energy" onClick={() => setMobileMenuOpen(false)}>Hybrid Energy</a>
          <a href="#anatomy" onClick={() => setMobileMenuOpen(false)}>Platform Anatomy</a>
          <a href="#demo" onClick={() => setMobileMenuOpen(false)}>Technical Demo</a>
        </div>
      )}

      {/* Hero Section — 280vh so user can scroll through explosion while it stays sticky */}
      <section
        className="hero"
        ref={heroRef}
        style={{ height: '280vh', overflow: 'visible', position: 'relative' }}
      >
        {/* Sticky visual frame — stays in viewport while parent scrolls */}
        <div style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}>
          {/* Background */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
            <MoltenMetal
              color1="#051024"
              color2="#0070fe"
              color3="#00e5ff"
              speed={0.15}
              scale={2}
              detail={3}
              glow={1.2}
              coreSize={0.15}
              swirl={1}
              fold={-0.1}
              brightness={0.8}
              mouseInteraction={true}
              opacity={0.6}
            />
          </div>
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-badge"
            >
              <span className="badge-dot" />
              <span>SIH 2024 • AUTONOMOUS POLAR OBSERVATION</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              <span style={{ color: 'white' }}>SAMUDRA</span><span style={{ color: '#ff2a2a' }}>X</span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.3 }}
            >
              Autonomous Low-Cost Ocean Observation Platform for Polar & Southern Oceans
            </motion.h2>

            <motion.div
              className="hero-specs-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5 }}
            >
              <div className="hero-spec-pill">
                <Sun size={14} className="text-cyan" />
                <span>Dual Solar + Hydrokinetic</span>
              </div>
              <div className="hero-spec-pill">
                <Waves size={14} className="text-cyan" />
                <span>Sub-Zero Composite Hull</span>
              </div>
              <div className="hero-spec-pill">
                <Wifi size={14} className="text-cyan" />
                <span>Satellite Telemetry</span>
              </div>
              <div className="hero-spec-pill">
                <Droplets size={14} className="text-cyan" />
                <span>6-Parameter Modular Keel</span>
              </div>
            </motion.div>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.7 }}
            >
              <a href="#anatomy" className="cta-button primary">
                Explore Hardware Anatomy
              </a>
              <a href="#demo" className="cta-button secondary">
                Watch Technical Demo
              </a>
            </motion.div>

            <motion.div
              className="scroll-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <span className="scroll-arrow">↓</span>
              <span>SCROLL TO DISASSEMBLE PLATFORM</span>
            </motion.div>
          </div>

          <div className="hero-model-container">
            <ScrollExplodeViewer
              assembledUrl="/models/samudrax-complete-v8.glb"
              explodedUrl="/models/samudrax-exploded-v8.glb"
              sectionRef={heroRef}
              width="100%"
              height="100vh"
              autoRotate={true}
              defaultZoom={3.6}
              modelYOffset={0.08}
              explodedZoom={5.8}
              explodedYOffset={0.25}
              turbineYOffset={0.15}
              defaultRotationX={-15}
              defaultRotationY={0}
              enableMouseParallax={true}
              enableManualZoom={false}
              animateTurbine={true}
            />
          </div>
        </div>
      </section>

      {/* The Challenge */}
      <section id="challenge">
        <FadeIn>
          <div className="content-grid">
            <div className="content-text">
              <h3>The Challenge of <span className="text-cyan">Polar Observation</span></h3>
              <p>
                The Polar and Southern Oceans are critical regulators of global climate, yet they remain severely under-observed. 
                Traditional research vessels are expensive and limited in deployment windows. Existing autonomous floats lack continuous multi-parameter sensing capabilities or rely entirely on solar energy, which fails during extended polar nights.
              </p>
              <p>
                <strong>Polar regions experience extreme seasonal variation.</strong> During polar summer, there are long periods of daylight. During polar winter, sunlight becomes extremely limited. A resilient, low-cost, continuous observation platform that can adapt to these conditions is essential.
              </p>
            </div>
            <div className="cards-grid">
              <div className="card glass-panel">
                <Waves className="card-icon" size={32} />
                <h4>Harsh Conditions</h4>
                <p>Extreme cold, high winds, and sea ice.</p>
              </div>
              <div className="card glass-panel">
                <BatteryCharging className="card-icon" size={32} />
                <h4>Variable Energy</h4>
                <p>Months without sufficient solar generation during polar winters.</p>
              </div>
              <div className="card glass-panel">
                <Anchor className="card-icon" size={32} />
                <h4>Remote Access</h4>
                <p>Prohibits frequent maintenance missions; requires high autonomy.</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Our Solution & Architecture */}
      <section id="solution" style={{ background: 'rgba(0, 112, 254, 0.05)' }}>
        <FadeIn>
          <div className="content-grid">
            <div className="cards-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="card glass-panel">
                <ShieldAlert className="card-icon" size={24} />
                <h4>Octagonal Hull</h4>
                <p>Provides immense stability, a large surface for solar panels, and keeps the center of gravity low. Designed as a continuous waterproof marine-composite structure.</p>
              </div>
              <div className="card glass-panel">
                <Cpu className="card-icon" size={24} />
                <h4>Central Electronics</h4>
                <p>Raspberry Pi for high-level data processing, ESP32 for embedded sensor control, housed in a waterproof internal compartment.</p>
              </div>
              <div className="card glass-panel">
                <Navigation className="card-icon" size={24} />
                <h4>Communication Mast</h4>
                <p>Elevated GPS/GNSS and Satellite/Radio antennas to communicate measurements to a remote station when available.</p>
              </div>
              <div className="card glass-panel">
                <BatteryCharging className="card-icon" size={24} />
                <h4>Power Management</h4>
                <p>Distributes power intelligently between computing, sensors, communication, and energy systems.</p>
              </div>
            </div>
            <div className="content-text">
              <h3>System <span className="text-cyan">Architecture</span></h3>
              <p>
                SamudraX is a fully autonomous observation platform that seamlessly integrates a modular underwater sensor array, robust onboard processing, satellite communication, and a dual-source energy harvesting system.
              </p>
              <p>
                Instead of looking like several cylinders stacked together, the main body is a continuous waterproof structure with structural frames, protective rubber bumpers, and precise cable glands ensuring survivability in harsh oceans.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Hybrid Energy */}
      <section id="energy">
        <FadeIn>
          <div className="content-grid" style={{ alignItems: 'start' }}>
            {/* Left: text + diagram */}
            <div className="content-text">
              <h3>Hybrid <span className="text-cyan">Energy Architecture</span></h3>
              <p>
                SamudraX uses a hybrid energy architecture because renewable energy availability varies with location and season. <strong>Solar energy is highly useful when sufficient sunlight is available</strong>, while the <strong>underwater current-energy harvesting system provides a supplementary energy source</strong> when suitable ocean currents are present, particularly during periods when solar availability is limited.
              </p>
              <p>
                The turbine is not a direct replacement for solar, nor is it restricted only to the North. The system can intelligently choose and use available energy sources depending on environmental conditions.
              </p>
              <div className="glass-panel flowchart-box" style={{ padding: '1.25rem', marginTop: '1.5rem', fontFamily: 'monospace', fontSize: '0.82rem', lineHeight: '1.7', whiteSpace: 'pre', overflowX: 'auto', maxWidth: '100%' }}>
{`       ☀️ SUNLIGHT             🌊 OCEAN CURRENT
           ↓                          ↓
    SOLAR PANELS                VAWT TURBINE
           ↓                          ↓
    MPPT CONTROLLER               GENERATOR
           ↓                          ↓
           │                      RECTIFIER
           │                          ↓
           │                HYDRO CHARGE CONTROL
           │                          ↓
           └───────────┐  ┌───────────┘
                       ↓  ↓
                  ┌──────────┐
                  │ BATTERY  │
                  └──────────┘
                       ↓
               POWER MANAGEMENT
                       ↓
         ┌─────────────┼─────────────┐
         ↓             ↓             ↓
      SENSORS      COMPUTING   COMMUNICATION`}
              </div>
            </div>

            {/* Right: exploded model with labels */}
            <div className="exploded-viewer-container" style={{ position: 'relative', width: '100%', height: '680px' }}>
              <ModelViewer
                url="/models/samudrax-exploded-v8.glb"
                width="100%"
                height="680px"
                autoRotate={false}
                defaultZoom={5.2}
                defaultRotationX={-10}
                defaultRotationY={0}
                modelYOffset={0.02}
                enableManualZoom={false}
                animateTurbine={true}
              />
              {/* Component Interactive Callout Labels */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                {[
                  { top: '8%',  left: '52%', side: 'right', title: 'Atmospheric Sensors', sub: 'GPS / GNSS & Weather Mast' },
                  { top: '21%', left: '55%', side: 'right', title: 'Integrated Solar Panels', sub: 'Marine Monocrystalline Deck' },
                  { top: '32%', left: '55%', side: 'right', title: 'Waterproof Electronics', sub: 'RPi + ESP32 Control Bay' },
                  { top: '43%', left: '2%',  side: 'left',  title: 'Main Floating Hull', sub: 'Octagonal Marine Composite' },
                  { top: '53%', left: '4%',  side: 'left',  title: 'LiFePO4 Battery Pack', sub: 'Smart BMS Energy Storage' },
                  { top: '65%', left: '55%', side: 'right', title: 'Hydrokinetic Turbine', sub: '3-Blade Submerged Harvester' },
                  { top: '77%', left: '56%', side: 'right', title: 'Protective Sensor Cage', sub: 'High-Impact Keel Guard' },
                  { top: '89%', left: '2%',  side: 'left',  title: 'Underwater Sensors', sub: '6-Parameter Scientific Probe' },
                ].map((item) => (
                  <div
                    key={item.title}
                    style={{
                      position: 'absolute',
                      top: item.top,
                      left: item.left,
                      transform: 'translateY(-50%)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      zIndex: 10,
                    }}
                  >
                    {item.side === 'left' && (
                      <>
                        <div className="callout-card left-align">
                          <span className="callout-title">{item.title}</span>
                          <span className="callout-sub">{item.sub}</span>
                        </div>
                        <div className="callout-line left-line" />
                        <div className="callout-pin" />
                      </>
                    )}
                    {item.side === 'right' && (
                      <>
                        <div className="callout-pin" />
                        <div className="callout-line right-line" />
                        <div className="callout-card">
                          <span className="callout-title">{item.title}</span>
                          <span className="callout-sub">{item.sub}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Underwater Sensors */}
      <section id="sensors" style={{ background: 'rgba(0, 112, 254, 0.05)' }}>
        <FadeIn>
          <div className="content-grid">
            <div className="cards-grid">
              <div className="card glass-panel">
                <Droplets className="card-icon" size={24} />
                <h4>Temp & Salinity</h4>
                <p>Water temperature and conductivity tracking thermohaline circulation.</p>
              </div>
              <div className="card glass-panel">
                <Activity className="card-icon" size={24} />
                <h4>pH & DO</h4>
                <p>Acidity/alkalinity and Dissolved Oxygen concentration.</p>
              </div>
              <div className="card glass-panel">
                <Layers className="card-icon" size={24} />
                <h4>Turbidity & Depth</h4>
                <p>Water clarity/particles and hydrostatic pressure.</p>
              </div>
            </div>
            <div className="content-text">
              <h3>Modular <span className="text-cyan">Sensor Array</span></h3>
              <p>
                Underneath SamudraX is the modular sensor keel. It carries the scientific instruments safely into the water, continuously collecting oceanographic information.
              </p>
              <p>
                The most important design idea is <strong>modularity</strong>. If one sensor needs maintenance or replacement, the entire platform does not need to be rebuilt.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Technical Demonstration */}
      <section id="demo">
        <FadeIn>
          <div style={{ textAlign: 'center' }}>
            <h3>Technical <span className="text-cyan">Demonstration</span></h3>
            <p>Watch the SAMUDRAX render — deployment, submerged turbine operation, and full platform overview.</p>
            
            <div style={{ marginTop: '2.5rem', maxWidth: '900px', margin: '2.5rem auto 0 auto' }}>
              <h4 style={{ marginBottom: '1rem', textAlign: 'left' }}>Platform Render — Turbine Operation</h4>
              <div className="video-container" style={{ margin: 0 }}>
                <video 
                  controls 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  src="/videos/Turbine.mp4"
                  style={{ width: '100%', display: 'block', borderRadius: '8px' }}
                />
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Platform Anatomy (Interactive 3D) */}
      <section id="anatomy">
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3>Platform <span className="text-cyan">Anatomy</span> & Engineering</h3>
            <p>Interact with the 3D model below to explore the internal hardware and subsystems.</p>
          </div>
          <InteractiveModelViewer />
        </FadeIn>
      </section>

      {/* Why SAMUDRAX */}
      <section id="why" style={{ textAlign: 'center', background: 'rgba(0, 112, 254, 0.05)' }}>
        <FadeIn>
          <h3>Why <span style={{ color: 'white' }}>SAMUDRA</span><span style={{ color: '#ff2a2a' }}>X</span>?</h3>
          <p style={{ maxWidth: '700px', margin: '2rem auto' }}>
            By combining COTS (Commercial Off-The-Shelf) microcontrollers, modular components, and hybrid energy harvesting, SAMUDRAX dramatically lowers the cost barrier for persistent ocean observation. 
          </p>
          <p style={{ maxWidth: '700px', margin: '0 auto 3rem auto' }}>
            It is an open-architecture, highly resilient platform capable of providing critical climate data from the world's most inaccessible waters.
          </p>
        </FadeIn>
      </section>

      <footer>
        <p>Built for the Smart India Hackathon (SIH).</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.5 }}>SAMUDRAX Ocean Observation System</p>
      </footer>
    </div>
  );
}

export default App;
