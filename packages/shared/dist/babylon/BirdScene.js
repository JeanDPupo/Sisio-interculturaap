import * as BABYLON from '@babylonjs/core';
export class BirdScene {
    constructor(config) {
        Object.defineProperty(this, "scene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "engine", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "camera", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "bird3D", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hotspots", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        this.config = config;
    }
    async initialize() {
        const { canvas, bird } = this.config;
        // Create engine
        this.engine = new BABYLON.Engine(canvas, true);
        // Create scene
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color4(0.95, 0.95, 0.95, 1);
        // Create camera
        this.camera = new BABYLON.UniversalCamera('camera', new BABYLON.Vector3(0, 5, 10), this.scene);
        this.camera.attachControl(canvas, true);
        this.camera.wheelPrecision = 100;
        this.camera.inertia = 0.7;
        // Lighting
        const light1 = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene);
        light1.intensity = 0.9;
        const light2 = new BABYLON.PointLight('light2', new BABYLON.Vector3(0, 5, 5), this.scene);
        light2.intensity = 0.7;
        // Create a placeholder bird model (sphere for now)
        this.bird3D = BABYLON.MeshBuilder.CreateSphere('bird', { diameter: 2 }, this.scene);
        // Apply material
        const material = new BABYLON.StandardMaterial('birdMaterial', this.scene);
        material.diffuse = new BABYLON.Color3(0.8, 0.6, 0.2);
        material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        this.bird3D.material = material;
        // Create hotspots for ancestral knowledge
        this.createHotspots(bird);
        // Setup render loop
        this.engine.runRenderLoop(() => {
            this.scene?.render();
        });
        // Handle window resize
        window.addEventListener('resize', () => {
            this.engine?.resize();
        });
    }
    createHotspots(bird) {
        if (!this.scene)
            return;
        const hotspotPositions = [
            { name: 'Head', pos: new BABYLON.Vector3(0, 1.2, 0) },
            { name: 'Wings', pos: new BABYLON.Vector3(0.7, 0.5, -0.5) },
            { name: 'Tail', pos: new BABYLON.Vector3(0, -0.3, -1.2) },
        ];
        hotspotPositions.forEach(({ name, pos }) => {
            const hotspot = BABYLON.MeshBuilder.CreateSphere(`hotspot_${name}`, { diameter: 0.3 }, this.scene);
            hotspot.position = pos;
            const hotspotMaterial = new BABYLON.StandardMaterial(`hotspotMat_${name}`, this.scene);
            hotspotMaterial.emissiveColor = new BABYLON.Color3(0, 1, 1);
            hotspot.material = hotspotMaterial;
            this.hotspots.set(name, hotspot);
        });
    }
    rotateModel(angle) {
        if (this.bird3D) {
            this.bird3D.rotation.y += (angle * Math.PI) / 180;
        }
    }
    zoomModel(factor) {
        if (this.camera) {
            const currentDistance = BABYLON.Vector3.Distance(this.camera.position, BABYLON.Vector3.Zero());
            const newDistance = Math.max(5, Math.min(20, currentDistance / factor));
            const direction = BABYLON.Vector3.Normalize(this.camera.position);
            this.camera.position = direction.scale(newDistance);
        }
    }
    resetModel() {
        if (this.bird3D) {
            this.bird3D.rotation = BABYLON.Vector3.Zero();
            this.bird3D.position = BABYLON.Vector3.Zero();
        }
        if (this.camera) {
            this.camera.position = new BABYLON.Vector3(0, 5, 10);
        }
    }
    toggleWireframe() {
        if (this.bird3D && this.bird3D.material instanceof BABYLON.StandardMaterial) {
            this.bird3D.material.wireframe = !this.bird3D.material.wireframe;
        }
    }
    async takeSnapshot() {
        if (!this.engine)
            return null;
        return new Promise((resolve) => {
            BABYLON.Tools.CreateScreenshot(this.engine, this.scene, (blob) => {
                resolve(blob);
            });
        });
    }
    dispose() {
        if (this.scene) {
            this.scene.dispose();
        }
        if (this.engine) {
            this.engine.dispose();
        }
        this.hotspots.clear();
    }
}
//# sourceMappingURL=BirdScene.js.map