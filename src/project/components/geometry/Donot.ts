import html from "../../utils/define/html";
import { useTSElements } from "../../utils/hooks/useTSElements";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useTSSelector } from "../../utils/hooks/useTSSelector";

export default function Donot(DOM: HTMLElement, title: string) {

    document.title = `${title} | Donot`;

    // Add scene

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000000");

    // Add camera

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Add a Donot

    const geometry = new THREE.TorusGeometry();
    const material = new THREE.MeshLambertMaterial({ color: "#468585", emissive: "#468585" });
    const donot = new THREE.Mesh(geometry, material);
    scene.add(donot);

    // Add a light

    const light = new THREE.SpotLight("FFFFFF", 10);
    light.position.set(1, 1, 1);
    scene.add(light);

    // Add a Controls

    const controls = new OrbitControls(camera, DOM);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Real DOM

    const ui = useTSElements(DOM, html`
    <div class='relative'>
        <canvas id="canvas"></canvas>
        <div class='absolute top-[50%] left-[5%] md:left-[20%] text-white'>
            <h1 class='text-[2em]'>THE <span class='text-[3em]'>Donut</span></h1>
            <p class='max-w-[540px]'>
                A donut is a type of fried dough confection or dessert food. The donut is popular in many countries and
                prepared in various forms as a sweet snack that can be homemade or purchased in bakeries, supermarkets, food
                stalls, and franchised specialty vendors.
            </p>
        </div>
    </div>
    `);

    const canvas = useTSSelector(DOM, 'canvas', false) as HTMLCanvasElement;
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    function animate() {
        requestAnimationFrame(animate);
        donot.rotation.x += 0.01;
        donot.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();


    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return ui;

}