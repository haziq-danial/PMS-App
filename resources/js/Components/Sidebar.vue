<script setup>
import { usePage } from '@inertiajs/vue3';
import { House, LayoutDashboard, Users, Shield, Settings } from '@lucide/vue';
import { cn } from '@/lib/utils';

const emit = defineEmits(['navigate']);

// Single source of truth: the route name drives both the link and active state.
const navItems = [
    { icon: House, title: 'Homepage', routeName: 'home' },
    { icon: LayoutDashboard, title: 'Dashboard', routeName: 'dashboard' },
    { icon: Users, title: 'Manage Users', routeName: 'manage-users.index' },
    { icon: Shield, title: 'Manage Roles', routeName: 'manage-roles.index' },
    { icon: Settings, title: 'Manage Permissions', routeName: 'manage-permissions.index' },
];

const page = usePage();

// Compare by section (the part before the first dot) so any sub-route of a
// section — e.g. `manage-roles.create` — keeps its nav item highlighted.
const section = (name) => (name ?? '').split('.')[0];
const isActive = (routeName) =>
    section(page.props.currentRouteName) === section(routeName);
</script>

<template>
    <div class="flex h-full w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
        <div class="flex h-14 items-center gap-2 border-b px-5 font-semibold tracking-tight">
            PETAKOM
        </div>
        <nav class="flex-1 space-y-1 p-3">
            <Link
                v-for="item in navItems"
                :key="item.routeName"
                :href="route(item.routeName)"
                @click="emit('navigate')"
                :class="cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item.routeName)
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
