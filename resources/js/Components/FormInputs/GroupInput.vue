<template>
    <div>
        <legend class="fieldset-legend">{{ legend }}</legend>
        <input v-model="model" :type="input_type" :name="input_name" :class="['input input-md w-full validator']"
            :placeholder="placeholder" :required="required" :autocomplete="input_name" />
        <p class="validator-hint hidden">{{ err_msg }}</p>
    </div>
</template>
<script setup>
defineProps({
    legend: {
        type: String,
        required: true
    },
    placeholder: {
        type: String,
        required: true
    },
    input_name: {
        type: String,
        required: false
    },
    input_type: {
        type: String,
        required: true
    },
    required: {
        type: Boolean,
        required: false
    },
    err_msg: {
        type: String,
        required: false
    }
});
const model = defineModel();
</script>