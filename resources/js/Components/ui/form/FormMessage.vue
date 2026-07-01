<script setup>
import { cn } from '@/lib/utils';

const props = defineProps({
    class: { type: null, required: false },
});
</script>

<template>
    <p data-slot="form-message" :class="cn('text-sm text-destructive', props.class)">
        <slot />
    </p>
</template>
