import html from "../../utils/define/html";
import { useAnchor } from "../../utils/hooks/useTSAnchor";
import { useTSElements } from "../../utils/hooks/useTSElements";
import { useTSSelector } from "../../utils/hooks/useTSSelector";

export default function Navbar(DOM: HTMLElement) {

    const ui = useTSElements(DOM, html`
    <nav class='bg-gray-800 text-white'>
        <div class='container mx-auto flex justify-between items-center p-4'>
            <ul class="flex items-center gap-6">
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
    </nav>
`);
    // No React, no problem. Use the useTSSelector hook to get the anchor tags
    const anchor = useTSSelector(DOM, 'a', true) as NodeListOf<HTMLAnchorElement>;
    useAnchor(anchor);

    return ui;

}