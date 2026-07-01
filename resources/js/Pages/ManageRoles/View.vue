<script setup>
import { h, ref, watch } from 'vue';
import { router, useForm } from '@inertiajs/vue3';
import { Plus, Pencil, Trash2, ArrowUpDown } from '@lucide/vue';
import PageHeader from '@/Components/PageHeader.vue';
import DataTable from '@/Components/DataTable/DataTable.vue';
import GroupInput from '@/Components/FormInputs/GroupInput.vue';
import Multiselect from '@/Components/FormInputs/Multiselect.vue';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Label } from '@/Components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
    DialogTrigger,
} from '@/Components/ui/dialog';

const title = 'Manage Roles';
const pageTitle = ` | ${title}`;
const user = 'Admin';

const props = defineProps({
    // Laravel paginator payload: { data, total, current_page, per_page, ... }
    roles: Object,
    // Options for the create-role permission picker: [{ id, label }]
    permissions: Array,
});

/* ---------------------------------------------------------------------------
 * Server-side table state
 * ------------------------------------------------------------------------- */
const sorting = ref([]);
const pagination = ref({
    pageIndex: (props.roles?.current_page ?? 1) - 1,
    pageSize: props.roles?.per_page ?? 5,
});
const loading = ref(false);

watch(() => pagination.value.pageSize, (size, prev) => {
    if (size !== prev && pagination.value.pageIndex !== 0) {
        pagination.value = { ...pagination.value, pageIndex: 0 };
    }
});

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

/* ---------------------------------------------------------------------------
 * Create-role modal
 * ------------------------------------------------------------------------- */
const showCreate = ref(false);

const form = useForm({
    name: '',
    selected_permissions: [],
});

const submit = () => {
    form
        .transform((data) => ({
            ...data,
            selected_permissions: data.selected_permissions.map((p) => p.label),
        }))
        .post(route('manage-roles.store'), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                showCreate.value = false;
            },
        });
};

// Discard any typed input / validation errors when the modal is dismissed.
watch(showCreate, (open) => {
    if (!open) {
        form.reset();
        form.clearErrors();
    }
});

/* ---------------------------------------------------------------------------
 * Table columns
 * ------------------------------------------------------------------------- */
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
                    <Dialog v-model:open="showCreate">
                        <DialogTrigger as-child>
                            <Button>
                                <Plus class="size-4" />
                                New Role
                            </Button>
                        </DialogTrigger>
                        <DialogContent class="sm:max-w-lg">
                            <form @submit.prevent="submit">
                                <DialogHeader>
                                    <DialogTitle>New Role</DialogTitle>
                                    <DialogDescription>
                                        Name the role and assign the permissions it should grant.
                                    </DialogDescription>
                                </DialogHeader>

                                <div class="space-y-4 py-4">
                                    <GroupInput
                                        legend="Role Name"
                                        placeholder="Role"
                                        input_type="text"
                                        v-model="form.name"
                                        :required="true"
                                        :err_msg="form.errors.name"
                                    />
                                    <div class="grid gap-2">
                                        <Label>Permissions</Label>
                                        <Multiselect v-model="form.selected_permissions" :options="permissions" />
                                    </div>
                                </div>

                                <DialogFooter>
                                    <DialogClose as-child>
                                        <Button type="button" variant="ghost">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit" :disabled="form.processing">
                                        {{ form.processing ? 'Saving…' : 'Save Role' }}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
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
