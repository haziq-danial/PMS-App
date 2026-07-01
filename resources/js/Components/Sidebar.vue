<script setup>
import { usePage } from '@inertiajs/vue3';
import { House, LayoutDashboard, Users, Shield, Settings, Building2 } from '@lucide/vue';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/Components/ui/sidebar';

// Single source of truth: the route name drives both the link and active state.
const navItems = [
    { icon: House, title: 'Homepage', routeName: 'home' },
    { icon: LayoutDashboard, title: 'Dashboard', routeName: 'dashboard' },
    { icon: Users, title: 'Manage Users', routeName: 'manage-users.index' },
    { icon: Shield, title: 'Manage Roles', routeName: 'manage-roles.index' },
    { icon: Settings, title: 'Manage Permissions', routeName: 'manage-permissions.index' },
];

const page = usePage();
const { isMobile, setOpenMobile } = useSidebar();

// Compare by section (the part before the first dot) so any sub-route of a
// section — e.g. `manage-roles.create` — keeps its nav item highlighted.
const section = (name) => (name ?? '').split('.')[0];
const isActive = (routeName) =>
    section(page.props.currentRouteName) === section(routeName);

// Close the mobile drawer after following a link.
const handleNavigate = () => {
    if (isMobile.value) setOpenMobile(false);
};
</script>

<template>
    <Sidebar collapsible="icon">
        <SidebarHeader class="border-b">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child :tooltip="'PETAKOM'">
                        <Link :href="route('home')" @click="handleNavigate">
                            <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <Building2 class="size-4" />
                            </div>
                            <span class="font-semibold tracking-tight">PETAKOM</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem v-for="item in navItems" :key="item.routeName">
                            <SidebarMenuButton
                                as-child
                                :is-active="isActive(item.routeName)"
                                :tooltip="item.title"
                            >
                                <Link :href="route(item.routeName)" @click="handleNavigate">
                                    <component :is="item.icon" />
                                    <span>{{ item.title }}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>
</template>
