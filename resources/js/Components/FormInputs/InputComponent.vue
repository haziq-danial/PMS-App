<template>
    <input :type="input_type" :name="input_name" :value="value" v-bind="$attrs"/>
</template>
<script setup>
    defineProps({
        input_type: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        input_name: {
            type: String,
            required: true
        }
    });
</script>