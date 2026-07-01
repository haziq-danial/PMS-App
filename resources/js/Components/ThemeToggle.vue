<script setup>
import { useColorMode } from '@vueuse/core';
import { Sun, Moon } from '@lucide/vue';
import { Button } from '@/Components/ui/button';

// Persists to localStorage ('vueuse-color-scheme') and toggles the `.dark`
// class on <html>; the blade head reads the same key to avoid a flash on load.
const mode = useColorMode();

const toggle = () => {
    mode.value = mode.value === 'dark' ? 'light' : 'dark';
};
</script>

<template>
    <Button variant="ghost" size="icon" @click="toggle" aria-label="Toggle theme">
        <Sun class="size-5 dark:hidden" />
        <Moon class="hidden size-5 dark:block" />
    </Button>
</template>
