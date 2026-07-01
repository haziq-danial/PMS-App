<script setup>
import PageHeader from '@/Components/PageHeader.vue';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';

const cards = [
    { title: 'Card Title 1', body: 'This card will grow and shrink to fill the row equally.' },
    { title: 'Card Title 2', body: 'All cards in this row will have equal width.' },
    { title: 'Card Title 3', body: 'Notice how the cards wrap to a new line on smaller viewports.' },
];
</script>

<template>
    <div>
        <Head title=" | Dashboard" />
        <PageHeader title="Dashboard" user-type="Admin" />
        <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card v-for="card in cards" :key="card.title">
                <CardHeader>
                    <CardTitle>{{ card.title }}</CardTitle>
                </CardHeader>
                <CardContent class="text-sm text-muted-foreground">
                    {{ card.body }}
                </CardContent>
            </Card>
        </div>
    </div>
</template>
