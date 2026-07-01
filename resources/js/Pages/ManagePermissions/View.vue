<script setup>
import { h, ref, watch, computed } from 'vue';
import { useForm } from '@inertiajs/vue3';
import { Plus, Pencil, Trash2, ArrowUpDown } from '@lucide/vue';
import { useServerTable } from '@/composables/useServerTable';
import { useDeleteResource } from '@/composables/useDeleteResource';
import PageHeader from '@/Components/PageHeader.vue';
import DataTable from '@/Components/DataTable/DataTable.vue';
import GroupInput from '@/Components/FormInputs/GroupInput.vue';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
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
import UnderscoreInput from '@/Components/FormInputs/UnderscoreInput.vue';

const title = 'Manage Permissions';
const pageTitle = ` | ${title}`;
const user = 'Admin';

const props = defineProps({
    // Laravel paginator payload: { data, total, current_page, per_page, ... }
    permissions: Object,
});

/* ---------------------------------------------------------------------------
 * Server-side table state
 * ------------------------------------------------------------------------- */
const { sorting, pagination, loading, query: tableQuery } = useServerTable({
    routeName: 'manage-permissions.index',
    paginator: props.permissions,
    only: ['permissions'],
});

/* ---------------------------------------------------------------------------
 * Create / edit modal (one form, two modes)
 * ------------------------------------------------------------------------- */
const showForm = ref(false);
const editing = ref(null);
const isEditing = computed(() => editing.value !== null);

const form = useForm({
    name: '',
});

const openCreate = () => {
    editing.value = null;
    form.reset();
    form.clearErrors();
    showForm.value = true;
};

const openEdit = (permission) => {
    editing.value = permission;
    form.clearErrors();
    form.name = permission.name;
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

    if (isEditing.value) {
        form.put(route('manage-permissions.update', {
            permission_id: editing.value.id,
            ...tableQuery.value,
        }), options);
    } else {
        form.post(route('manage-permissions.store', tableQuery.value), options);
    }
};

watch(showForm, (open) => {
    if (!open) {
        form.reset();
        form.clearErrors();
        editing.value = null;
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
} = useDeleteResource('manage-permissions.destroy', tableQuery);

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
        accessorKey: 'name',
        header: ({ column }) =>
            h(Button, {
                variant: 'ghost',
                class: '-ml-3 h-8',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Name', h(ArrowUpDown, { class: 'size-4' })]),
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
                        New Permission
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable
                        manual
                        :columns="columns"
                        :data="permissions?.data ?? []"
                        :row-count="permissions?.total ?? 0"
                        :loading="loading"
                        v-model:sorting="sorting"
                        v-model:pagination="pagination"
                        empty-message="No permissions found."
                    />
                </CardContent>
            </Card>
        </div>

        <!-- Create / edit modal -->
        <Dialog v-model:open="showForm">
            <DialogContent class="sm:max-w-md">
                <form @submit.prevent="submit">
                    <DialogHeader>
                        <DialogTitle>{{ isEditing ? 'Edit Permission' : 'New Permission' }}</DialogTitle>
                        <DialogDescription>
                            {{ isEditing
                                ? 'Rename this permission.'
                                : 'Name the permission you want to create.' }}
                        </DialogDescription>
                    </DialogHeader>

                    <div class="py-4">
                        <GroupInput
                            legend="Permission Name"
                            placeholder="permission"
                            input_type="text"
                            v-model="form.name"
                            :required="true"
                            :err_msg="form.errors.name"
                        >
                            <template #default="{ id }">
                                <UnderscoreInput
                                    :id="id"
                                    v-model="form.name"
                                    name="name"
                                    autocomplete="name"
                                    placeholder="permission"
                                    :aria-describedby="form.errors.name ? `${id}-message` : undefined"
                                    :aria-invalid="!!form.errors.name"
                                />
                            </template>
                        </GroupInput>
                    </div>

                    <DialogFooter>
                        <DialogClose as-child>
                            <Button type="button" variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" :disabled="form.processing">
                            {{ form.processing ? 'Saving…' : (isEditing ? 'Update Permission' : 'Save Permission') }}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        <!-- Delete confirmation -->
        <AlertDialog v-model:open="showDelete">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete this permission?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the
                        <span class="font-medium text-foreground">{{ deleteTarget?.name }}</span>
                        permission. This action cannot be undone.
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
