<script setup>
import { h, ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';
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
    // Laravel paginator payload: { data, total, current_page, per_page, ... }
    roles: Object,
});

// Controlled table state, seeded from the paginator the server sent.
const sorting = ref([]);
const pagination = ref({
    pageIndex: (props.roles?.current_page ?? 1) - 1,
    pageSize: props.roles?.per_page ?? 5,
});
const loading = ref(false);

// Reset to the first page whenever the page size changes.
watch(() => pagination.value.pageSize, (size, prev) => {
    if (size !== prev && pagination.value.pageIndex !== 0) {
        pagination.value = { ...pagination.value, pageIndex: 0 };
    }
});

// Reload the current page of roles from the server on any sort/page change.
watch([sorting, pagination], () => {
    const sort = sorting.value[0];
    router.get(route('manage-roles.index'), {
        page: pagination.value.pageIndex + 1,
        per_page: pagination.value.pageSize,
        sort: sort?.id,
        direction: sort ? (sort.desc ? 'desc' : 'asc') : undefined,
    }, {
        only: ['roles'],
        preserveState: true,
        preserveScroll: true,
        replace: true,
        onStart: () => (loading.value = true),
        onFinish: () => (loading.value = false),
    });
}, { deep: true });

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
                    <DataTable
                        manual
                        :columns="columns"
                        :data="roles?.data ?? []"
                        :row-count="roles?.total ?? 0"
                        :loading="loading"
                        v-model:sorting="sorting"
                        v-model:pagination="pagination"
                        empty-message="No roles found."
                    />
                </CardContent>
            </Card>
        </div>
    </div>
</template>
