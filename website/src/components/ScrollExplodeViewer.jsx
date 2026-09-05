import { useState, useEffect } from 'react';
import ModelViewer from './ModelViewer';

/**
 * ScrollExplodeViewer
 * Shows the assembled platform at the top of the hero section.
 * As the user scrolls down, it smoothly transitions to the exploded
 * engineering model with clean framing and zero UI clutter.
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
          const p = Math.max(0, Math.min(1, scrolled / (maxScroll * 0.75)));
          setProgress(p);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [sectionRef]);

  const isExploded = progress > 0.35;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Assembled Model */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: isExploded ? 0 : 1,
        transition: 'opacity 0.4s ease-in-out',
        pointerEvents: isExploded ? 'none' : 'auto',
      }}>
        <ModelViewer
          url={assembledUrl}
          {...viewerProps}
          defaultZoom={3.6}
          modelYOffset={0.08}
          autoRotate={true}
          animateTurbine={true}
          enableManualRotation={true}
        />
      </div>

      {/* Exploded Model */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: isExploded ? 1 : 0,
        transition: 'opacity 0.4s ease-in-out',
        pointerEvents: !isExploded ? 'none' : 'auto',
      }}>
        <ModelViewer
          url={explodedUrl}
          {...viewerProps}
          defaultZoom={5.4}
          modelYOffset={0.22}
          autoRotate={true}
          animateTurbine={true}
          enableManualRotation={true}
        />
      </div>
    </div>
  );
}
