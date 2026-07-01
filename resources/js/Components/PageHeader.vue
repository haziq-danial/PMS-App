<script setup>
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/Components/ui/breadcrumb';

defineProps({
    title: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <div class="flex items-center justify-between gap-4">
        <h1 class="text-lg font-semibold tracking-tight">{{ title }}</h1>
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>PETAKOM</BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>{{ userType }}</BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>{{ title }}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    </div>
</template>
