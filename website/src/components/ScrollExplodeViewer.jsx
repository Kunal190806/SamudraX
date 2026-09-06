/* eslint-disable react/no-unknown-property */
import { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Preload the animated explosion model
useGLTF.preload('/models/samudrax-scroll-explode.glb');

/**
 * AnimatedExplodeModel
 * Binds the 556-part explosion animation to the scroll progress.
 * Assembles at scroll=0, explodes smoothly as user scrolls,
 * and glides into center stage.
 */
function AnimatedExplodeModel({ progressRef, autoRotate = true }) {
  const gltf = useGLTF('/models/samudrax-scroll-explode.glb');
  const groupRef = useRef();
  const currentP = useRef(0);

  // Clone scene so materials/transforms are clean
  const clonedScene = useMemo(() => {
    const s = gltf.scene.clone(true);
    s.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        // Hide guide pins/lines if any
        if (o.name && /^Cylinder\.2(0[6-9]|1[0-4])$/.test(o.name)) {
          o.visible = false;
        }
      }
    });
    return s;
  }, [gltf.scene]);

  // Setup AnimationMixer
  const { mixer, duration } = useMemo(() => {
    if (!gltf.animations || gltf.animations.length === 0) {
      return { mixer: null, duration: 0 };
    }
    const m = new THREE.AnimationMixer(clonedScene);
    const clip = gltf.animations[0];
    const action = m.clipAction(clip);
    action.play();
    action.paused = true; // Scrubbed by scroll
    return { mixer: m, duration: clip.duration };
  }, [clonedScene, gltf.animations]);

  useFrame((state, delta) => {
    if (!mixer || duration === 0 || !groupRef.current) return;

    // Smooth lerp for buttery scrubbing
    const target = progressRef.current || 0;
    currentP.current += (target - currentP.current) * 0.12;
    const clamped = Math.max(0, Math.min(1, currentP.current));

    // Scrub animation time
    mixer.setTime(clamped * duration);

    // Dynamic centering: on desktop start on right (x=0.55), glide to center (x=0) as text fades
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 900;
    const targetX = isMobile ? 0 : 0.55 * (1 - Math.min(1, clamped * 1.5));
    groupRef.current.position.x = targetX;

    // Subtle gentle auto-rotation around Y
    if (autoRotate) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={groupRef} position={[0.55, 0, 0]} scale={0.42}>
      <primitive object={clonedScene} />
    </group>
  );
}

/**
 * ScrollExplodeViewer
 * Pinned hero 3D viewer that scrubs the native Blender keyframed explosion
 * as the user scrolls through the sticky hero container.
 */
export default function ScrollExplodeViewer({
  sectionRef,
  autoRotate = true,
  onProgressChange,
}) {
  const progressRef = useRef(0);
  const [hudProgress, setHudProgress] = useState(0);

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

          // scrolled from top of hero section
          const scrolled = -rect.top;
          const maxScroll = Math.max(1, sectionH - windowH);

          // We map 0 -> 0.85 of the hero scroll travel to 0 -> 1.0 explosion
          // This gives the user time to inspect the fully exploded platform
          // before the section unpins and travels down to #challenge.
          const p = Math.max(0, Math.min(1, scrolled / (maxScroll * 0.85)));
          progressRef.current = p;
          setHudProgress(p);
          if (onProgressChange) onProgressChange(p);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [sectionRef, onProgressChange]);

  const progressPercent = Math.round(hudProgress * 100);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'auto' }}>
      <Canvas
        camera={{ position: [0, 0.15, 3.8], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        {/* Lights */}
        <ambientLight intensity={1.3} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={2.2}
          color="#ffffff"
          castShadow
        />
        <directionalLight
          position={[-5, 4, 3]}
          intensity={1.2}
          color="#00e5ff"
        />
        <directionalLight
          position={[0, -5, -4]}
          intensity={1.0}
          color="#0070fe"
        />
        <pointLight position={[0, 2, 2]} intensity={0.8} color="#ffffff" />

        <Environment preset="city" environmentIntensity={0.6} />

        <Suspense fallback={null}>
          <AnimatedExplodeModel
            progressRef={progressRef}
            autoRotate={autoRotate}
          />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          rotateSpeed={0.8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(3 * Math.PI) / 4}
        />
      </Canvas>

      {/* Sleek Floating Status Pill */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          right: 28,
          zIndex: 15,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 16px',
          background: 'rgba(5, 16, 36, 0.75)',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          borderRadius: '30px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: hudProgress >= 0.95 ? '#00e5ff' : hudProgress > 0 ? '#ffaa00' : '#4ade80',
            boxShadow: `0 0 10px ${hudProgress >= 0.95 ? '#00e5ff' : hudProgress > 0 ? '#ffaa00' : '#4ade80'}`,
            transition: 'all 0.3s ease',
          }}
        />
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#e2e8f0',
          }}
        >
          {hudProgress === 0
            ? 'PLATFORM: ASSEMBLED (SCROLL TO EXPLODE)'
            : hudProgress >= 0.95
            ? 'ARCHITECTURE: FULLY EXPLODED (SCROLL DOWN)'
            : `EXPLODING PLATFORM: ${progressPercent}%`}
        </span>
      </div>
    </div>
  );
}
