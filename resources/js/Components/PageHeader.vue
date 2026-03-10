<template>
    <div class="flex justify-between items-center">
        <p class="font-medium text-lg">{{ title }}</p>
        <div class="breadcrumbs p-0 mr-1 text-sm inline">
            <ul>
                <li>PETAKOM</li>
                <li>{{ userType }}</li>
                <li>{{ title }}</li>
            </ul>
        </div>
    </div>
</template>

<script setup>
    defineProps({
        title: {
            type: String,
            required: true
        },
        userType: {
            type: String,
            required: true
        }
    });
</script>