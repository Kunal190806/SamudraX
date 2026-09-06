/* eslint-disable react/no-unknown-property */
import { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import { useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';

useGLTF.preload('/models/samudrax-scroll-explode.glb');

/**
 * AnimatedModel — loads the animated GLB, auto-centers it,
 * and scrubs its animation based on scroll progress.
 */
function AnimatedModel({ progressRef }) {
  const gltf = useGLTF('/models/samudrax-scroll-explode.glb');
  const wrapperRef = useRef();
  const smoothProgress = useRef(0);

  // Clone scene so we can manipulate it without side effects
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  // Compute bounding box at t=0, auto-center and auto-scale
  const { offsetY, scaleFactor } = useMemo(() => {
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    return {
      offsetY: -center.y,      // shift model so its center is at y=0
      scaleFactor: 0.9 / maxDim // normalize to ~0.9 units tall so explosion stays in frame
    };
  }, [scene]);

  // Create AnimationMixer
  const { mixer, duration } = useMemo(() => {
    if (!gltf.animations?.length) return { mixer: null, duration: 0 };
    const m = new THREE.AnimationMixer(scene);
    const clip = gltf.animations[0];
    const action = m.clipAction(clip);
    action.play();
    // Do not set paused=true, otherwise setTime won't evaluate the tracks
    return { mixer: m, duration: clip.duration };
  }, [scene, gltf.animations]);

  useFrame((_, delta) => {
    if (!mixer || !duration || !wrapperRef.current) return;

    // Smooth lerp toward target progress
    const target = progressRef.current ?? 0;
    smoothProgress.current += (target - smoothProgress.current) * 0.1;
    const p = Math.max(0, Math.min(1, smoothProgress.current));

    // Scrub animation
    mixer.setTime(p * duration);

    // Very slow whole-model rotation so it's clearly visible
    wrapperRef.current.rotation.y += delta * 0.05;

    // Fast turbine rotation in opposite direction
    scene.traverse((o) => {
      if (o.name && o.name.toLowerCase().includes('turbine')) {
        o.rotation.y -= delta * 2.5; 
      }
    });
  });

  return (
    <group ref={wrapperRef} scale={scaleFactor} rotation={[0, -Math.PI / 4, 0]}>
      <group position={[0, offsetY, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

/**
 * ScrollExplodeViewer — the full hero 3D viewer.
 * Renders a Canvas with the animated model and computes scroll progress.
 */
export default function ScrollExplodeViewer({ sectionRef, onProgressChange }) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });
  
  // We want the explosion to complete at 85% of the scroll
  const explosionProgress = useTransform(scrollYProgress, [0, 0.85], [0, 1]);
  
  const progressRef = useRef(0);
  const [hudProgress, setHudProgress] = useState(0);

  useEffect(() => {
    return explosionProgress.on("change", (latest) => {
      // clamping between 0 and 1
      const p = Math.max(0, Math.min(1, latest));
      progressRef.current = p;
      setHudProgress(p);
      onProgressChange?.(p);
    });
  }, [explosionProgress, onProgressChange]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 8, 5]} intensity={2.5} />
        <directionalLight position={[-4, 3, -2]} intensity={1.0} color="#00e5ff" />
        <directionalLight position={[0, -4, 4]} intensity={0.8} color="#0070fe" />
        <Environment preset="city" environmentIntensity={0.6} />
        <Suspense fallback={null}>
          <AnimatedModel progressRef={progressRef} />
        </Suspense>
      </Canvas>

      {/* Progress badge */}
      <div style={{
        position: 'absolute', bottom: 20, right: 20, zIndex: 15,
        pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 14px', background: 'rgba(5,16,36,0.8)',
        border: '1px solid rgba(0,229,255,0.3)', borderRadius: 24,
        backdropFilter: 'blur(10px)', fontFamily: 'monospace',
        fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', color: '#e2e8f0',
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: hudProgress >= 0.95 ? '#00e5ff' : hudProgress > 0.01 ? '#ffaa00' : '#4ade80',
          boxShadow: `0 0 8px ${hudProgress >= 0.95 ? '#00e5ff' : hudProgress > 0.01 ? '#ffaa00' : '#4ade80'}`,
        }} />
        {hudProgress < 0.01 ? 'ASSEMBLED · SCROLL ↓' : hudProgress >= 0.95 ? 'EXPLODED · SCROLL ↓' : `EXPLODING ${Math.round(hudProgress * 100)}%`}
      </div>
    </div>
  );
}
