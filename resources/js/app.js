import './bootstrap';
import '../css/app.css';
import { createApp, h } from 'vue'
import { createInertiaApp, Head, Link } from '@inertiajs/vue3'
import Layouts from './Pages/Layouts/layouts.vue';
import { route, ZiggyVue } from 'ziggy-js';

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
            .component("Head", Head)
            .component("Link", Link)
            .component("route", route)
            .mount(el)
    },
})