import React, { useEffect, useMemo, useRef } from 'react';
import
    {
        MeshReflectorMaterial,
        OrbitControls,
        useGLTF,
        Environment,
        Sparkles,
        Cloud,
        Float
    } from '@react-three/drei';
import { Color, MeshStandardMaterial, DoubleSide } from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';

export function LandScape (props)
{
    // const { nodes, materials } = useGLTF('/assets/models/scene.glb');
    const { nodes, materials } = useGLTF('public/assets/models/scene.glb');
    const waterRefs = useRef([]);

    // Enhanced materials with improved visual properties
    const [lightMaterial, waterMaterial, treeMaterial] = useMemo(() =>
    {
        return [
            // Light material with enhanced glow
            new MeshStandardMaterial({
                envMapIntensity: 0.5,
                color: new Color('#ea6619'),
                roughness: 0.2,
                metalness: 0.8,
                emissive: new Color("#f6390f").multiplyScalar(1.5)
            }),
            // Enhanced water material
            <MeshReflectorMaterial
                transparent={true}
                opacity={0.8}
                roughness={0.1}
                metalness={0.8}
                color={new Color("#4a8fff")}
                blur={[15, 15]}
                mixBlur={0.8}
                mixStrength={25}
                mixContrast={1.4}
                resolution={1024}
                mirror={0.8}
                depthScale={0.4}
                minDepthThreshold={0.2}
                maxDepthThreshold={0.8}
                depthToBlurRatioBias={0.2}
                distortion={0.5}
                reflectorOffset={0.1}
            />,
            // Enhanced tree material
            new MeshStandardMaterial({
                color: new Color('#2f3b1d'),
                roughness: 0.8,
                metalness: 0.2,
                envMapIntensity: 0.5,
                side: DoubleSide
            })
        ];
    }, []);

    useEffect(() =>
    {
        // Enhanced landscape materials
        const landscapeMaterial = materials['Material.009'];
        landscapeMaterial.envMapIntensity = 1;
        landscapeMaterial.roughness = 0.65;
        landscapeMaterial.metalness = 0.35;

        const treeMaterial = materials['Material.008'];
        treeMaterial.color = new Color('#2f3b1d');
        treeMaterial.envMapIntensity = 0.5;
        treeMaterial.roughness = 0.8;
        treeMaterial.metalness = 0.2;

        // Enhance border material
        const borderMaterial = materials['Material.010'];
        borderMaterial.envMapIntensity = 0.8;
        borderMaterial.roughness = 0.4;
        borderMaterial.metalness = 0.6;
    }, []);

    // Animate water
    useFrame((state) =>
    {
        const time = state.clock.getElapsedTime();
        waterRefs.current.forEach((ref, i) =>
        {
            if (ref)
            {
                ref.position.y = Math.sin(time * 0.5 + i * 0.2) * 0.02 - 0.02;
            }
        });
    });

    return (
        <>
            <RigidBody   type='fixed' collider='trimesh'  >

                {/* Environment and atmospheric effects */}
                <Environment preset="sunset" />
                <fog attach="fog" args={['#90b7ff', 10, 100]} />

                <group {...props} dispose={null} scale={10}>
                    {/* Main landscape */}
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.landscape_gltf.geometry}
                        material={materials['Material.009']}
                    />

                    {/* Borders */}
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.landscape_borders.geometry}
                        material={materials['Material.010']}
                    />

                    {/* Trees with floating animation */}
                    <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.2}>
                        <mesh
                            castShadow
                            receiveShadow
                            geometry={nodes.trees_light.geometry}
                            material={materials['Material.008']}
                        />
                    </Float>

                    {/* Walls */}
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.walls.geometry}
                        material={nodes.walls.material}
                        position={[0, 3, -5.109]}
                        rotation={[Math.PI / 2, 0, 0]}
                        scale={[5, 1, 3]}
                    />

                    {/* Animated water bodies */}
                    {['water', 'water1', 'water2'].map((waterName, index) => (
                        <mesh
                            key={waterName}
                            ref={el => waterRefs.current[index] = el}
                            castShadow
                            receiveShadow
                            geometry={nodes[waterName].geometry}
                            material={waterMaterial}
                        />
                    ))}

                    {/* Enhanced lights */}
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.lights.geometry}
                        material={lightMaterial}
                    />

                    {/* Atmospheric particles */}
                    <Sparkles
                        count={50}
                        scale={20}
                        size={2}
                        speed={0.2}
                        opacity={0.2}
                    />

                    {/* Decorative clouds */}
                    <Cloud
                        opacity={0.5}
                        speed={0.2}
                        width={20}
                        depth={1.5}
                        segments={20}
                        position={[0, 15, -10]}
                    />
                </group>
            </RigidBody>
        </>
    );
}

useGLTF.preload('/assets/models/scene.glb');