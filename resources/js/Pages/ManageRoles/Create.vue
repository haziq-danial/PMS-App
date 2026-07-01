<script setup>
import { useForm } from '@inertiajs/vue3';
import PageHeader from '@/Components/PageHeader.vue';
import GroupInput from '@/Components/FormInputs/GroupInput.vue';
import Multiselect from '@/Components/FormInputs/Multiselect.vue';
import { Card, CardContent } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';

const title = 'Create Roles';
const pageTitle = ` | ${title}`;
const user = 'Admin';

const props = defineProps({
    permissions: Array,
});

const form = useForm({
    name: '',
    selected_permissions: [],
});

const submit = () => {
    form
        .transform((data) => ({
            ...data,
            selected_permissions: data.selected_permissions.map((p) => p.label),
        }))
        .post(route('manage-roles.store'), {
            onSuccess: () => form.reset(),
        });
};
</script>

<template>
    <div>
        <Head :title="pageTitle" />
        <PageHeader :title="title" :user-type="user" />
        <div class="mt-6">
            <Card>
                <form @submit.prevent="submit">
                    <CardContent class="space-y-8">
                        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div>
                                <h2 class="text-base font-semibold">Role Information</h2>
                                <p class="text-sm text-muted-foreground">Give this role a descriptive name.</p>
                            </div>
                            <div class="md:col-span-2">
                                <div class="max-w-sm">
                                    <GroupInput legend="Role Name" placeholder="Role" v-model="form.name" input_type="text" />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div>
                                <h2 class="text-base font-semibold">Assign Permissions</h2>
                                <p class="text-sm text-muted-foreground">Search and select permissions for this role.</p>
                            </div>
                            <div class="md:col-span-2">
                                <div class="grid gap-2">
                                    <Label>Permissions</Label>
                                    <Multiselect v-model="form.selected_permissions" :options="permissions" />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div class="flex items-center justify-end gap-4">
                            <Button variant="ghost" as-child>
                                <a :href="route('manage-roles.index')">Cancel</a>
                            </Button>
                            <Button type="submit" :disabled="form.processing">
                                {{ form.processing ? 'Sending...' : 'Submit' }}
                            </Button>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    </div>
</template>
