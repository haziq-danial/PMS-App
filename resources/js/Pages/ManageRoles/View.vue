<script setup>
import {ref} from 'vue';
import PlusIcon from '../../Components/Icons/PlusIcon.vue';
import DataTable from '../../Components/DataTable.vue';
import PageHeader from '../../Components/PageHeader.vue';

const title = "Manage Roles";
const pageTitle = ` | ${title}`;
const user = "Admin";

const columns = [
    { key: 'roles', label: 'Roles' },
    { key: 'permissions', label: 'Permissions' },
];


const rows = ref([
    {
        id: 1,
        roles: 'Admin',
        permissions: [
            'can_manage_users',
            'can_manage_roles',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
        ],
    },
    {
        id: 2,
        roles: 'Users',
        permissions: [
            'can_manage_users',
            'can_manage_roles',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
            'can_manage_permissions',
        ],
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
                            <a :href="route('manage-roles.create')" class="btn btn-primary">
                                <PlusIcon class="size-[1.2em]" />
                                New Role
                            </a>
                        </div>
                        <div class="mt-0 pt-0 overflow-x-auto p-10">
                            <DataTable class="table table-fixed w-full" :columns="columns" :items="rows">
                                <template #header-roles="{ col }">
                                    <th class="w-1/12 whitespace-nowrap text-left">{{ col.label }}</th>
                                </template>
                                <template #header-permissions="{ col }">
                                    <th class="w-4/5 whitespace-nowrap text-left">{{ col.label }}</th>
                                </template>
                                <template #header-end-actions>
                                    <th></th>
                                </template>
                                
                                <template #permissions="{ item }">
                                    <td class="text-left mt-2 flex flex-wrap gap-2">
                                        <div v-for="item in item.permissions" class="badge badge-neutral">{{ item }}</div>
                                    </td>
                                </template>
                                <template #body-end-actions>
                                    <td>
                                        <div class="mt-1 flex flex-wrap gap-3">
                                            <button class="btn btn-sm btn-warning">
                                                Edit Role
                                            </button>
                                            <button class="btn btn-sm btn-error">
                                                Delete Role
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
