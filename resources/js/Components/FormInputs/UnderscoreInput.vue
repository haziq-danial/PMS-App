<script setup>
import { Input } from '@/Components/ui/input';

const model = defineModel({
    type: String,
    default: '',
});

defineOptions({
    inheritAttrs: false,
});

function onUpdate(value) {
    model.value = String(value ?? '').replace(/\s+/g, '_');
}
</script>

<template>
    <Input
        v-bind="$attrs"
        :model-value="model"
        @update:model-value="onUpdate"
    />
</template>
