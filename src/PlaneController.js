// import { easeOutQuad } from 'd3-ease';
import { Vector3, Vector4 } from 'three';
const easeOutQuad = (t) => t * (2 - t);
export const CONTROLS = {
    TURN_LEFT: 'a',
    TURN_RIGHT: 'd',
    PITCH_UP: 'w',
    PITCH_DOWN: 's',
    TURBO: 'shift'
};

export const PHYSICS = {
    MAX_VELOCITY: 0.04,
    CONTROL_FORCE: 0.02,
    DRAG_FACTOR: 0.95,
    BASE_SPEED: 0.006,
    TURBO_ACCELERATION: 0.025,
    BASE_FOV: 45
};

class PlaneController {
    constructor() {
        this.controls = {};
        this.jawVelocity = 0;
        this.pitchVelocity = 0;
        this.turbo = 0;
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        window.addEventListener('keydown', (event) => {
            this.controls[event.key.toLowerCase()] = true;
        });
        
        window.addEventListener('keyup', (event) => {
            this.controls[event.key.toLowerCase()] = false;
        });
    }
    
    updateVelocities() {
        // Apply drag
        this.jawVelocity *= PHYSICS.DRAG_FACTOR;
        this.pitchVelocity *= PHYSICS.DRAG_FACTOR;
        
        // Clamp velocities
        if (Math.abs(this.jawVelocity) > PHYSICS.MAX_VELOCITY) {
            this.jawVelocity = Math.sign(this.jawVelocity) * PHYSICS.MAX_VELOCITY;
        }
        if (Math.abs(this.pitchVelocity) > PHYSICS.MAX_VELOCITY) {
            this.pitchVelocity = Math.sign(this.pitchVelocity) * PHYSICS.MAX_VELOCITY;
        }
        
        // Update based on controls
        if (this.controls[CONTROLS.TURN_LEFT]) {
            this.jawVelocity += PHYSICS.CONTROL_FORCE;
        }
        if (this.controls[CONTROLS.TURN_RIGHT]) {
            this.jawVelocity -= PHYSICS.CONTROL_FORCE;
        }
        if (this.controls[CONTROLS.PITCH_UP]) {
            this.pitchVelocity += PHYSICS.CONTROL_FORCE;
        }
        if (this.controls[CONTROLS.PITCH_DOWN]) {
            this.pitchVelocity -= PHYSICS.CONTROL_FORCE;
        }
    }
    
    updateTurbo() {
        if (this.controls[CONTROLS.TURBO]) {
            this.turbo += PHYSICS.TURBO_ACCELERATION;
        } else {
            this.turbo *= PHYSICS.DRAG_FACTOR;
        }
        this.turbo = Math.min(Math.max(this.turbo, 0), 1);
        return easeOutQuad(this.turbo) * 0.02;
    }
    
    updatePlaneAxes(x, y, z, planePosition, camera) {
        this.updateVelocities();
        
        // Apply rotations
        x.applyAxisAngle(z, this.jawVelocity);
        y.applyAxisAngle(z, this.jawVelocity);
        
        y.applyAxisAngle(x, this.pitchVelocity);
        z.applyAxisAngle(x, this.pitchVelocity);
        
        // Normalize vectors
        x.normalize();
        y.normalize();
        z.normalize();
        
        // Update turbo and camera
        const turboSpeed = this.updateTurbo();
        camera.fov = PHYSICS.BASE_FOV * turboSpeed * 900;
        camera.updateProjectionMatrix();
        
        // Update position
        planePosition.add(z.clone().multiplyScalar(-PHYSICS.BASE_SPEED));
    }
}

export const planeController = new PlaneController();