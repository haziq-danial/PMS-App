<template>
    <div>

        <Head :title="pageTitle"></Head>
        <PageHeader :title="title" :user-type="user" />
        <div class="mt-6">
            <div class="flex flex-col gap-6 md:flex-row md:flex-wrap">
                <div class="p-6 bg-white rounded-lg shadow flex-1">
                    <!-- table header -->
                    <div class="flex p-10 pb-0 pt-5 justify-end gap-3">
                        <a :href="route('manage-users.create')" class="btn btn-primary">
                            <PlusIcon class="size-[1.2em]" />
                            New User
                        </a>
                    </div>
                    <div class="mt-3 overflow-x-auto">
                        <table class="table">
                            <!-- head -->
                            <thead>
                                <tr>
                                    <th>
                                        <label>
                                            <input type="checkbox" class="checkbox" />
                                        </label>
                                    </th>
                                    <th>Name</th>
                                    <th>Job</th>
                                    <th>Favorite Color</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- row 1 -->
                                <tr>
                                    <th>
                                        <label>
                                            <input type="checkbox" class="checkbox" />
                                        </label>
                                    </th>
                                    <td>
                                        <div class="flex items-center gap-3">
                                            <div class="avatar">
                                                <div class="mask mask-squircle h-12 w-12">
                                                    <img src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                                                        alt="Avatar Tailwind CSS Component" />
                                                </div>
                                            </div>
                                            <div>
                                                <div class="font-bold">Hart Hagerty</div>
                                                <div class="text-sm opacity-50">United States</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        Zemlak, Daniel and Leannon
                                        <br />
                                        <span class="badge badge-ghost badge-sm">Desktop Support Technician</span>
                                    </td>
                                    <td>Purple</td>
                                    <th>
                                        <button class="btn btn-ghost btn-xs">details</button>
                                    </th>
                                </tr>
                                <!-- row 2 -->
                                <tr>
                                    <th>
                                        <label>
                                            <input type="checkbox" class="checkbox" />
                                        </label>
                                    </th>
                                    <td>
                                        <div class="flex items-center gap-3">
                                            <div class="avatar">
                                                <div class="mask mask-squircle h-12 w-12">
                                                    <img src="https://img.daisyui.com/images/profile/demo/3@94.webp"
                                                        alt="Avatar Tailwind CSS Component" />
                                                </div>
                                            </div>
                                            <div>
                                                <div class="font-bold">Brice Swyre</div>
                                                <div class="text-sm opacity-50">China</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        Carroll Group
                                        <br />
                                        <span class="badge badge-ghost badge-sm">Tax Accountant</span>
                                    </td>
                                    <td>Red</td>
                                    <th>
                                        <button class="btn btn-ghost btn-xs">details</button>
                                    </th>
                                </tr>
                                <!-- row 3 -->
                                <tr>
                                    <th>
                                        <label>
                                            <input type="checkbox" class="checkbox" />
                                        </label>
                                    </th>
                                    <td>
                                        <div class="flex items-center gap-3">
                                            <div class="avatar">
                                                <div class="mask mask-squircle h-12 w-12">
                                                    <img src="https://img.daisyui.com/images/profile/demo/4@94.webp"
                                                        alt="Avatar Tailwind CSS Component" />
                                                </div>
                                            </div>
                                            <div>
                                                <div class="font-bold">Marjy Ferencz</div>
                                                <div class="text-sm opacity-50">Russia</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        Rowe-Schoen
                                        <br />
                                        <span class="badge badge-ghost badge-sm">Office Assistant I</span>
                                    </td>
                                    <td>Crimson</td>
                                    <th>
                                        <button class="btn btn-ghost btn-xs">details</button>
                                    </th>
                                </tr>
                                <!-- row 4 -->
                                <tr>
                                    <th>
                                        <label>
                                            <input type="checkbox" class="checkbox" />
                                        </label>
                                    </th>
                                    <td>
                                        <div class="flex items-center gap-3">
                                            <div class="avatar">
                                                <div class="mask mask-squircle h-12 w-12">
                                                    <img src="https://img.daisyui.com/images/profile/demo/5@94.webp"
                                                        alt="Avatar Tailwind CSS Component" />
                                                </div>
                                            </div>
                                            <div>
                                                <div class="font-bold">Yancy Tear</div>
                                                <div class="text-sm opacity-50">Brazil</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        Wyman-Ledner
                                        <br />
                                        <span class="badge badge-ghost badge-sm">Community Outreach Specialist</span>
                                    </td>
                                    <td>Indigo</td>
                                    <th>
                                        <button class="btn btn-ghost btn-xs">details</button>
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import PlusIcon from '../../Components/Icons/PlusIcon.vue';
import PageHeader from '../../Components/PageHeader.vue';
const title = 'Manage Users';
const pageTitle = ` | ${title}`;
const user = 'Admin';
</script>