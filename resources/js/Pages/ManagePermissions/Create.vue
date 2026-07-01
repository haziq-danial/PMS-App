<script setup>
import { useForm } from '@inertiajs/vue3';
import GroupInput from '@/Components/FormInputs/GroupInput.vue';
import PageHeader from '@/Components/PageHeader.vue';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';

const title = 'Create Permission';
const pageTitle = ` | ${title}`;
const user = 'Admin';

const form = useForm({
    name: '',
});

const submit = () => {
    form.post(route('manage-permissions.store'), {
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
                                <h2 class="text-base font-semibold">Permission Information</h2>
                                <p class="text-sm text-muted-foreground">Name the permission you want to create.</p>
                            </div>
                            <div class="md:col-span-2">
                                <div class="max-w-sm">
                                    <GroupInput legend="Permission Name" placeholder="permission" v-model="form.name" input_type="text" />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div class="flex items-center justify-end gap-4">
                            <Button variant="ghost" as-child>
                                <a :href="route('manage-permissions.index')">Cancel</a>
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
