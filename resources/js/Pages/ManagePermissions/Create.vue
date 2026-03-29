<script setup>
import GroupInput from '../../Components/FormInputs/GroupInput.vue';
import PageHeader from '../../Components/PageHeader.vue';
import { useForm } from '@inertiajs/vue3';

const form = useForm({
    name: ''
});
const submit = () => {
    form.post(route('manage-permissions.store'), {
        onSuccess: () => form.reset(),
    });
};

const title = "Create Roles";
const pageTitle = ` | ${title}`;
const user = "Admin";
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
                            <div
                                class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10 border-b border-b-black/10 pb-12">
                                <div>
                                    <h2 class="text-base font-semibold leading-7">Permission Information</h2>
                                </div>
                                <div class="md:col-span-2 space-y-8">
                                    <div class="max-w-1/2">
                                        <GroupInput legend="Permission name" placeholder="permission"
                                            v-model="form.name" input_type="text" />
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center justify-end gap-x-6">
                                <a :href="route('manage-permissions.index')" class="btn btn-ghost">Cancel</a>
                                <button type="submit" :disabled="form.processing"
                                    class="btn btn-primary">{{ form.processing ? 'Sending...' : 'Submit' }}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>