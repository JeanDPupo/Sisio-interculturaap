import { Bird } from '../types';
export interface ARSceneConfig {
    bird: Bird;
    canvasId: string;
    width?: number;
    height?: number;
    onHotspotClick?: (info: string) => void;
}
export declare const useAR: () => {
    isARSupported: boolean;
    isLoading: boolean;
    error: string | null;
    initializeARScene: (config: ARSceneConfig) => Promise<void>;
    rotateModel: (angle: number) => void;
    zoomModel: (factor: number) => void;
    resetModel: () => void;
    toggleWireframe: () => void;
    takeSnapshot: () => Promise<Blob | null>;
    dispose: () => void;
};
//# sourceMappingURL=useAR.d.ts.map