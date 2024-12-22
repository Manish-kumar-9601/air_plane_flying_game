import { Canvas } from "@react-three/fiber";
import { SphereEnv } from "./components/SphereEnv";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { LandScape } from "./components/LandScape";
import { Plane } from "./components/plane";
import { BlendFunction } from 'postprocessing'
import { Targets } from "./components/Target";
import { EffectComposer, HueSaturation } from "@react-three/postprocessing";
import { MotionBlur } from "./components/MotionBlur";
 

export default function App ()
{
  return (
    <>

      <Canvas style={{ height: '100vh' }} >

        <SphereEnv />
        <Environment background={false} files={'/assets/texture/envmap.hdr'} />
        <ambientLight intensity={1} />
        <PerspectiveCamera makeDefault position={[0, 1, 10]} />
        <directionalLight position={[10, 10, 10]} intensity={2} />


        <Targets />
        <LandScape />
        <Plane />
        <EffectComposer>
       
       <MotionBlur />
          <HueSaturation
            blendFunction={BlendFunction.NORMAL}
            hue={-0.15}
            saturation={0.1}
          />
        </EffectComposer>
      </Canvas>
    </>
  )
}