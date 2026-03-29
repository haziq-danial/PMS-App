<script setup>
import PageHeader from '../../Components/PageHeader.vue';
import GroupInput from '../../Components/FormInputs/GroupInput.vue';
import Multiselect from '../../Components/FormInputs/Multiselect.vue';
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
const title = "Create Roles";
const pageTitle = ` | ${title}`;
const user = "Admin";

const props = defineProps({
    permissions: Array
});

const form = useForm({
    name: '',
    selected_permissions: []
});

const submit = () => {
    form
    .transform((data) => ({
        ...data,
        selected_permissions: data.selected_permissions.map(p => p.label),
    }))
    .post(route('manage-roles.store'), {
        onSuccess: () => form.reset()
    });
};

</script>
<template>
    <div>

        <Head :title="pageTitle"></Head>
        <PageHeader :title="title" :user-type="user" />
        <div class="mt-6">
            <div class="flex md:flex-row md:flex-wrap">
                <div class="card w-full gap-0 bg-white rounded-md shadow">
                    <form @submit.prevent="submit">
                        <div class="card-body p-8 space-y-12">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10 border-b border-b-black/10 pb-12">
                                <div>
                                    <h2 class="text-base font-semibold leading-7">Role Information</h2>
                                </div>
                                <div class="md:col-span-2 space-y-8">
                                    <div class="max-w-1/2">
                                        <GroupInput legend="Role Name" placeholder="Role" v-model="form.name" input_type="text"/>
                                    </div>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
                                <div>
                                    <h2 class="text-base font-semibold leading-7">Assign Permissions</h2>
                                </div>
                                <div class="md:col-span-2 space-y-10 flex-wrap">
                                    <Multiselect v-model="form.selected_permissions" :options="permissions"/>
                                </div>
                            </div>
                            <div class="flex items-center justify-end gap-x-6 border-t border-black/10 pt-8">
                                <a :href="route('manage-roles.index')" class="btn btn-ghost">Cancel</a>
                                <button type="submit" class="btn btn-primary" :disabled="form.processing">
                                    {{ form.processing ? 'Sending...' : 'Submit' }}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>