type PerspectiveCamera = {
    fov: number,
    aspect: number,
    near: number,
    far: number,
};


export type ConfigType = {
    color: string,
    camera: PerspectiveCamera
}