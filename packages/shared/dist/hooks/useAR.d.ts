import { Bird } from '../types';
export interface ARSceneConfig {
    bird: Bird;
    canvasId: string;
    width?: number;
    height?: number;
    onHotspotClick?: (info: string) => void;
}
export declare const useAR: () => {
    isARSupported: any;
    isLoading: any;
    error: any;
    initializeARScene: any;
    rotateModel: any;
    zoomModel: any;
    resetModel: any;
    toggleWireframe: any;
    takeSnapshot: any;
    dispose: any;
};
//# sourceMappingURL=useAR.d.ts.map