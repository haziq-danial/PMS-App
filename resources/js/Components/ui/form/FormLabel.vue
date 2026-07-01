<script setup>
import { Label } from '@/Components/ui/label';

defineProps({
    for: { type: String, required: false },
});
</script>

<template>
    <Label data-slot="form-label" :for="for">
        <slot />
    </Label>
</template>
