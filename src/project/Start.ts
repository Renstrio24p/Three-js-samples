
import Navbar from './components/navbar/Navbar';
import { Router } from './components/routes/Router';
import { useTSComponent } from './utils/hooks/useTSComponent';
import { useTSElements } from './utils/hooks/useTSElements'
import { useTSMetaData } from './utils/hooks/useTSMetaData'

export default function Start(DOM: HTMLElement) {
    useTSMetaData({
        name: 'Start',
        description: '',
        author: ''
    });

    const title = 'Three JS in TypeScript'

    const ui = useTSElements(
        DOM,
        /*html*/`
        <div class='bg-gradient-to-br from-black to-blue-400 min-h-screen'>
            <header id='navbar'></header>
            <main class='w-full h-screen flex items-center justify-center' id='router'></main>
        </div>
        `
    );

    useTSComponent('navbar', DOM, Navbar)
    useTSComponent('router', DOM, Router, title)

    return ui

}