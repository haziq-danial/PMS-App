<script setup>
import { ref } from 'vue';
import DataTable from '../../Components/DataTable.vue';
import PlusIcon from '../../Components/Icons/PlusIcon.vue';
import PencilIcon from '../../Components/Icons/PencilIcon.vue';
import TrashIcon from '../../Components/Icons/TrashIcon.vue';
import PageHeader from '../../Components/PageHeader.vue';
const title = "Manage Permissions";
const pageTitle = ` | ${title}`;
const user = "Admin";

const columns = [
    { key: 'id', label: '#' },
    { key: 'permission_name', label: 'Permission Name' }
];

const rows = ref([
    {
        id: 1,
        permission_name: 'can_manage_roles'
    },
    {
        id: 2,
        permission_name: 'can_manage_users'
    }
]);
</script>

<template>
    <div>

        <Head :title="pageTitle"></Head>
        <PageHeader :title="title" :user-type="user" />
        <div class="mt-6">
            <div class="flex md:flex-row md:flex-wrap">
                <div class="card w-full gap-0 bg-white rounded-md shadow">
                    <div class="card-body p-2">
                        <!-- table header -->
                        <div class="flex p-10 pb-0 pt-5 justify-end gap-3">
                            <a :href="route('manage-permissions.create')" class="btn btn-primary">
                                <PlusIcon class="size-[1.2em]" />
                                New Permission
                            </a>
                        </div>
                        <div class="mt-0 pt-0 overflow-x-auto p-10">
                            <DataTable :columns="columns" :items="rows" class="table table-fixed w-full table-zebra">
                                <template #header-id="{ col }">
                                    <th class="w-1/12 whitespace-nowrap text-left">{{ col.label }}</th>
                                </template>
                                <template #header-end-actions>
                                    <th></th>
                                </template>
                                <template #body-end-actions>
                                    <td>
                                        <div class="mt-1 flex flex-wrap gap-3">
                                            <button class="btn btn-sm btn-warning">
                                                Edit
                                                <PencilIcon stroke-width="2" class="size-[1.7em]"/>
                                            </button>
                                            <button class="btn btn-sm btn-error">
                                                Delete
                                                <TrashIcon stroke-width="2" class="size-[1.7em]"/>
                                            </button>
                                        </div>
                                    </td>
                                </template>
                            </DataTable>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>