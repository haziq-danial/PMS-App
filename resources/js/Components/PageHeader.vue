<script setup>
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/Components/ui/breadcrumb';

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    // Kept for backward compatibility with existing pages; no longer part of the trail.
    userType: {
        type: String,
        required: false,
        default: '',
    },
});

const page = usePage();

// Human-readable labels for each route section (the part before the first dot).
const sectionLabels = {
    home: 'Home',
    dashboard: 'Dashboard',
    'manage-users': 'Manage Users',
    'manage-roles': 'Manage Roles',
    'manage-permissions': 'Manage Permissions',
};

// Labels for the trailing action; `index` collapses into the section itself.
const actionLabels = {
    create: 'Create',
    edit: 'Edit',
    show: 'View',
};

const crumbs = computed(() => {
    const routeName = page.props.currentRouteName ?? '';
    const items = [{ label: 'PETAKOM', href: route('home') }];

    if (!routeName || routeName === 'home') {
        // On the homepage, PETAKOM is the current page.
        items[0].href = null;
        return items;
    }

    const [section, action] = routeName.includes('.')
        ? routeName.split('.')
        : [routeName, null];
    const sectionLabel = sectionLabels[section] ?? section;
    const actionLabel = action ? actionLabels[action] : null;

    if (actionLabel) {
        // Sub-page: link back to the section's index, then the current action.
        items.push({ label: sectionLabel, href: route(`${section}.index`) });
        items.push({ label: actionLabel, href: null });
    } else {
        // Index / flat page: the section is the current page.
        items.push({ label: sectionLabel, href: null });
    }

    return items;
});
</script>

<template>
    <div class="flex items-center justify-between gap-4">
        <h1 class="text-lg font-semibold tracking-tight">{{ title }}</h1>
        <Breadcrumb>
            <BreadcrumbList>
                <template v-for="(crumb, index) in crumbs" :key="crumb.label">
                    <BreadcrumbItem>
                        <BreadcrumbLink v-if="crumb.href" as-child>
                            <Link :href="crumb.href">{{ crumb.label }}</Link>
                        </BreadcrumbLink>
                        <BreadcrumbPage v-else>{{ crumb.label }}</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator v-if="index < crumbs.length - 1" />
                </template>
            </BreadcrumbList>
        </Breadcrumb>
    </div>
</template>
