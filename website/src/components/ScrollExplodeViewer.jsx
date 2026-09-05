import { useState, useEffect } from 'react';
import ModelViewer from './ModelViewer';

/**
 * ScrollExplodeViewer
 * Single continuous 3D model that physically disassembles into its
 * subsystems in real time as the user scrolls through the Hero section.
 */
export default function ScrollExplodeViewer({
  assembledUrl,
  explodedUrl,
  sectionRef,
  ...viewerProps
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!sectionRef?.current) {
            ticking = false;
            return;
          }
          const rect = sectionRef.current.getBoundingClientRect();
          const sectionH = sectionRef.current.offsetHeight;
          const windowH = window.innerHeight;

          const scrolled = -rect.top;
          const maxScroll = Math.max(1, sectionH - windowH);
          
          // Eased progress from 0 (top) to 1 (fully scrolled)
          const rawP = Math.max(0, Math.min(1, scrolled / (maxScroll * 0.85)));
          setProgress(rawP);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [sectionRef]);

  // Dynamic zoom: as model expands, camera zooms out slightly to keep everything in frame
  const currentZoom = (viewerProps.defaultZoom || 3.6) + progress * 1.6;
  const currentYOffset = (viewerProps.modelYOffset ?? 0.08) + progress * 0.14;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ModelViewer
        url={assembledUrl}
        {...viewerProps}
        defaultZoom={3.6}
        targetZoom={currentZoom}
        modelYOffset={currentYOffset}
        explodeProgress={progress}
        autoRotate={true}
        animateTurbine={true}
        enableManualRotation={true}
      />

      {/* Real-time Hardware Disassembly Subsystem Badges */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: Math.max(0, Math.min(1, (progress - 0.25) * 2)),
        transition: 'opacity 0.2s ease-out',
      }}>
        {[
          { top: '10%', left: '60%', text: 'Atmospheric Sensors Mast' },
          { top: '24%', left: '62%', text: 'Marine Solar Deck' },
          { top: '35%', left: '60%', text: 'Waterproof Electronics Bay' },
          { top: '48%', left: '12%', text: 'Octagonal Composite Hull' },
          { top: '64%', left: '62%', text: 'Hydrokinetic VAWT Turbine' },
          { top: '78%', left: '60%', text: 'Impact Protective Cage' },
          { top: '90%', left: '12%', text: '6-Parameter Sensor Keel' },
        ].map((tag) => (
          <div
            key={tag.text}
            style={{
              position: 'absolute',
              top: tag.top,
              left: tag.left,
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#00e5ff',
              boxShadow: '0 0 8px #00e5ff',
            }} />
            <div style={{
              padding: '4px 10px',
              background: 'rgba(5, 16, 36, 0.8)',
              border: '1px solid rgba(0, 229, 255, 0.4)',
              borderRadius: '4px',
              backdropFilter: 'blur(8px)',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: '#00e5ff',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}>
              {tag.text}
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Status Pill */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        right: '24px',
        padding: '8px 16px',
        background: 'rgba(5, 16, 36, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(0, 229, 255, 0.35)',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        pointerEvents: 'none',
        zIndex: 10,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: progress > 0.05 ? '#00e5ff' : '#0070fe',
          boxShadow: `0 0 10px ${progress > 0.05 ? '#00e5ff' : '#0070fe'}`,
          transition: 'all 0.3s ease',
        }} />
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: progress > 0.05 ? '#00e5ff' : '#e2e8f0',
        }}>
          {progress > 0.7
            ? 'Fully Disassembled Subsystems'
            : progress > 0.08
            ? `Disassembling (${Math.round(progress * 100)}%)`
            : 'Assembled Operational Platform'}
        </span>
      </div>
    </div>
  );
}
