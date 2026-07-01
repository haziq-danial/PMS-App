<script setup>
import { h, ref, watch, computed } from 'vue';
import { useForm } from '@inertiajs/vue3';
import { Plus, Pencil, Trash2, ArrowUpDown } from '@lucide/vue';
import { useServerTable } from '@/composables/useServerTable';
import { useDeleteResource } from '@/composables/useDeleteResource';
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
} from '@/Components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/Components/ui/alert-dialog';

const title = 'Manage Roles';
const pageTitle = ` | ${title}`;
const user = 'Admin';

const props = defineProps({
    // Laravel paginator payload: { data, total, current_page, per_page, ... }
    roles: Object,
    // Options for the permission picker: [{ id, label }]
    permissions: Array,
});

/* ---------------------------------------------------------------------------
 * Server-side table state
 * ------------------------------------------------------------------------- */
const { sorting, pagination, loading, query: tableQuery } = useServerTable({
    routeName: 'manage-roles.index',
    paginator: props.roles,
    only: ['roles'],
});

/* ---------------------------------------------------------------------------
 * Create / edit modal (one form, two modes)
 * ------------------------------------------------------------------------- */
const showForm = ref(false);
const editingRole = ref(null);
const isEditing = computed(() => editingRole.value !== null);

const form = useForm({
    name: '',
    selected_permissions: [],
});

const openCreate = () => {
    editingRole.value = null;
    form.reset();
    form.clearErrors();
    showForm.value = true;
};

const openEdit = (role) => {
    editingRole.value = role;
    form.clearErrors();
    form.name = role.roles;
    // Re-hydrate the picker with the option objects matching this role's permissions.
    form.selected_permissions = (props.permissions ?? []).filter(
        (p) => role.permissions.includes(p.label),
    );
    showForm.value = true;
};

const submit = () => {
    const options = {
        preserveScroll: true,
        onSuccess: () => {
            form.reset();
            showForm.value = false;
        },
    };

    form.transform((data) => ({
        ...data,
        selected_permissions: data.selected_permissions.map((p) => p.label),
    }));

    if (isEditing.value) {
        form.put(route('manage-roles.update', {
            role_id: editingRole.value.id,
            ...tableQuery.value,
        }), options);
    } else {
        form.post(route('manage-roles.store', tableQuery.value), options);
    }
};

// Clear typed input / validation errors when the modal closes.
watch(showForm, (open) => {
    if (!open) {
        form.reset();
        form.clearErrors();
        editingRole.value = null;
    }
});

/* ---------------------------------------------------------------------------
 * Delete confirmation
 * ------------------------------------------------------------------------- */
const {
    open: showDelete,
    target: deleteTarget,
    deleting,
    ask: askDelete,
    confirm: confirmDelete,
} = useDeleteResource('manage-roles.destroy', tableQuery);

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
        cell: ({ row }) =>
            h('div', { class: 'flex justify-end gap-1.5' }, [
                h(Button, {
                    variant: 'outline',
                    size: 'icon-sm',
                    'aria-label': 'Edit',
                    onClick: () => openEdit(row.original),
                }, () => h(Pencil, { class: 'size-4' })),
                h(Button, {
                    variant: 'outline',
                    size: 'icon-sm',
                    class: 'text-destructive hover:text-destructive',
                    'aria-label': 'Delete',
                    onClick: () => askDelete(row.original),
                }, () => h(Trash2, { class: 'size-4' })),
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
                    <Button @click="openCreate">
                        <Plus class="size-4" />
                        New Role
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

        <!-- Create / edit modal -->
        <Dialog v-model:open="showForm">
            <DialogContent class="sm:max-w-lg">
                <form @submit.prevent="submit">
                    <DialogHeader>
                        <DialogTitle>{{ isEditing ? 'Edit Role' : 'New Role' }}</DialogTitle>
                        <DialogDescription>
                            {{ isEditing
                                ? 'Update the role name and the permissions it grants.'
                                : 'Name the role and assign the permissions it should grant.' }}
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
                            {{ form.processing ? 'Saving…' : (isEditing ? 'Update Role' : 'Save Role') }}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        <!-- Delete confirmation -->
        <AlertDialog v-model:open="showDelete">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete this role?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the
                        <span class="font-medium text-foreground">{{ deleteTarget?.roles }}</span>
                        role. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel :disabled="deleting">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        class="bg-destructive text-white hover:bg-destructive/90"
                        :disabled="deleting"
                        @click.prevent="confirmDelete"
                    >
                        {{ deleting ? 'Deleting…' : 'Delete' }}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>
