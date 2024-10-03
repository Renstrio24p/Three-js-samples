import html from "../../utils/define/html";
import { useAnchor } from "../../utils/hooks/useTSAnchor";
import { useTSElements } from "../../utils/hooks/useTSElements";
import { useTSSelector } from "../../utils/hooks/useTSSelector";

export default function Navbar(DOM: HTMLElement) {
    const ui = useTSElements(DOM, html`
    <nav class='bg-gray-800 text-white'>
        <div class='container mx-auto flex justify-between items-center p-4'>
            <div class="text-lg font-bold">
                <a href="/">Shapes</a>
            </div>
            <div class="block lg:hidden">
                <button class="text-white focus:outline-none" id="menu-toggle">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7">
                        </path>
                    </svg>
                </button>
            </div>
            <ul id="menu" class="hidden lg:flex items-center gap-6">
                <li><a href="/">Cube</a></li>
                <li><a href="/home/sphere">Sphere</a></li>
                <li><a href="/home/donut">Donut</a></li>
                <li><a href="/home/cone">Cone</a></li>
                <li><a href="/home/intro">Dodecahedron</a></li>
            </ul>
            <div>
                <a href='/any' class='text-white font-semibold'>Not Found</a>
            </div>
        </div>
        <ul id="mobile-menu" class="lg:hidden hidden flex-col gap-4 p-4 bg-gray-800">
            <li><a href="/">Cube</a></li>
            <li><a href="/home/sphere">Sphere</a></li>
            <li><a href="/home/donut">Donut</a></li>
            <li><a href="/home/cone">Cone</a></li>
            <li><a href="/home/intro">Dodecahedron</a></li>
        </ul>
    </nav>
    `);

    // Toggle mobile menu visibility
    const menuToggle = useTSSelector(DOM, '#menu-toggle', false) as HTMLButtonElement;
    const mobileMenu = useTSSelector(DOM, '#mobile-menu', false) as HTMLElement;

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();  // Prevent event from bubbling to document
        mobileMenu.classList.toggle('hidden');  // Toggle the menu visibility
    });

    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!menuToggle.contains(target) && !mobileMenu.contains(target)) {
            mobileMenu.classList.add('hidden');  // Hide the menu if clicking outside
        }
    });

    // Use anchor selector and hooks for navigation
    const anchor = useTSSelector(DOM, 'a', true) as NodeListOf<HTMLAnchorElement>;
    useAnchor(anchor);

    return ui;
}
