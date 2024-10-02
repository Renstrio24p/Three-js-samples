import NotFound from "../../pages/404/NotFound";
import Home from "../../pages/home/Home";
import { useTSPurifier } from "../../utils/hooks/useTSPurifier";
import { TSRouter } from "../../utils/routes/class/Router.class";
import Cone from "../geometry/Cone";
import Cube from "../geometry/Cube";
import Donot from "../geometry/Donot";
import Intro from "../geometry/Intro";
import Sphere from "../geometry/Sphere";

export const Router = (DOM: HTMLElement, title: string) => {
    const routes = new TSRouter(
        [
            {
                path: "/",
                routeto: "/home"
            },
            {
                path: "/home",
                element: () => Home(DOM, title),
                children: [
                    {
                        path: "",
                        element: () => Cube(DOM, title),
                    },
                    {
                        path: "intro",
                        element: () => Intro(DOM, title),
                    },
                    {
                        path: "sphere",
                        element: () => Sphere(DOM, title),
                    },
                    {
                        path: "cone",
                        element: () => Cone(DOM, title),
                    },
                    {
                        path: "donut",
                        element: () => Donot(DOM, title),
                    },
                ]
            },
            {
                path: "*",
                element: () => NotFound(DOM, title),
            },
        ],
        [String(useTSPurifier(window.location.search))]
    )
    return routes.navigate("");
};
