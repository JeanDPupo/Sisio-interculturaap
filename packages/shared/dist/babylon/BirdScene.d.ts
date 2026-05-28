import { Bird } from '../types/bird';
export interface BirdSceneConfig {
    canvas: HTMLCanvasElement;
    bird: Bird;
    onHotspotClick?: (info: string) => void;
}
export declare class BirdScene {
    private scene;
    private engine;
    private camera;
    private bird3D;
    private config;
    private hotspots;
    constructor(config: BirdSceneConfig);
    initialize(): Promise<void>;
    private createHotspots;
    rotateModel(angle: number): void;
    zoomModel(factor: number): void;
    resetModel(): void;
    toggleWireframe(): void;
    takeSnapshot(): Promise<Blob | null>;
    dispose(): void;
}
//# sourceMappingURL=BirdScene.d.ts.map