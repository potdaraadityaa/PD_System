"use client";

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

function FlowNode({ position, label, color = "#ffffff", active }) {
    const meshRef = useRef();

    useFrame((state) => {
        if (active && meshRef.current) {
            meshRef.current.rotation.y += 0.01;
            meshRef.current.rotation.x += 0.005;
        }
    });

    return (
        <group position={position}>
            <mesh ref={meshRef}>
                <boxGeometry args={[1.5, 1.5, 1.5]} />
                <meshStandardMaterial
                    color={active ? color : "#333"}
                    wireframe
                    emissive={active ? color : "#000"}
                    emissiveIntensity={active ? 0.5 : 0}
                />
            </mesh>
            {/* Glow Effect */}
            {active && (
                <pointLight distance={3} intensity={2} color={color} />
            )}
            <Html position={[0, -1.2, 0]} center>
                <div className={`text-xs font-mono tracking-widest ${active ? 'text-white' : 'text-zinc-600'}`}>
                    {label}
                </div>
            </Html>
        </group>
    );
}

function DataPacket({ start, end, active }) {
    const ref = useRef();
    const [progress, setProgress] = useState(0);

    useFrame(() => {
        if (!active) return;

        // Move packet
        const newProgress = progress + 0.02;
        if (newProgress >= 1) {
            setProgress(0); // Loop
        } else {
            setProgress(newProgress);
        }

        if (ref.current) {
            const startVec = new THREE.Vector3(...start);
            const endVec = new THREE.Vector3(...end);
            ref.current.position.lerpVectors(startVec, endVec, progress);
        }
    });

    if (!active) return null;

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial color="#00ffcc" />
            <pointLight distance={1} intensity={1} color="#00ffcc" />
        </mesh>
    );
}

export default function AuthorizationFlow() {
    // Nodes: User -> Role -> Policy -> Decision
    const userPos = [-6, 0, 0];
    const rolePos = [-2, 0, 0];
    const policyPos = [2, 0, 0];
    const decisionPos = [6, 0, 0];

    return (
        <group>
            <FlowNode position={userPos} label="USER" active={true} />
            <FlowNode position={rolePos} label="ROLE" active={true} />
            <FlowNode position={policyPos} label="POLICY ENGINE" active={true} />
            <FlowNode position={decisionPos} label="DECISION" active={true} color="#4ade80" />

            {/* Connections */}
            <Line points={[userPos, rolePos]} color="#333" lineWidth={1} />
            <Line points={[rolePos, policyPos]} color="#333" lineWidth={1} />
            <Line points={[policyPos, decisionPos]} color="#333" lineWidth={1} />

            {/* Packets */}
            <DataPacket start={userPos} end={rolePos} active={true} />
            <DataPacket start={rolePos} end={policyPos} active={true} />
            <DataPacket start={policyPos} end={decisionPos} active={true} />
        </group>
    );
}
