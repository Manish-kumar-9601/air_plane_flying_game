import { Canvas } from "@react-three/fiber";
import { SphereEnv } from "./components/SphereEnv";
import { Environment, OrbitControls, OrthographicCamera, PerspectiveCamera } from "@react-three/drei";
import { LandScape } from "./components/LandScape";
import { Plane } from "./components/plane";

export default function App() {
  return (
    <>
    <Canvas style={{height:'100vh'}} >
      
    <SphereEnv/>
    <Environment background={false}  files={'/assets/texture/envmap.hdr'} />
    <ambientLight intensity={1} />
    <PerspectiveCamera makeDefault position={[0, 1, 10]}   />
    <directionalLight position={[10, 10, 10]} intensity={1} />
    
    
    <LandScape />
    <Plane />
    </Canvas>
    </>
  )
}