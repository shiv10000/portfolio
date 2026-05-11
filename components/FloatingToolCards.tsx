'use client';

import {Canvas, ThreeEvent, useFrame} from '@react-three/fiber';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {MutableRefObject, useEffect, useMemo, useRef, useState} from 'react';
import * as THREE from 'three';

type ToolDefinition = {
  short: string;
  name: string;
  accent: string;
  glow: string;
  position: [number, number, number];
  rotation: [number, number, number];
  phase: number;
  kind?: 'resolve';
};

const tools: ToolDefinition[] = [
  {
    short: 'Pr',
    name: 'Premiere Pro',
    accent: '#9b6bff',
    glow: '#6d49ff',
    position: [2.25, 1.28, 0],
    rotation: [-0.18, -0.35, 0.16],
    phase: 0.2,
  },
  {
    short: 'Ae',
    name: 'After Effects',
    accent: '#b37dff',
    glow: '#7148ff',
    position: [2.45, -0.28, 0.18],
    rotation: [0.12, -0.48, -0.12],
    phase: 1.5,
  },
  {
    short: 'DaVinci',
    name: 'DaVinci Resolve',
    accent: '#67d7ff',
    glow: '#3b82f6',
    position: [0.55, -1.45, 0.28],
    rotation: [0.34, 0.22, -0.18],
    phase: 2.6,
    kind: 'resolve',
  },
  {
    short: 'GPT',
    name: 'ChatGPT',
    accent: '#70f5d4',
    glow: '#10b981',
    position: [-2.35, 1.05, 0.14],
    rotation: [-0.1, 0.38, -0.18],
    phase: 3.5,
  },
  {
    short: 'RW',
    name: 'Runway',
    accent: '#f4f0ff',
    glow: '#a78bfa',
    position: [-2.25, -1.22, 0.06],
    rotation: [0.28, 0.34, 0.13],
    phase: 4.5,
  },
];

