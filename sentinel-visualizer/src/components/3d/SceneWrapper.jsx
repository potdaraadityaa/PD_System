"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, PerspectiveCamera } from "@react-three/drei";

export default function SceneWrapper({ children, cameraPosition = [0, 5, 15] }) {
    return (
        <div className="h-[calc(100vh-4rem)] w-full overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl">
            <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
                <PerspectiveCamera makeDefault position={cameraPosition} />
                <color attach="background" args={['#050505']} />

                {/* Cinematic Lighting */}
                <ambientLight intensity={0.2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#444" />

                <Stars radius={100} depth={50} count={2000} factor={2} saturation={0} fade speed={0.5} />

                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    minDistance={5}
                    maxDistance={50}
                    makeDefault
                />

                {children}
            </Canvas>

            {/* Overlay UI Layer */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-mono text-white/50">LIVE RENDER</span>
                </div>
            </div>
        </div>
    );
}
