<script setup>
import { cn } from '@/lib/utils';

const props = defineProps({
    class: { type: null, required: false },
});
</script>

<template>
    <form data-slot="form" :class="cn('space-y-6', props.class)">
        <slot />
    </form>
</template>
