<template>
    <input v-model="model" type="radio" :name="radio_name" class="radio" :value="value" :id="identifier"/>
    <label class="label" :for="identifier">{{ label }}</label>
</template>
<script setup>
    defineProps({
        radio_name: {
            type: String,
            required: true
        },
        identifier: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    });
    const model = defineModel();
</script>