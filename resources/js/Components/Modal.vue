<script setup>
import { computed } from 'vue';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';

const props = defineProps({
    title: String,
    modelValue: Boolean,
    size: String,
});

const emit = defineEmits(['update:modelValue']);

const open = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});
</script>

<template>
    <Dialog v-model:open="open">
        <DialogContent :class="size">
            <DialogHeader v-if="title">
                <DialogTitle>{{ title }}</DialogTitle>
            </DialogHeader>

            <div class="py-2">
                <slot>Default modal content goes here.</slot>
            </div>

            <DialogFooter>
                <DialogClose as-child>
                    <Button variant="outline">Close</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
