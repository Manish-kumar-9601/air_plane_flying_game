import { useTexture } from "@react-three/drei"
import { BackSide } from "three"

export const SphereEnv=()=>{
    const map=useTexture('/assets/texture/envmap.jpg')
    return(
    <mesh>
  <sphereGeometry args={[80, 100, 100]} />
  <meshBasicMaterial 
  side={BackSide} 
  map={map} />
</mesh>
    )
}