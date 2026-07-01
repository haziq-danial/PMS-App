<script setup>
import { h } from 'vue';
import { Plus } from '@lucide/vue';
import PageHeader from '@/Components/PageHeader.vue';
import DataTable from '@/Components/DataTable/DataTable.vue';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/Components/ui/avatar';

const title = 'Manage Users';
const pageTitle = ` | ${title}`;
const user = 'Admin';

const users = [
    { id: 1, name: 'Hart Hagerty', country: 'United States', company: 'Zemlak, Daniel and Leannon', job: 'Desktop Support Technician', color: 'Purple', avatar: 'https://img.daisyui.com/images/profile/demo/2@94.webp' },
    { id: 2, name: 'Brice Swyre', country: 'China', company: 'Carroll Group', job: 'Tax Accountant', color: 'Red', avatar: 'https://img.daisyui.com/images/profile/demo/3@94.webp' },
    { id: 3, name: 'Marjy Ferencz', country: 'Russia', company: 'Rowe-Schoen', job: 'Office Assistant I', color: 'Crimson', avatar: 'https://img.daisyui.com/images/profile/demo/4@94.webp' },
    { id: 4, name: 'Yancy Tear', country: 'Brazil', company: 'Wyman-Ledner', job: 'Community Outreach Specialist', color: 'Indigo', avatar: 'https://img.daisyui.com/images/profile/demo/5@94.webp' },
];

const columns = [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) =>
            h('div', { class: 'flex items-center gap-3' }, [
                h(Avatar, { class: 'size-10' }, () => [
                    h(AvatarImage, { src: row.original.avatar, alt: row.original.name }),
                    h(AvatarFallback, () => row.original.name.charAt(0)),
                ]),
                h('div', {}, [
                    h('div', { class: 'font-medium' }, row.original.name),
                    h('div', { class: 'text-sm text-muted-foreground' }, row.original.country),
                ]),
            ]),
    },
    {
        accessorKey: 'job',
        header: 'Job',
        cell: ({ row }) =>
            h('div', { class: 'space-y-1' }, [
                h('div', {}, row.original.company),
                h(Badge, { variant: 'secondary' }, () => row.original.job),
            ]),
    },
    {
        accessorKey: 'color',
        header: 'Favorite Color',
    },
];
</script>

<template>
    <div>
        <Head :title="pageTitle" />
        <PageHeader :title="title" :user-type="user" />
        <div class="mt-6">
            <Card>
                <CardHeader class="flex items-center justify-end">
                    <Button as-child>
                        <a :href="route('manage-users.create')">
                            <Plus class="size-4" />
                            New User
                        </a>
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable :columns="columns" :data="users" empty-message="No users found." />
                </CardContent>
            </Card>
        </div>
    </div>
</template>
