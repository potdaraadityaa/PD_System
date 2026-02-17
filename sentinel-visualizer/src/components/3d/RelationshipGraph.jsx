"use client";

import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Line, Html, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Mock Data
const MOCK_NODES = [
    { id: 'admin', label: 'Admin', type: 'role', position: [0, 0, 0] },
    { id: 'editor', label: 'Editor', type: 'role', position: [4, 2, 0] },
    { id: 'viewer', label: 'Viewer', type: 'role', position: [-4, 2, 0] },

    { id: 'u1', label: 'Alice', type: 'user', position: [0, -3, 2] },
    { id: 'u2', label: 'Bob', type: 'user', position: [5, -3, 2] },
    { id: 'u3', label: 'Charlie', type: 'user', position: [-5, -3, 2] },

    { id: 'p1', label: 'Full Access', type: 'policy', position: [0, 5, -2] },
    { id: 'p2', label: 'Read Only', type: 'policy', position: [-4, 5, -2] },
];

const MOCK_LINKS = [
    { source: 'u1', target: 'admin' },
    { source: 'u2', target: 'editor' },
    { source: 'u3', target: 'viewer' },
    { source: 'admin', target: 'p1' },
    { source: 'editor', target: 'p2' },
    { source: 'viewer', target: 'p2' },
];

function GraphNode({ node, onClick }) {
    const [hovered, setHover] = useState(false);
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            // Gentle float
            meshRef.current.position.y = node.position[1] + Math.sin(state.clock.elapsedTime + node.position[0]) * 0.1;
        }
    });

    const color = node.type === 'role' ? '#3b82f6' : node.type === 'policy' ? '#f43f5e' : '#ffffff';

    return (
        <group position={node.position} onClick={() => onClick(node)}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}>
            <mesh ref={meshRef} scale={hovered ? 1.2 : 1}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
            </mesh>
            <Html distanceFactor={10}>
                <div className={`px-2 py-1 rounded bg-black/80 border text-xs whitespace-nowrap backdrop-blur-md transition-colors ${hovered ? 'border-white text-white' : 'border-white/20 text-white/50'}`}>
                    {node.label}
                </div>
            </Html>
        </group>
    );
}

export default function RelationshipGraph() {
    const [selected, setSelected] = useState(null);

    const getPos = (id) => {
        const n = MOCK_NODES.find(n => n.id === id);
        return n ? n.position : [0, 0, 0];
    }

    return (
        <group>
            {MOCK_NODES.map((node) => (
                <GraphNode key={node.id} node={node} onClick={setSelected} />
            ))}

            {MOCK_LINKS.map((link, i) => {
                const start = getPos(link.source);
                const end = getPos(link.target);
                return (
                    <Line
                        key={i}
                        points={[start, end]}
                        color="white"
                        opacity={0.1}
                        transparent
                        lineWidth={1}
                    />
                )
            })}
        </group>
    );
}
