<script setup>
import HomeIcon from '../Components/Icons/HomeIcon.vue';
import SettingsIcon from '../Components/Icons/SettingsIcon.vue';
import PieChartIcon from './Icons/PieChartIcon.vue';
import UserGroupIcon from './Icons/UserGroupIcon.vue';
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';

const routes = [
    {
        icon: {
            src: HomeIcon,
            className: 'my-1.5 inline-block size-5' 
        },
        title: 'Homepage',
        link: route('home'),
        linkName: 'home'
    },
    {
        icon: {
            src: PieChartIcon,
            className: 'my-1.5 inline-block size-5'

        },
        title: 'Dashboard',
        link: route('dashboard'),
        linkName: 'dashboard'
    },
    {
        icon: {
            src: UserGroupIcon,
            className: 'my-1.5 inline-block size-5'

        },
        title: 'Manage Users',
        link: route('manage-users.index'),
        linkName: 'manage-users.index'
    },
    {
        icon: {
            src: SettingsIcon,
            className: 'my-1.5 inline-block size-5'

        },
        title: 'Manage Roles',
        link: route('manage-roles.index'),
        linkName: 'manage-roles.index'
    },
    {
        icon: {
            src: SettingsIcon,
            className: 'my-1.5 inline-block size-5'

        },
        title: 'Manage Permissions',
        link: route('manage-permissions.index'),
        linkName: 'manage-permissions.index'
    },
];

const page = usePage();

const isActive = computed(() => {
    return (item) => {
        let currPage = page.props.currentRouteName;
        let routeName  = item.linkName;
        if (currPage.includes(".")) {
            currPage = page.props.currentRouteName.split(".")[0];
            
            routeName  = item.linkName.split(".")[0];
        }
        return currPage === routeName;
    };
});
</script>

<template>
    <div class="drawer-side is-drawer-close:overflow-visible shadow-[4px_0_6px_-4px_rgb(0,0,0,0.1)]">
        <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
        <div class="flex min-h-full flex-col items-start is-drawer-close:w-14 is-drawer-open:w-64">
            <!-- Sidebar content here -->
            <ul class="menu w-full grow">
                <!-- List item -->
                <li v-for="item in routes" :key="item.title" :class="[isActive(item) ? 'menu-active': '']">
                    <Link :href="item.link" class="is-drawer-close:tooltip is-drawer-close:tooltip-right" :data-tip="item.title">
                        <component :is="item.icon.src" :class="item.icon.className"/>
                        <span class="is-drawer-close:hidden">{{ item.title }}</span>
                    </Link>
                </li>
            </ul>
        </div>
    </div>
</template>