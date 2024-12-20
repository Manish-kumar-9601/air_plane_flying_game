import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { Matrix4, Vector3, Vector4 } from 'three';
import { updatePlaneAxis } from '../Controller';
const x=new Vector3(1,0,0)
const y=new Vector3(0,1,0);
const z=new Vector3(0,0,1);
export const planePosition = new Vector4(0,4,1);

export function Plane(props) {
  // thanks to:
  // https://sketchfab.com/3d-modelsvintage-toy-airplane-7de2ecbc0acb4b1886c3df3d196c366b
  const { nodes, materials } = useGLTF('/assets/models/airplane.glb');
  const groupRef = useRef();
  const helixRef = useRef();
  
  useFrame(({ camera }) => {
    helixRef.current.rotation.z+=1
    const rotationMatrix=new Matrix4().makeBasis(x, y, z)
    updatePlaneAxis(x,y,z,planePosition,camera)
    // planePosition.add(new Vector3(0,0,-0.005))
    const matrix = new Matrix4().makeTranslation(planePosition.x, planePosition.y, planePosition.z).multiply(rotationMatrix).scale({ x: 0.01, y: 0.01, z: 0.01 }); 
    groupRef.current.matrixAutoUpdate = false;
    groupRef.current.matrix.copy(matrix);
    groupRef.current.matrixWorldNeedsUpdate = true;

    const cameraMatrix=new Matrix4()
    .makeTranslation(planePosition.x,planePosition.y,planePosition.z).multiply((new Matrix4().makeRotationX((-0.2)))).multiply((new Matrix4().makeTranslation(0,0.01,0.3)))
    camera.matrixAutoUpdate=false;
    camera.matrix.copy(cameraMatrix);
    camera.matrixWorldNeedsUpdate=true
    
   
    
   });

  return (
    <group  ref={groupRef}  >
      <group {...props} rotation-y={Math.PI}  >
        
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
    </group>
  );
}

useGLTF.preload('/assets/models/airplane.glb');
