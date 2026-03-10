<script setup lang="ts">
import SideBarIcon from './Icons/SideBarIcon.vue';

</script>

<template>
    <nav class="navbar w-full shadow-[0_4px_6px_-4px_rgb(0,0,0,0.1)]">
        <label for="my-drawer-4" aria-label="open sidebar" class="btn btn-square btn-ghost">
            <!-- Sidebar toggle icon -->
            <SideBarIcon class="my-1.5 inline-block size-4" />
        </label>
        <div class="flex-1">
            <div class="px-4">PETAKOM</div>
        </div>
        <div class="flex-none">
            <div class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar avatar-placeholder mr-5">
                    <div class="bg-neutral text-neutral-content w-10 rounded-full">
                        <span>H</span>
                    </div>
                </div>

                <ul tabindex="-1"
                    class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    <li>
                        <a href="#" class="justify-between">
                            Profile
                        </a>
                    </li>
                    <li>
                        <a>Settings</a>
                    </li>
                    <li>
                        <a>Logout</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>