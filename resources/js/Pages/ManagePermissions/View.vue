<script setup>
import { ref } from 'vue';
// import DataTable from '../../Components/DataTable.vue';
import PlusIcon from '../../Components/Icons/PlusIcon.vue';
import PageHeader from '../../Components/PageHeader.vue';
import { DataTable, Column, Button } from 'primevue';


const title = "Manage Permissions";
const pageTitle = ` | ${title}`;
const user = "Admin";

const props = defineProps({
    permissions: Array
});

const columns = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Permission Name' }
];

const rows = ref([
    {
        id: 1,
        name: 'can_manage_roles'
    },
    {
        id: 2,
        name: 'can_manage_users'
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
                            <DataTable :value="permissions" paginator rows="5">
                                <template #empty> No permissions found </template>
                                <Column field="id" header="#"></Column>
                                <Column field="name" header="Name"></Column>
                                <Column headerStyle="width: 5rem; text-align: center"
                                    bodyStyle="text-align: center; overflow: visible; display: flex; gap: 10px;">
                                    <template #body>
                                        <Button type="button" icon="pi pi-pencil" severity="secondary" variant="outlined" rounded />
                                        <Button type="button" icon="pi pi-trash" severity="danger" variant="outlined" rounded />
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>