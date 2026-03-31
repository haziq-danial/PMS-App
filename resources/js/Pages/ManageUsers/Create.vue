<script setup>
import RadioInput from '../../Components/FormInputs/RadioInput.vue';
import GroupInput from '../../Components/FormInputs/GroupInput.vue';
import PageHeader from '../../Components/PageHeader.vue';
import { useForm } from '@inertiajs/vue3';
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
    confirm_password: ''
});

const submit = () => {
    form.post(route('manage-users.store'), {
        onSuccess: () => form.reset()
    });
};
</script>

<template>
    <div>

        <Head :title="pageTitle"></Head>
        <PageHeader :title="title" :user-type="user" />
        <div class="mt-6">
            <form @submit.prevent="submit">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="p-6 bg-white rounded-lg shadow flex-1">
                        <h3 class="text-lg font-bold">Basic Information</h3>
                        <fieldset class="fieldset mt-3 grid sm:grid-cols-2 md:grid-cols-2 gap-3">
                            <GroupInput legend="Matric Number" placeholder="Enter matric no" v-model="form.matric_no"
                                input_type="text" :required="true" />
                            <GroupInput legend="Name" placeholder="Enter name" v-model="form.full_name" input_type="text"
                                :required="true" />
                            <GroupInput legend="Email" placeholder="Enter email" v-model="form.email" input_type="email"
                                :required="true" />
                            <GroupInput legend="Mobile" placeholder="Enter mobile number" v-model="form.mobile_no"
                                input_type="text" :required="true" />
                            <GroupInput legend="DOB" placeholder="Enter DOB" v-model="form.date_of_birth" input_type="date"
                                :required="true" />
                            <div class="pl-1 mt-3 flex items-center gap-3">
                                <RadioInput radio_name="gender" v-model="form.gender" label="Male" identifier="radio-gender" value="male" />
                                <RadioInput radio_name="gender" v-model="form.gender" label="Female" identifier="radio-gender"
                                    value="female" />
                            </div>
                        </fieldset>
                    </div>
                    <div class="p-6 bg-white rounded-lg shadow flex-1">
                        <h3 class="text-lg font-bold">Address</h3>
                        <fieldset class="fieldset mt-3 grid sm:grid-cols-2 md:grid-cols-2 gap-3">
                            <GroupInput legend="Street Address" placeholder="Enter street address"
                                v-model="form.street_address" input_type="text" />
                            <GroupInput legend="City" placeholder="Enter city" v-model="form.city" input_type="text" />
                            <GroupInput legend="State" placeholder="Enter state" v-model="form.state" input_type="text" />
                            <GroupInput legend="Postal Code" placeholder="Enter postal code" v-model="form.postal_code"
                                input_type="text" />
                        </fieldset>
                    </div>
                    <div class="p-6 bg-white rounded-lg shadow flex-1">
                        <h3 class="text-lg font-bold">Account Information</h3>
                        <fieldset class="fieldset mt-3 grid sm:grid-cols-2 md:grid-cols-2 gap-3">
                            <GroupInput legend="Password" placeholder="Enter password" v-model="form.password"
                                input_type="text" :required="true" />
                            <GroupInput legend="Confirm Password" placeholder="Enter confirm password"
                                v-model="form.confirm_password" input_type="text" :required="true" />
                        </fieldset>
                    </div>
                </div>
                <div class="mt-6 flex justify-end gap-6 items-center">
                    <a :href="route('manage-users.index')" class="btn btn-ghost">Cancel</a>
                    <button type="submit" class="btn btn-primary" :disabled="form.processing">
                        {{ form.processing ? 'Sending...' : 'Submit' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>