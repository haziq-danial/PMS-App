<script setup>
import PageHeader from '../../Components/PageHeader.vue';
import GroupInput from '../../Components/FormInputs/GroupInput.vue';
import Multiselect from '../../Components/FormInputs/Multiselect.vue';
import { ref } from 'vue';
const title = "Create Roles";
const pageTitle = ` | ${title}`;
const user = "Admin";

// 1. Define your master list of options
const permissions = [
  { id: 1, label: 'Vue.js' },
  { id: 2, label: 'React' },
  { id: 3, label: 'Angular' },
  { id: 4, label: 'Svelte' },
  { id: 5, label: 'Nuxt' },
  { id: 6, label: 'Next.js' },
];

// 2. This ref will store the objects the user selects
const selectedPermissions = ref([]);
</script>
<template>
    <div>

        <Head :title="pageTitle"></Head>
        <PageHeader :title="title" :user-type="user" />
        <div class="mt-6">
            <div class="flex md:flex-row md:flex-wrap">
                <div class="card w-full gap-0 bg-white rounded-md shadow">
                    <div class="card-body p-8 space-y-12">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10 border-b border-b-black/10 pb-12">
                            <div>
                                <h2 class="text-base font-semibold leading-7">Role Information</h2>
                            </div>
                            <div class="md:col-span-2 space-y-8">
                                <div class="max-w-1/2">
                                    <GroupInput legend="Role Name" placeholder="Role" input_name="role_name" input_type="text"/>
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
                            <div>
                                <h2 class="text-base font-semibold leading-7">Assign Permission</h2>
                            </div>
                            <div class="md:col-span-2 space-y-10 flex-wrap">
                                <Multiselect v-model="selectedPermissions" :options="permissions"/>
                            </div>
                        </div>
                        <div class="flex items-center justify-end gap-x-6 border-t border-black/10 pt-8">
                            <a :href="route('manage-roles.index')" class="btn btn-ghost">Cancel</a>
                            <button class="btn btn-primary">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>