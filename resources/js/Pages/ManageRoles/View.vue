<script setup>
import PlusIcon from '../../Components/Icons/PlusIcon.vue';
import PageHeader from '../../Components/PageHeader.vue';

import { DataTable, Column, Button } from 'primevue';

const title = "Manage Roles";
const pageTitle = ` | ${title}`;
const user = "Admin";

const props = defineProps({
    roles: Array
});

const columns = [
    { key: 'roles', label: 'Roles' },
    { key: 'permissions', label: 'Permissions' },
];

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
                            <DataTable :value="roles" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
                                <template #empty> No roles found </template>
                                <Column field="id" header="#"></Column>
                                <Column field="roles" header="Name"></Column>
                                <Column field="permissions" header="Permissions">
                                    <template #body="slotProps">
                                        <div class="flex flex-wrap gap-2">
                                            <div v-for="item in slotProps.data.permissions" :key="item"
                                                class="badge badge-soft badge-primary">{{ item }}</div>
                                        </div>
                                    </template>
                                </Column>
                                <Column :pt="{
                                    headerCell: { class: 'w-1 text-center' },
                                    bodyCell: { class: 'text-center' }
                                }">
                                    <template #body>
                                        <div class="flex gap-1.5 justify-center" style="white-space: nowrap;">
                                            <Button type="button" icon="pi pi-pencil" severity="secondary"
                                                variant="outlined" rounded />
                                            <Button type="button" icon="pi pi-trash" severity="danger"
                                                variant="outlined" rounded />
                                        </div>
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
