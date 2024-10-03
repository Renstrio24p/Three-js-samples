import { useTSElements } from '../../utils/hooks/useTSElements'
import { useTSMetaData } from '../../utils/hooks/useTSMetaData'
import * as THREE from 'three';
import { ConfigType } from './types/Camera';
import { useTSSelector } from '../../utils/hooks/useTSSelector';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import html from '../../utils/define/html';


export default function Cube(DOM: HTMLElement, title: string) {

    const config: ConfigType = {
        color: "#000000",
        camera: {
            fov: 75,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.4,
            far: 1000,
        }
    }
    useTSMetaData({
        name: 'Cube',
        description: '',
        author: ''
    });

    document.title = `${title} | Cube`;

    // Three.js Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(config.color);

    // Add a camera
    const camera = new THREE.PerspectiveCamera(...Object.values(config.camera));
    camera.position.z = 5;

    // Create and add a Cube Object
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshLambertMaterial({ color: "#468585", emissive: "#468585" });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Add lighting
    const light = new THREE.SpotLight("#FFFFFF", 10);
    light.position.set(1, 1, 1);
    scene.add(light);

    // Add Controls
    const controls = new OrbitControls(camera, DOM);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.enableRotate = true; // Enable touch interactions for mobile

    // Real DOM and layout
    const ui = useTSElements(
        DOM,
        html`
            <div class='relative w-full h-full'>
                <canvas id="canvas"></canvas>
                <div class='absolute top-[40%] left-[10%] md:left-[20%] text-white'>
                    <h1 class='text-[1.8em] sm:text-[2.2em] lg:text-[2.5em]'>THE <span
                            class='text-[2.5em] sm:text-[3em] lg:text-[4em]'>Cube</span></h1>
                    <p class='max-w-[450px] sm:max-w-[650px] text-[0.8em] sm:text-[1em] lg:text-[1.2em]'>
                        A cube is a three-dimensional shape that has six identical square faces. It is also a prism because it has
                        the same cross-section along a length. It is also a regular solid. It has 12 edges, 6 faces, and 8 vertices.
                        It is also a square parallelepiped, an equilateral cuboid, and a right rhombohedron. It is a regular square
                        prism in three orientations. It is also a trigonal trapezohedron in any of three orientations.
                    </p>
                </div>
            </div>
        `
    );

    const canvas = useTSSelector(DOM, 'canvas', false) as HTMLCanvasElement;
    const renderer = new THREE.WebGLRenderer({ canvas });

    // Ensure canvas is responsive
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        controls.update(); // Update controls every frame
        renderer.render(scene, camera);
    }

    animate();

    // Update canvas and camera size on window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return ui;
}
