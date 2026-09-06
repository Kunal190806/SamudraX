import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Waves, BatteryCharging, Zap, Cpu, Activity, Wifi } from 'lucide-react';
import './EnergyFlowchart.css';

const FlowNode = ({ icon: Icon, title, subtitle, color, delay }) => (
  <motion.div
    className="flow-node glass-panel"
    style={{ borderColor: `rgba(${color}, 0.3)`, boxShadow: `0 4px 20px rgba(${color}, 0.1)` }}
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="node-icon" style={{ color: `rgb(${color})`, background: `rgba(${color}, 0.1)` }}>
      <Icon size={24} />
    </div>
    <div className="node-content">
      <h4>{title}</h4>
      <span>{subtitle}</span>
    </div>
  </motion.div>
);

const FlowLine = ({ delay }) => (
  <motion.div
    className="flow-line"
    initial={{ scaleY: 0, opacity: 0 }}
    whileInView={{ scaleY: 1, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay }}
  />
);

const HorizontalLine = ({ delay }) => (
  <motion.div
    className="flow-line-h"
    initial={{ scaleX: 0, opacity: 0 }}
    whileInView={{ scaleX: 1, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay }}
  />
);

export default function EnergyFlowchart() {
  return (
    <div className="energy-flowchart">
      {/* Sources */}
      <div className="flow-row">
        <div className="flow-col">
          <FlowNode icon={Sun} title="Solar Panels" subtitle="Marine Monocrystalline" color="255, 170, 0" delay={0.1} />
          <FlowLine delay={0.3} />
          <FlowNode icon={Zap} title="MPPT Controller" subtitle="Max Power Point Tracking" color="255, 170, 0" delay={0.4} />
        </div>
        
        <div className="flow-col">
          <FlowNode icon={Waves} title="VAWT Turbine" subtitle="Hydrokinetic Harvester" color="0, 229, 255" delay={0.2} />
          <FlowLine delay={0.4} />
          <FlowNode icon={Activity} title="Rectifier / Charge Control" subtitle="AC to DC Conversion" color="0, 229, 255" delay={0.5} />
        </div>
      </div>

      {/* Junction */}
      <div className="flow-junction">
        <div className="junction-lines">
          <div className="j-left"><HorizontalLine delay={0.6} /></div>
          <div className="j-right"><HorizontalLine delay={0.6} /></div>
          <div className="j-center"><FlowLine delay={0.7} /></div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <FlowNode icon={BatteryCharging} title="Battery Storage" subtitle="LiFePO4 + Smart BMS" color="74, 222, 128" delay={0.8} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '-5px 0' }}>
         <FlowLine delay={0.9} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <FlowNode icon={Cpu} title="Power Management System" subtitle="Intelligent Distribution" color="0, 112, 254" delay={1.0} />
      </div>
      
      {/* Consumers */}
      <div className="flow-consumers">
         <div className="c-branch-line"><HorizontalLine delay={1.1} /></div>
         <div className="c-drops">
            <div className="c-drop"><FlowLine delay={1.2} /></div>
            <div className="c-drop"><FlowLine delay={1.2} /></div>
            <div className="c-drop"><FlowLine delay={1.2} /></div>
         </div>
         
         <div className="flow-row consumers-row">
            <FlowNode icon={Activity} title="Sensors" subtitle="6-Parameter Keel" color="148, 163, 184" delay={1.3} />
            <FlowNode icon={Cpu} title="Computing" subtitle="RPi + ESP32" color="148, 163, 184" delay={1.4} />
            <FlowNode icon={Wifi} title="Telemetry" subtitle="Sat-Comm" color="148, 163, 184" delay={1.5} />
         </div>
      </div>
    </div>
  );
}
