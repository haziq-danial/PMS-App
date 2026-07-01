<script setup>
import { h } from 'vue';
import { Plus, Pencil, Trash2, ArrowUpDown } from '@lucide/vue';
import PageHeader from '@/Components/PageHeader.vue';
import DataTable from '@/Components/DataTable/DataTable.vue';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

const title = 'Manage Roles';
const pageTitle = ` | ${title}`;
const user = 'Admin';

const props = defineProps({
    roles: Array,
});

const columns = [
    {
        accessorKey: 'id',
        header: '#',
        cell: ({ row }) => h('span', { class: 'text-muted-foreground' }, row.getValue('id')),
    },
    {
        accessorKey: 'roles',
        header: ({ column }) =>
            h(Button, {
                variant: 'ghost',
                class: '-ml-3 h-8',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Name', h(ArrowUpDown, { class: 'size-4' })]),
    },
    {
        accessorKey: 'permissions',
        header: 'Permissions',
        enableSorting: false,
        cell: ({ row }) =>
            h('div', { class: 'flex flex-wrap gap-1.5' },
                (row.getValue('permissions') || []).map((p) =>
                    h(Badge, { variant: 'secondary', key: p }, () => p),
                ),
            ),
    },
    {
        id: 'actions',
        header: () => h('div', { class: 'text-right' }, 'Actions'),
        enableSorting: false,
        cell: () =>
            h('div', { class: 'flex justify-end gap-1.5' }, [
                h(Button, { variant: 'outline', size: 'icon-sm', 'aria-label': 'Edit' }, () => h(Pencil, { class: 'size-4' })),
                h(Button, { variant: 'outline', size: 'icon-sm', class: 'text-destructive hover:text-destructive', 'aria-label': 'Delete' }, () => h(Trash2, { class: 'size-4' })),
            ]),
    },
];
</script>

<template>
    <div>
        <Head :title="pageTitle" />
        <PageHeader :title="title" :user-type="user" />
        <div class="mt-6">
            <Card>
                <CardHeader class="flex items-center justify-end">
                    <Button as-child>
                        <a :href="route('manage-roles.create')">
                            <Plus class="size-4" />
                            New Role
                        </a>
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable :columns="columns" :data="roles ?? []" empty-message="No roles found." />
                </CardContent>
            </Card>
        </div>
    </div>
</template>