function roundedShape(width: number, height: number, radius: number) {
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.min(radius, width / 2, height / 2);
  const shape = new THREE.Shape();

  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  return shape;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function makeToolTexture(tool: ToolDefinition) {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 400;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRoundedRect(ctx, 18, 18, 604, 364, 70);
  ctx.clip();

  const bg = ctx.createLinearGradient(0, 0, 640, 400);
  bg.addColorStop(0, '#171228');
  bg.addColorStop(0.52, '#07070d');
  bg.addColorStop(1, '#1a1230');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 640, 400);

  const glow = ctx.createRadialGradient(470, 60, 10, 470, 60, 360);
  glow.addColorStop(0, `${tool.glow}99`);
  glow.addColorStop(0.45, `${tool.glow}28`);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 640, 400);

  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  for (let y = 56; y < 380; y += 38) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(640, y);
    ctx.stroke();
  }
  ctx.restore();

  drawRoundedRect(ctx, 20, 20, 600, 360, 68);
  ctx.lineWidth = 5;
  ctx.strokeStyle = `${tool.accent}cc`;
  ctx.stroke();

  ctx.shadowColor = tool.glow;
  ctx.shadowBlur = 28;

  if (tool.kind === 'resolve') {
    const centerX = 250;
    const centerY = 162;
    const petals = [
      {x: centerX, y: centerY - 58, color: '#4fc3ff'},
      {x: centerX - 58, y: centerY + 42, color: '#dbff45'},
      {x: centerX + 58, y: centerY + 42, color: '#ff6a62'},
    ];

    petals.forEach((petal) => {
      const gradient = ctx.createRadialGradient(
        petal.x - 18,
        petal.y - 18,
        8,
        petal.x,
        petal.y,
        52,
      );
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.2, petal.color);
      gradient.addColorStop(1, '#111827');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(petal.x, petal.y, 54, 42, 0.8, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#f8fbff';
    ctx.font = '800 42px Arial, Helvetica, sans-serif';
    ctx.fillText('DaVinci', 82, 292);
    ctx.fillText('Resolve', 82, 344);
  } else {
    ctx.fillStyle = tool.accent;
    ctx.font = '900 132px Arial, Helvetica, sans-serif';
    ctx.fillText(tool.short, 72, 184);

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#f8fbff';
    ctx.font = '800 42px Arial, Helvetica, sans-serif';
    ctx.fillText(tool.name, 74, 292);
  }

  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '700 22px Arial, Helvetica, sans-serif';
  ctx.fillText('Creative workflow', 76, 342);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;

  return texture;
}

function ToolCard({
  tool,
  scrollProgress,
}: {
  tool: ToolDefinition;
  scrollProgress: MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const hoverRotation = useRef({x: 0, y: 0});
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  const width = 1.78;
  const height = 1.08;
  const depth = 0.08;

  const bodyGeometry = useMemo(() => {
    return new THREE.ExtrudeGeometry(roundedShape(width, height, 0.14), {
      depth,
      bevelEnabled: true,
      bevelSegments: 8,
      bevelSize: 0.035,
      bevelThickness: 0.035,
    });
  }, []);

  useEffect(() => {
    const nextTexture = makeToolTexture(tool);
    setTexture(nextTexture);

    return () => {
      nextTexture?.dispose();
    };
  }, [tool]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;
    const scroll = scrollProgress.current;
    const orbit = t * 0.35 + scroll * Math.PI * 1.8 + tool.phase;
    const baseX = tool.position[0];
    const baseY = tool.position[1];
    const baseZ = tool.position[2];

    groupRef.current.position.x = baseX + Math.cos(orbit) * 0.2;
    groupRef.current.position.y = baseY + Math.sin(orbit * 0.9) * 0.14;
    groupRef.current.position.z = baseZ + Math.sin(orbit) * 0.22;

    const targetX = tool.rotation[0] + hoverRotation.current.x + Math.sin(t + tool.phase) * 0.05;
    const targetY = tool.rotation[1] + hoverRotation.current.y + scroll * 0.65;
    const targetZ = tool.rotation[2] + Math.sin(t * 0.55 + tool.phase) * 0.05;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.08);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.08);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetZ, 0.08);
  });

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    const localX = THREE.MathUtils.clamp(event.point.x - tool.position[0], -1, 1);
    const localY = THREE.MathUtils.clamp(event.point.y - tool.position[1], -1, 1);
    hoverRotation.current = {
      x: -localY * 0.28,
      y: localX * 0.32,
    };
  };

  const handlePointerOut = () => {
    hoverRotation.current = {x: 0, y: 0};
  };

  return (
    <group ref={groupRef} position={tool.position} rotation={tool.rotation}>
      <mesh
        geometry={bodyGeometry}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
      >
        <meshStandardMaterial
          color="#130f21"
          metalness={0.36}
          roughness={0.35}
          emissive={tool.glow}
          emissiveIntensity={0.09}
        />
      </mesh>
      <mesh
        position={[0, 0, depth + 0.016]}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture ?? undefined} transparent />
      </mesh>
    </group>
  );
}

function ToolCardsStage({
  scrollProgress,
}: {
  scrollProgress: MutableRefObject<number>;
}) {
  return (
    <>
      <ambientLight intensity={1.25} />
      <directionalLight position={[2.5, 3, 5]} intensity={2.4} color="#ffffff" />
      <pointLight position={[-3, -2, 3]} intensity={3.3} color="#7c5cff" />
      <pointLight position={[2.8, 1.8, 2.2]} intensity={2.2} color="#66e8ff" />
      {tools.map((tool) => (
        <ToolCard key={tool.name} tool={tool} scrollProgress={scrollProgress} />
      ))}
    </>
  );
}

export function FloatingToolCards() {
  const scrollProgress = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const trigger = document.getElementById('about');
    if (!trigger) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, []);

  return (
    <Canvas
      camera={{position: [0, 0, 6.3], fov: 44}}
      dpr={[1, 1.75]}
      gl={{alpha: true, antialias: true}}
    >
      <ToolCardsStage scrollProgress={scrollProgress} />
    </Canvas>
  );
}
