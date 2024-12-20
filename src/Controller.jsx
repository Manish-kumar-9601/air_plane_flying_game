import { planePosition } from "./components/plane";

export let controls = {};
window.addEventListener('keydown', (event) =>
{
    controls[event.key.toLowerCase()] = true;
    console.log(event.key.toLowerCase());
})
window.addEventListener('keyup', (event) =>
{
    controls[event.key.toLowerCase()] = false;
})
let maxVelocity=0.04;
let jawVelocity = 0;
let pitchVelocity = 0;
let planeSpeed = 0.006;
export const updatePlaneAxis = (x, y, z, planePosition, camera) =>
{
    jawVelocity *=0.95;
    pitchVelocity *=0.95;
    if(Math.abs(jawVelocity) >maxVelocity)
    {
        jawVelocity=Math.sign(jawVelocity)* maxVelocity;
    }
    
    if(Math.abs(pitchVelocity) >maxVelocity)
        {
            pitchVelocity=Math.sign(pitchVelocity)* maxVelocity;
        }
    if (controls['a' ])
    {
        jawVelocity+= 0.02;
    }
    if (controls['d' ])
    {
        jawVelocity += -0.02;
    }
    if (controls['w'])
    {
        pitchVelocity += 0.02;
    }
    if (controls['s' ])
    {
        pitchVelocity += -0.02;
    }
    if (controls['shift'])
        {
            planePosition.add(z.clone().multiplyScalar(-planeSpeed-0.04))
        }
 
    // if(x && y && z){
 
        x.applyAxisAngle(z, jawVelocity);
        y.applyAxisAngle(z, jawVelocity);
        
        y.applyAxisAngle(x, pitchVelocity);
        z.applyAxisAngle(x,pitchVelocity);
        
        x.normalize();
        y.normalize();
        z.normalize();
        
        planePosition.add(z.clone().multiplyScalar(-planeSpeed))
    // }
}