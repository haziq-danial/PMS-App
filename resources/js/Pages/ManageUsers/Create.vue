<script setup>
import { useForm } from '@inertiajs/vue3';
import GroupInput from '@/Components/FormInputs/GroupInput.vue';
import PageHeader from '@/Components/PageHeader.vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';

const title = 'Create Users';
const pageTitle = ` | ${title}`;
const user = 'Admin';

const form = useForm({
    matric_no: '',
    full_name: '',
    email: '',
    mobile_no: '',
    date_of_birth: '',
    gender: '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    password: '',
    confirm_password: '',
    role: '',
});

const props = defineProps({
    roles: Array,
});

const submit = () => {
    form.post(route('manage-users.store'), {
        onSuccess: () => form.reset(),
    });
};
</script>

<template>
    <div>
        <Head :title="pageTitle" />
        <PageHeader :title="title" :user-type="user" />
        <form class="mt-6" @submit.prevent="submit">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent class="grid gap-4 sm:grid-cols-2">
                        <GroupInput legend="Matric Number" placeholder="Enter matric no" v-model="form.matric_no" input_type="text" :required="true" />
                        <GroupInput legend="Name" placeholder="Enter name" v-model="form.full_name" input_type="text" :required="true" />
                        <GroupInput legend="Email" placeholder="Enter email" v-model="form.email" input_type="email" :required="true" />
                        <GroupInput legend="Mobile" placeholder="Enter mobile number" v-model="form.mobile_no" input_type="text" :required="true" />
                        <GroupInput legend="DOB" placeholder="Enter DOB" v-model="form.date_of_birth" input_type="date" :required="true" />
                        <div class="grid gap-2">
                            <Label>Gender</Label>
                            <RadioGroup v-model="form.gender" class="flex items-center gap-6 pt-1">
                                <div class="flex items-center gap-2">
                                    <RadioGroupItem id="gender-male" value="male" />
                                    <Label for="gender-male" class="font-normal">Male</Label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <RadioGroupItem id="gender-female" value="female" />
                                    <Label for="gender-female" class="font-normal">Female</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Address</CardTitle>
                    </CardHeader>
                    <CardContent class="grid gap-4 sm:grid-cols-2">
                        <GroupInput legend="Street Address" placeholder="Enter street address" v-model="form.street_address" input_type="text" />
                        <GroupInput legend="City" placeholder="Enter city" v-model="form.city" input_type="text" />
                        <GroupInput legend="State" placeholder="Enter state" v-model="form.state" input_type="text" />
                        <GroupInput legend="Postal Code" placeholder="Enter postal code" v-model="form.postal_code" input_type="text" />
                    </CardContent>
                </Card>

                <Card class="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                    </CardHeader>
                    <CardContent class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        <GroupInput legend="Password" placeholder="Enter password" v-model="form.password" input_type="password" :required="true" />
                        <GroupInput legend="Confirm Password" placeholder="Enter confirm password" v-model="form.confirm_password" input_type="password" :required="true" />
                        <div class="grid gap-2">
                            <Label for="role">Select Role</Label>
                            <Select v-model="form.role">
                                <SelectTrigger id="role" class="w-full">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="role in props.roles" :key="role.id" :value="role.name">
                                        {{ role.name }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div class="mt-6 flex items-center justify-end gap-4">
                <Button variant="ghost" as-child>
                    <a :href="route('manage-users.index')">Cancel</a>
                </Button>
                <Button type="submit" :disabled="form.processing">
                    {{ form.processing ? 'Sending...' : 'Submit' }}
                </Button>
            </div>
        </form>
    </div>
</template>
