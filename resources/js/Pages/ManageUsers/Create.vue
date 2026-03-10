<template>
    <div>

        <Head :title="pageTitle"></Head>
        <PageHeader :title="title" :user-type="user" />
        <div class="mt-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-6 bg-white rounded-lg shadow flex-1">
                    <h3 class="text-lg font-bold">Basic Information</h3>
                    <fieldset class="fieldset mt-3 grid sm:grid-cols-2 md:grid-cols-2 gap-3">
                        <GroupInput legend="Matric Number" placeholder="Enter mattric no" input_name="matric_no"
                            input_type="text" :required="true" />
                        <GroupInput legend="Name" placeholder="Enter name" input_name="name" input_type="text"
                            :required="true" />
                        <GroupInput legend="Email" placeholder="Enter email" input_name="email" input_type="email"
                            :required="true" />
                        <GroupInput legend="Mobile" placeholder="Enter mobile number" input_name="mobile_no"
                            input_type="text" :required="true" />
                        <GroupInput legend="DOB" placeholder="Enter DOB" input_name="dob" input_type="date"
                            :required="true" />
                        <div class="pl-1 mt-3 flex items-center gap-3">
                            <RadioInput radio_name="gender" label="Male" identifier="radio-gender" value="male" />
                            <RadioInput radio_name="gender" label="Female" identifier="radio-gender" value="female" />
                        </div>
                    </fieldset>
                </div>
                <div class="p-6 bg-white rounded-lg shadow flex-1">
                    <h3 class="text-lg font-bold">Address</h3>
                    <fieldset class="fieldset mt-3 grid sm:grid-cols-2 md:grid-cols-2 gap-3">
                        <GroupInput legend="Street Address" placeholder="Enter street address"
                            input_name="street_address" input_type="text" />
                        <GroupInput legend="City" placeholder="Enter city" input_name="city" input_type="text" />
                        <GroupInput legend="State" placeholder="Enter state" input_name="state" input_type="text" />
                        <GroupInput legend="Postal Code" placeholder="Enter postal code" input_name="postal_code"
                            input_type="text" />
                    </fieldset>
                </div>
                <div class="p-6 bg-white rounded-lg shadow flex-1">
                    <h3 class="text-lg font-bold">Account Information</h3>
                    <fieldset class="fieldset mt-3 grid sm:grid-cols-2 md:grid-cols-2 gap-3">
                        <GroupInput legend="Password" placeholder="Enter password" input_name="password"
                            input_type="text" :required="true" />
                        <GroupInput legend="Confirm Password" placeholder="Enter confirm password"
                            input_name="confirm_password" input_type="text" :required="true" />
                    </fieldset>
                </div>
            </div>
            <div class="mt-6 flex justify-between items-center">
                <button class="btn btn-neutral">Neutral</button>
                <a :href="route('manage-users.index')" class="btn btn-primary">Cancel</a>
            </div>
        </div>
    </div>
</template>

<script setup>
import RadioInput from '../../Components/FormInputs/RadioInput.vue';
import GroupInput from '../../Components/FormInputs/GroupInput.vue';
import PageHeader from '../../Components/PageHeader.vue';
const title = 'Create Users';
const pageTitle = ` | ${title}`;
const user = 'Admin';
</script>