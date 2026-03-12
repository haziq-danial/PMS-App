<script setup>
import GroupInput from '../../Components/FormInputs/GroupInput.vue';
import PageHeader from '../../Components/PageHeader.vue';
const title = "Create Roles";
const pageTitle = ` | ${title}`;
const user = "Admin";
</script>

<template>
    <div>
        <Head :title="pageTitle"></Head>
        <PageHeader :title="title" :user-type="user"/>
        <div class="mt-6">
            <div class="flex md:flex-row md:flex-wrap">
                <div class="card w-full gap-0 bg-white rounded-md shadow">
                    <div class="card-body p-8 space-y-12">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10 border-b border-b-black/10 pb-12">
                            <div>
                                <h2 class="text-base font-semibold leading-7">Permission Information</h2>
                            </div>
                            <div class="md:col-span-2 space-y-8">
                                <div class="max-w-1/2">
                                    <GroupInput legend="Permission name" placeholder="permission" input_name="permission_name" input_type="text"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>