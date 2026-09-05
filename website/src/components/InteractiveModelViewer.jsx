import React, { useState } from 'react';
import ModelViewer from './ModelViewer';

const componentsInfo = {
  solar: {
    title: "Solar Energy System",
    desc: "Generates electrical energy whenever sufficient sunlight is available. Extremely reliable with no moving parts.",
    tech: "Marine-grade solar panels, MPPT Controller."
  },
  electronics: {
    title: "Central Electronics",
    desc: "Waterproof internal compartment housing the computing and control architecture.",
    tech: "Raspberry Pi (processing), ESP32 (control/sensor interfacing), MPPT, Hydro-Controller, Rectifier, Power Management System."
  },
  battery: {
    title: "Battery & Power Management",
    desc: "Stores generated energy. The Power Management System distributes power between computing, sensors, and communication.",
    tech: "LiFePO4 Battery, Smart BMS."
  },
  mast: {
    title: "Communication Mast",
    desc: "Contains the external communication and navigation equipment to transmit data to a remote station.",
    tech: "GPS/GNSS, Communication antenna, Atmospheric sensors."
  },
  sensors: {
    title: "Underwater Sensor Keel",
    desc: "Modular keel carrying six scientific instruments into the water. If one sensor needs maintenance, the entire platform doesn't need to be rebuilt.",
    tech: "Sensors: Temp, Salinity, pH, DO, Turbidity, Pressure/Depth."
  },
  turbine: {
    title: "Underwater Vertical-Axis Turbine",
    desc: "Supplementary energy source harvesting energy from suitable ocean currents, particularly useful when solar availability is limited (e.g. polar winter).",
    tech: "Curved rotor blades, vertical shaft, generator, bearings, waterproof seal."
  }
};

export default function InteractiveModelViewer() {
  const [isExploded, setIsExploded] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);

  const currentModel = isExploded ? '/models/samudrax-exploded-v8.glb' : '/models/samudrax-complete-v8.glb';

  return (
    <div className="interactive-viewer glass-panel">
      
      {/* 3D Canvas Area */}
      <div className="canvas-container">
        <ModelViewer 
          url={currentModel} 
          width="100%"
          height="100%"
          autoRotate={!activeComponent} 
          defaultZoom={isExploded ? 0.5 : 3}
          defaultRotationX={isExploded ? -10 : -25}
          defaultRotationY={0}
          modelYOffset={isExploded ? 0.1 : 0.25}
          scaleMultiplier={isExploded ? 8 : 1}
          enableManualZoom={true}
          enableManualRotation={true}
          enableMouseParallax={false}
          animateTurbine={true}
        />
        
        {/* Toggle Button */}
        <div className="toggle-container">
          <button 
            className={`toggle-btn ${!isExploded ? 'active' : ''}`}
            onClick={() => setIsExploded(false)}
          >
            Assembled
          </button>
          <button 
            className={`toggle-btn ${isExploded ? 'active' : ''}`}
            onClick={() => setIsExploded(true)}
          >
            Exploded View
          </button>
        </div>
      </div>

      {/* Sidebar Controls & Info */}
      <div className="sidebar">
        <h3>Platform Anatomy</h3>
        <p>Select a component to view technical details.</p>
        
        <div className="hotspot-buttons">
          {Object.entries(componentsInfo).map(([key, info]) => (
            <button 
              key={key}
              className={`hotspot-btn ${activeComponent === key ? 'active' : ''}`}
              onClick={() => setActiveComponent(activeComponent === key ? null : key)}
            >
              {info.title}
            </button>
          ))}
        </div>

        {activeComponent && (
          <div className="info-panel glass-panel">
            <h4>{componentsInfo[activeComponent].title}</h4>
            <p>{componentsInfo[activeComponent].desc}</p>
            <div className="tech-spec">
              <strong>Components:</strong> {componentsInfo[activeComponent].tech}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
