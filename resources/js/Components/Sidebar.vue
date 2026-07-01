<script setup>
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { House, LayoutDashboard, Users, Shield, Settings } from '@lucide/vue';
import { cn } from '@/lib/utils';

const emit = defineEmits(['navigate']);

const routes = [
    { icon: House, title: 'Homepage', link: route('home'), linkName: 'home' },
    { icon: LayoutDashboard, title: 'Dashboard', link: route('dashboard'), linkName: 'dashboard' },
    { icon: Users, title: 'Manage Users', link: route('manage-users.index'), linkName: 'manage-users.index' },
    { icon: Shield, title: 'Manage Roles', link: route('manage-roles.index'), linkName: 'manage-roles.index' },
    { icon: Settings, title: 'Manage Permissions', link: route('manage-permissions.index'), linkName: 'manage-permissions.index' },
];

const page = usePage();

const isActive = computed(() => {
    return (item) => {
        let currPage = page.props.currentRouteName;
        let routeName = item.linkName;
        if (currPage.includes('.')) {
            currPage = page.props.currentRouteName.split('.')[0];
            routeName = item.linkName.split('.')[0];
        }
        return currPage === routeName;
    };
});
</script>

<template>
    <div class="flex h-full w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
        <div class="flex h-14 items-center gap-2 border-b px-5 font-semibold tracking-tight">
            PETAKOM
        </div>
        <nav class="flex-1 space-y-1 p-3">
            <Link
                v-for="item in routes"
                :key="item.title"
                :href="item.link"
                @click="emit('navigate')"
                :class="cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item)
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )"
            >
                <component :is="item.icon" class="size-4 shrink-0" />
                <span>{{ item.title }}</span>
            </Link>
        </nav>
    </div>
</template>
