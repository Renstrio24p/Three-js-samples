import html from "../../utils/define/html";
import { useTSElements } from "../../utils/hooks/useTSElements";
import * as THREE from 'three';
import { useTSSelector } from "../../utils/hooks/useTSSelector";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ConfigType } from "./types/Camera";


export default function Cone(DOM: HTMLElement, title: string) {

    document.title = `${title} | Cone`;

    const config: ConfigType = {
        color: "#000000",
        camera: {
            fov: 75,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.1,
            far: 10,
        }
    }
    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(config.color);

    // Add a camera
    const camera = new THREE.PerspectiveCamera(...Object.values(config.camera));
    camera.position.z = 5;

    // Add a Cone
    const geometry = new THREE.ConeGeometry(1, 2, 32);
    const material = new THREE.MeshLambertMaterial({ color: "#468585", emissive: "#468585" });
    const cone = new THREE.Mesh(geometry, material);
    scene.add(cone);

    // Add a light
    const light = new THREE.SpotLight("FFFFFF", 10);
    light.position.set(1, 1, 1);
    scene.add(light);

    // Add Controls
    const controls = new OrbitControls(camera, DOM);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.enablePan = false;  // Disabling panning for better mobile experience
    controls.enableRotate = true;  // Ensure rotation works on mobile (touch-enabled)

    // Real DOM
    const ui = useTSElements(DOM,
        html`
        <div class='relative'>
            <canvas id="canvas" class='w-full h-full'></canvas>
            <div class='absolute top-[50%] left-[10%] sm:left-[20%] text-white text-center sm:text-left'>
                <h1 class='text-[1.5em] sm:text-[2em]'>THE <span class='text-[2.5em] sm:text-[3em]'>Cone</span></h1>
                <p class='max-w-[280px] sm:max-w-[340px] text-[0.8em] sm:text-[1em]'>
                    Cone is a three-dimensional geometric shape that tapers smoothly from a flat base
                    (frequently, though not necessarily, circular) to a point called the apex or vertex.
                </p>
            </div>
        </div>
        `
    );

    const canvas = useTSSelector(DOM, 'canvas', false) as HTMLCanvasElement;
    const renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setPixelRatio(window.devicePixelRatio);  // Handle high-resolution screens
    renderer.setSize(window.innerWidth, window.innerHeight);

    function animate() {
        requestAnimationFrame(animate);
        cone.rotation.x += 0.01;
        cone.rotation.y += 0.01;
        controls.update();  // Update controls each frame
        renderer.render(scene, camera);
    }

    animate();

    // Responsive resizing
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return ui;
}
