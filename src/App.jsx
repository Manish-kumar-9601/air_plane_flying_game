import { Canvas } from "@react-three/fiber";
import { SphereEnv } from "./components/SphereEnv";
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { LandScape } from "./components/LandScape";
import { Plane } from "./components/plane";

export default function App() {
  return (
    <>
    <Canvas>
      
    <SphereEnv/>
    <Environment background={false}  files={'/assets/texture/envmap.hdr'} />
    <ambientLight intensity={5} />
    <PerspectiveCamera makeDefault position={[0, 10, 10]}   />
    <directionalLight position={[10, 10, 10]} intensity={1} />
    <LandScape />
    <Plane />
          <OrbitControls/>
    </Canvas>
    </>
  )
}