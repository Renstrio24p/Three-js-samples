import html from "../../utils/define/html";
import { useTSElements } from "../../utils/hooks/useTSElements";
import * as THREE from 'three';
import { ConfigType } from "./types/Camera";
import { useTSSelector } from "../../utils/hooks/useTSSelector";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


export default function Sphere(DOM: HTMLElement, title: string) {

    document.title = `${title} | Sphere`;

    const config: ConfigType = {
        color: "#000000",
        camera: {
            fov: 75,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.1,
            far: 1000,
        }
    }
    // Three JS Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(config.color);

    // Add a Camera
    const camera = new THREE.PerspectiveCamera(...Object.values(config.camera));
    camera.position.z = 5;

    // Objects
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshLambertMaterial({ color: "#468585", emissive: "#468585" });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const boxGeometry = new THREE.BoxGeometry(2, 0.1, 2);
    const boxMaterial = new THREE.MeshStandardMaterial({ color: "#B4B4B3", emissive: "#B4B4B3" });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.y = -1.5;
    scene.add(box);

    // Lights
    const light = new THREE.SpotLight("FFFFFF", 10);
    light.position.set(1, 1, 1);
    scene.add(light);

    // Orbit Controls
    const controls = new OrbitControls(camera, DOM);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Real DOM
    const ui = useTSElements(
        DOM,
        html`
            <div class='relative w-full h-full'>
                <canvas id="canvas"></canvas>
                <div class='absolute top-[40%] left-[5%] md:left-[20%] text-white'>
                    <h1 class='text-[1.8em] sm:text-[2.2em] lg:text-[2.5em]'>THE <span
                            class='text-[2.5em] sm:text-[3em] lg:text-[4em]'>Sphere</span></h1>
                    <p class='max-w-[300px] sm:max-w-[500px] text-[0.8em] sm:text-[1em] lg:text-[1.2em]'>
                        A sphere is a geometrical object in three-dimensional space that is the surface of a ball. Like a circle in
                        two dimensions, a sphere is defined mathematically as the set of points that are all at the same distance r
                        from a given point in three-dimensional space.
                    </p>
                </div>
            </div>
        `
    );

    // Add a renderer
    const canvas = useTSSelector(DOM, 'canvas', false) as HTMLCanvasElement;
    const renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    function animate() {
        requestAnimationFrame(animate);
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
        box.rotation.y += 0.005;
        renderer.render(scene, camera);
    }

    animate();

    // Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return ui;
}
