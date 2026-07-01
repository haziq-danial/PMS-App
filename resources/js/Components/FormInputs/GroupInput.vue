<script setup>
import { computed, useId } from 'vue';
import { Input } from '@/Components/ui/input';
import {
    FormControl,
    FormDescription,
    FormField,
    FormLabel,
    FormMessage,
} from '@/Components/ui/form';

const props = defineProps({
    legend: { type: String, required: true },
    placeholder: { type: String, required: true },
    input_name: { type: String, required: false },
    input_type: { type: String, required: true },
    required: { type: Boolean, required: false },
    description: { type: String, required: false },
    err_msg: { type: String, required: false },
});

const model = defineModel();
const id = useId();
const descriptionId = computed(() => `${id}-description`);
const messageId = computed(() => `${id}-message`);
const describedBy = computed(() => {
    return [
        props.description ? descriptionId.value : null,
        props.err_msg ? messageId.value : null,
    ].filter(Boolean).join(' ') || undefined;
});
</script>

<template>
    <FormField>
        <FormLabel :for="id">
            {{ legend }}
            <span v-if="required" class="text-destructive">*</span>
        </FormLabel>
        <FormControl>
            <slot :id="id" :model="model">
                <Input
                    :id="id"
                    v-model="model"
                    :type="input_type"
                    :name="input_name"
                    :placeholder="placeholder"
                    :required="required"
                    :autocomplete="input_name"
                    :aria-describedby="describedBy"
                    :aria-invalid="!!err_msg"
                />
            </slot>
        </FormControl>
        <FormDescription v-if="description" :id="descriptionId">
            {{ description }}
        </FormDescription>
        <FormMessage v-if="err_msg" :id="messageId">
            {{ err_msg }}
        </FormMessage>
    </FormField>
</template>
