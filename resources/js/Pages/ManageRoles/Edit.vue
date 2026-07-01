<script setup>
import PageHeader from '@/Components/PageHeader.vue';
import { Card, CardContent } from '@/Components/ui/card';

const title = 'Edit Permissions';
const pageTitle = ` | ${title}`;
const user = 'Admin';
</script>

<template>
    <div>
        <Head :title="pageTitle" />
        <PageHeader :title="title" :user-type="user" />
        <div class="mt-6">
            <Card>
                <CardContent>
                    <p class="text-sm text-muted-foreground">Nothing here yet.</p>
                </CardContent>
            </Card>
        </div>
    </div>
</template>
