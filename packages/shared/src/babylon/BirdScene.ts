import * as BABYLON from '@babylonjs/core';
import { Bird } from '../types/bird';

export interface BirdSceneConfig {
  canvas: HTMLCanvasElement;
  bird: Bird;
  onHotspotClick?: (info: string) => void;
}

export class BirdScene {
  private scene: BABYLON.Scene | null = null;
  private engine: BABYLON.Engine | null = null;
  private camera: BABYLON.UniversalCamera | null = null;
  private bird3D: BABYLON.Mesh | null = null;
  private config: BirdSceneConfig;
  private hotspots: Map<string, BABYLON.Mesh> = new Map();

  constructor(config: BirdSceneConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
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

  private createHotspots(bird: Bird): void {
    if (!this.scene) return;

    const hotspotPositions = [
      { name: 'Head', pos: new BABYLON.Vector3(0, 1.2, 0) },
      { name: 'Wings', pos: new BABYLON.Vector3(0.7, 0.5, -0.5) },
      { name: 'Tail', pos: new BABYLON.Vector3(0, -0.3, -1.2) },
    ];

    hotspotPositions.forEach(({ name, pos }) => {
      const hotspot = BABYLON.MeshBuilder.CreateSphere(
        `hotspot_${name}`,
        { diameter: 0.3 },
        this.scene!
      );
      hotspot.position = pos;

      const hotspotMaterial = new BABYLON.StandardMaterial(`hotspotMat_${name}`, this.scene!);
      hotspotMaterial.emissiveColor = new BABYLON.Color3(0, 1, 1);
      hotspot.material = hotspotMaterial;

      this.hotspots.set(name, hotspot);
    });
  }

  rotateModel(angle: number): void {
    if (this.bird3D) {
      this.bird3D.rotation.y += (angle * Math.PI) / 180;
    }
  }

  zoomModel(factor: number): void {
    if (this.camera) {
      const currentDistance = BABYLON.Vector3.Distance(this.camera.position, BABYLON.Vector3.Zero());
      const newDistance = Math.max(5, Math.min(20, currentDistance / factor));
      const direction = BABYLON.Vector3.Normalize(this.camera.position);
      this.camera.position = direction.scale(newDistance);
    }
  }

  resetModel(): void {
    if (this.bird3D) {
      this.bird3D.rotation = BABYLON.Vector3.Zero();
      this.bird3D.position = BABYLON.Vector3.Zero();
    }

    if (this.camera) {
      this.camera.position = new BABYLON.Vector3(0, 5, 10);
    }
  }

  toggleWireframe(): void {
    if (this.bird3D && this.bird3D.material instanceof BABYLON.StandardMaterial) {
      this.bird3D.material.wireframe = !this.bird3D.material.wireframe;
    }
  }

  async takeSnapshot(): Promise<Blob | null> {
    if (!this.engine) return null;

    return new Promise((resolve) => {
      BABYLON.Tools.CreateScreenshot(this.engine!, this.scene!, (blob) => {
        resolve(blob);
      });
    });
  }

  dispose(): void {
    if (this.scene) {
      this.scene.dispose();
    }
    if (this.engine) {
      this.engine.dispose();
    }
    this.hotspots.clear();
  }
}
