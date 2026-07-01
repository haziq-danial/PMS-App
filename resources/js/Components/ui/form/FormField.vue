<script setup>
import { cn } from '@/lib/utils';

const props = defineProps({
    class: { type: null, required: false },
});
</script>

<template>
    <div data-slot="form-field" :class="cn('grid gap-2', props.class)">
        <slot />
    </div>
</template>
