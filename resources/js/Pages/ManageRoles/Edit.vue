<script setup>
import PageHeader from '../../Components/PageHeader.vue';

const title = "Edit Permissions";
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
                    <div class="card-body p-2">
                        
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>