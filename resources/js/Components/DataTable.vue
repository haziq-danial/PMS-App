<template>
    <table v-bind="$attrs">
        <thead>
            <tr>
                <slot name="header-start-actions"></slot>
                <slot v-for="col in columns" :name="`header-${col.key}`" :col="col" :key="col.key">
                    <th class="whitespace-nowrap text-left">
                        {{ col.label }}
                    </th>
                </slot>
                <slot name="header-end-actions"></slot>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in items" :key="item.id">
                <slot name="body-start-actions"></slot>
                <slot v-for="col in columns" :name="col.key" :key="col.key" :item="item">
                    <td class="text-left">
                        {{ item[col.key] }}
                    </td>
                </slot>
                <slot name="body-end-actions"></slot>
            </tr>
        </tbody>
    </table>
</template>
<script setup>
import InputComponent from './FormInputs/InputComponent.vue';

const props = defineProps({
    columns: { type: Array, required: true },
    items: { type: Array, required: true },
});

</script>