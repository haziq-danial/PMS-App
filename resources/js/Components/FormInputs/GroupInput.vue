<script setup>
import { useId } from 'vue';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

defineProps({
    legend: { type: String, required: true },
    placeholder: { type: String, required: true },
    input_name: { type: String, required: false },
    input_type: { type: String, required: true },
    required: { type: Boolean, required: false },
    err_msg: { type: String, required: false },
});

const model = defineModel();
const id = useId();
</script>

<template>
    <div class="grid gap-2">
        <Label :for="id">
            {{ legend }}
            <span v-if="required" class="text-destructive">*</span>
        </Label>
        <Input
            :id="id"
            v-model="model"
            :type="input_type"
            :name="input_name"
            :placeholder="placeholder"
            :required="required"
            :autocomplete="input_name"
        />
        <p v-if="err_msg" class="text-sm text-destructive">{{ err_msg }}</p>
    </div>
</template>
