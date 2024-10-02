import html from "../../utils/define/html";
import { useTSElements } from "../../utils/hooks/useTSElements";

export default function Home(DOM: HTMLElement, title: string) {



    document.title = `${title} | Home`;

    const ui = useTSElements(DOM,
        html`
            <div>
                <div id="child"></div>
            </div>
        `);


    return ui;
}
