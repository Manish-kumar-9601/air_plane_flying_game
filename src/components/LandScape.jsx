import React, { useEffect, useMemo, useRef } from 'react'
import { MeshReflectorMaterial, useGLTF } from '@react-three/drei'
import { Color, MeshStandardMaterial } from 'three'

export function LandScape (props)
{
    const { nodes, materials } = useGLTF('/assets/models/scene.glb')

    const [lightMaterial, waterMaterial] = useMemo(() =>
    {
        return [
            new MeshStandardMaterial({
                envMapIntensity: 0,
                color: new Color('#ea6619'),
                roughness: 0,
                metalness: 0,
                emissive: new Color("#f6390f").multiplyScalar(1)
            }),
            <MeshReflectorMaterial
                transparent={true}
                opacity={.6}
                roughness={0}
                blur={[10, 10]} // Blur ground reflections (width, height), 0 skips blur
                mixBlur={1} // How much blur mixes with surface roughness (default = 1)
                mixStrength={20} // Strength of the reflections
                mixContrast={1.2} // Contrast of the reflections
                resolution={512} // Off-buffer resolution, lower=faster, higher=better quality, slower
                mirror={0} // Mirror environment, 0 = texture colors, 1 = pick up env colors
                depthScale={0} // Scale the depth factor (0 = no depth, default = 0)
                minDepthThreshold={0} // Lower edge for the depthTexture interpolation (default = 0)
                maxDepthThreshold={0.1} // Upper edge for the depthTexture interpolation (default = 0)
                depthToBlurRatioBias={0.0025} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
                debug={
                    0
                } /* Depending on the assigned value, one of the following channels is shown */
                reflectorOffset={0.0} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
            />
        ]
    }, [])
    
    useEffect(()=>{
        const landscapeMaterial=materials['Material.009'];
        landscapeMaterial.envMapIntensity=0.75;
        const treeMaterial=materials['Material.008']
        treeMaterial.color=new Color('#2f4f13');
        treeMaterial.envMapIntensity = 0.3;
        treeMaterial.roughness = 1;
        treeMaterial.metalness = 6;
    },[])
    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.landscape_gltf.geometry}
                material={materials['Material.009']}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.landscape_borders.geometry}
                material={materials['Material.010']}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.trees_light.geometry}
                material={materials['Material.008']}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.walls.geometry}
                material={nodes.walls.material}
                position={[0, 3, -5.109]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={[5, 1, 3]}
            />
            <mesh castShadow receiveShadow geometry={nodes.water.geometry} material={materials.Water} />
            <mesh castShadow receiveShadow geometry={nodes.water1.geometry} material={materials.Water} />
            <mesh castShadow receiveShadow geometry={nodes.water2.geometry} material={materials.Water} />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.lights.geometry}
                material={materials['Material.001']}
            />
        </group>
    )
}

useGLTF.preload('/scene.glb')