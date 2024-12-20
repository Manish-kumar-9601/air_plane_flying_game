import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { Matrix4, Vector4 } from 'three';

export const planePosition = new Vector4(0,4, 1  );

export function Plane(props) {
  const { nodes, materials } = useGLTF('/assets/models/airplane.glb');
  const groupRef = useRef();
  const helixRef = useRef();
  
  useFrame(({ camera }) => {
    const matrix = new Matrix4().makeTranslation(planePosition.x, planePosition.y, planePosition.z).scale({ x: 0.01, y: 0.01, z: 0.01 }); // Include scale in matrix

    groupRef.current.matrixAutoUpdate = false;
    groupRef.current.matrix.copy(matrix);
    groupRef.current.matrixWorldNeedsUpdate = true;

    const cameraMatrix=new Matrix4().makeTranslation(planePosition.x,planePosition.y,planePosition.z).multiply((new Matrix4().makeRotationX((-0.2)))).multiply((new Matrix4().makeTranslation(0,0.015,0.3)))
    camera.matrixAutoUpdate=false;
    camera.matrix.copy(cameraMatrix);
    camera.matrixWorldNeedsUpdate=true
    
    helixRef.current.rotation.z-=1
    helixRef.current.rotation.y=-0.009
    helixRef.current.rotation.x=-0.08 
   });

  return (
    <group {...props} ref={groupRef}  >
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.supports.geometry}
        material={materials['Material.004']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.chassis.geometry}
        material={materials['Material.005']}
      />
      <mesh ref={helixRef}
        castShadow
        receiveShadow
        geometry={nodes.helix.geometry}
        material={materials['Material.005']}
      />
    </group>
  );
}

useGLTF.preload('/assets/models/airplane.glb');
