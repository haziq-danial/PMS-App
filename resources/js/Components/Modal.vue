<template>
    <dialog ref="modalRef" class="modal" @close="closeModal">
        <div :class="['modal-box', size]">
            <h3 class="font-bold text-lg" v-if="title">{{ title }}</h3>

            <div class="py-4">
                <slot>Default modal content goes here.</slot>
            </div>

            <div class="modal-action">
                <form method="dialog">
                    <button class="btn" @click="closeModal">Close</button>
                </form>
            </div>
        </div>

        <form v-if="dismissable" method="dialog" class="modal-backdrop">
            <button @click="closeModal">close</button>
        </form>
    </dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    title: String,
    modelValue: Boolean,
    size: String,
    dismissable: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['update:modelValue']);
const modalRef = ref(null);

watch(() => props.modelValue, (isOpen) => {
    if (isOpen) {
        modalRef.value?.showModal();
    } else {
        modalRef.value?.close();
    }
});

const closeModal = () => {
    emit('update:modelValue', false);
}
</script>