import html from "../../utils/define/html";
import { useTSElements } from "../../utils/hooks/useTSElements";
import { useTSSelector } from "../../utils/hooks/useTSSelector";
import * as THREE from 'three';
import { ConfigType } from "./types/Camera";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


export default function Intro(DOM: HTMLElement, title: string) {

    document.title = `${title} | Intro`;

    const config: ConfigType = {
        color: "#000000",
        camera: {
            fov: 75,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.1,
            far: 1000,
        }
    }
    // Create a Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(config.color);

    // Add a Camera
    const camera = new THREE.PerspectiveCamera(...Object.values(config.camera));
    camera.position.z = 5;

    // Objects
    const geometry = new THREE.DodecahedronGeometry();
    const material = new THREE.MeshLambertMaterial({ color: "#468585", emissive: "#468585" });
    const dodecahedron = new THREE.Mesh(geometry, material);

    const boxGeometry = new THREE.BoxGeometry(2, 0.1, 2);
    const boxMaterial = new THREE.MeshStandardMaterial({ color: "#B4B4B3", emissive: "#B4B4B3" });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.y = -1.5;

    scene.add(dodecahedron);
    scene.add(box);

    // Lights
    const light = new THREE.SpotLight("FFFFFF", 10);
    light.position.set(1, 1, 1);
    scene.add(light);

    // Real DOM
    const ui = useTSElements(DOM,
        html`
            <div class='relative w-full h-full'>
                <canvas id="canvas"></canvas>
                <div class='absolute top-[40%] left-[5%] md:left-[20%] text-white'>
                    <h1 class='text-[1.8em] sm:text-[2.2em] lg:text-[2.5em]'>THE <span
                            class='text-[1.5em] sm:text-[2em] lg:text-[2em]'>Dodecahedron</span></h1>
                    <p class='max-w-[300px] sm:max-w-[500px] text-[0.8em] sm:text-[1em] lg:text-[1.2em]'>
                        In geometry, a dodecahedron is any polyhedron with twelve flat faces. The most familiar dodecahedron is the
                        regular dodecahedron, which is a Platonic solid. There are also three regular star dodecahedra, which are
                        constructed as stellations of the convex form.
                    </p>
                </div>
            </div>
    `);

    const canvas = useTSSelector(DOM, 'canvas', false) as HTMLCanvasElement;
    const renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Add Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;

    // Add Animation
    function animate() {
        requestAnimationFrame(animate);
        dodecahedron.rotation.x += 0.01;
        dodecahedron.rotation.y += 0.01;

        box.rotation.y += 0.005;

        controls.update();
        renderer.render(scene, camera);
    }

    // Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();

    return ui;
}
