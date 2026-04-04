import './bootstrap';
import '../css/app.css';
import { createApp, h } from 'vue'
import { createInertiaApp, Head, Link } from '@inertiajs/vue3'
import Layouts from './Pages/Layouts/layouts.vue';
import { route, ZiggyVue } from 'ziggy-js';

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes';

const Noir = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{zinc.50}',
            100: '{zinc.100}',
            200: '{zinc.200}',
            300: '{zinc.300}',
            400: '{zinc.400}',
            500: '{zinc.500}',
            600: '{zinc.600}',
            700: '{zinc.700}',
            800: '{zinc.800}',
            900: '{zinc.900}',
            950: '{zinc.950}'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{zinc.950}',
                    inverseColor: '#ffffff',
                    hoverColor: '{zinc.900}',
                    activeColor: '{zinc.800}'
                },
                highlight: {
                    background: '{zinc.950}',
                    focusBackground: '{zinc.700}',
                    color: '#ffffff',
                    focusColor: '#ffffff'
                }
            },
            dark: {
                primary: {
                    color: '{zinc.50}',
                    inverseColor: '{zinc.950}',
                    hoverColor: '{zinc.100}',
                    activeColor: '{zinc.200}'
                },
                highlight: {
                    background: 'rgba(250, 250, 250, .16)',
                    focusBackground: 'rgba(250, 250, 250, .24)',
                    color: 'rgba(255,255,255,.87)',
                    focusColor: 'rgba(255,255,255,.87)'
                }
            }
        }
    }
});

createInertiaApp({
    title: (title) => `PETAKOM ${title}`,
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.vue', { eager: true });

        let page = pages[`./Pages/${name}.vue`];

        page.default.layout = page.default.layout || Layouts;

        return page;
    },
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue, Ziggy)
            .use(PrimeVue, {
                theme: {
                    preset: Noir,
                    options: {
                        darkModeSelector: false
                    }
                }
            })
            .component("Head", Head)
            .component("Link", Link)
            .component("route", route)
            .mount(el)
    },
})