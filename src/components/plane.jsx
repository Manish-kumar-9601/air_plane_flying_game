// Plane.jsx
import React, { useRef, useMemo } from 'react';
import { OrbitControls, useGLTF, useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Matrix4, Vector3, Vector4, Quaternion } from 'three';
import { updatePlaneAxes } from '../Controller';
import { RigidBody } from '@react-three/rapier';

const delayedRotMatrix = new Matrix4();
const delayedQuaternion = new Quaternion();
const INITIAL_POSITION = new Vector4(0, 20, 25);
const SCALE = { x: 0.01, y: 0.01, z: 0.01 };
const CAMERA_OFFSET = {
    x: 0,
    y: 0.3,  // Increased for better view
    z: 2,    // Increased distance from plane
    rotation: -0.2
};
const HELIX_ROTATION_SPEED = 1;
const CAMERA_SMOOTHING = 0.175; // Camera interpolation factor

export const Plane = ({ modelPath = '/assets/models/airplane.glb', ...props }) => {
    const [, get] = useKeyboardControls();
const { forward, backward, left, right, turbo ,reset} = get()
    const groupRef = useRef();
    const helixRef = useRef();
    const rigidBodyRef=useRef()
    const { nodes, materials } = useGLTF(modelPath);
    console.log( forward, backward, left, right, turbo ,reset);
    const axes = useMemo(() => ({
        x: new Vector3(1, 0, 0),
        y: new Vector3(0, 1, 0),
        z: new Vector3(0, 0, 1)
    }), []);
    
    const planePosition = useMemo(() => INITIAL_POSITION.clone(), []);
    
    useFrame(({ camera }) => {
        // Update helix rotation
        if (helixRef.current) {
            helixRef.current.rotation.z += HELIX_ROTATION_SPEED;
        }
        
        // Update plane axes and position
        updatePlaneAxes(axes.x, axes.y, axes.z, planePosition, camera, forward, backward, left, right, turbo ,reset );
         
        // Calculate plane transformation matrix
        const rotationMatrix = new Matrix4().makeBasis(axes.x, axes.y, axes.z);
        const transformMatrix = new Matrix4()
            .makeTranslation(planePosition.x, planePosition.y, planePosition.z)
            .multiply(rotationMatrix)
            .scale(SCALE);
        
        // Apply plane transformation
        if (groupRef.current) {
            groupRef.current.matrixAutoUpdate = false;
            groupRef.current.matrix.copy(transformMatrix);
            groupRef.current.matrixWorldNeedsUpdate = true;
        }
        
        // Smooth camera rotation using quaternion interpolation
        const currentQuaternion = new Quaternion();
        currentQuaternion.setFromRotationMatrix(rotationMatrix);
        
        delayedQuaternion.slerp(currentQuaternion, CAMERA_SMOOTHING);
        
        delayedRotMatrix.identity();
        delayedRotMatrix.makeRotationFromQuaternion(delayedQuaternion);
        
        // Create camera offset matrix that includes rotation
        const offsetMatrix = new Matrix4()
            .multiply(delayedRotMatrix)  // Apply plane's rotation
            .multiply(new Matrix4().makeRotationX(CAMERA_OFFSET.rotation))  // Camera tilt
            .multiply(new Matrix4().makeTranslation(
                CAMERA_OFFSET.x,
                CAMERA_OFFSET.y,
                CAMERA_OFFSET.z
            ));
        
        // Final camera matrix
        const cameraMatrix = new Matrix4()
            .makeTranslation(planePosition.x, planePosition.y, planePosition.z)
            .multiply(offsetMatrix);
        
        camera.matrixAutoUpdate = false;
        camera.matrix.copy(cameraMatrix);
        camera.matrixWorldNeedsUpdate = true;
    });
    
    return (
        <RigidBody colliders={false} lockRotations ref={rigidBodyRef}>

        <group ref={groupRef}>
         
              {/* <OrbitControls
                enableZoom={false}
                enablePan={true}
                enableRotate={true}
                minAzimuthAngle={-Math.PI / 4}
                maxAzimuthAngle={Math.PI / 4}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI - Math.PI / 6}
                /> */}
            
            <group rotation-y={Math.PI} {...props} scale={4}>
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
                <mesh
                    ref={helixRef}
                    castShadow
                    receiveShadow
                    geometry={nodes.helix.geometry}
                    material={materials['Material.005']}
                    />
            </group>
        </group>
                    </RigidBody>
    );
};

useGLTF.preload('/assets/models/airplane.glb');

