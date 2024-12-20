import { useTexture } from "@react-three/drei"
import { BackSide } from "three"

export const SphereEnv=()=>{
    const map=useTexture('/assets/texture/envmap.jpg')
    return(
    <mesh>
  <sphereGeometry args={[60, 70, 70]} />
  <meshBasicMaterial 
  side={BackSide} 
  map={map} />
</mesh>
    )
}