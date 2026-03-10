<script setup lang="ts">

import Footer from '../../Components/Footer.vue';
import Navbar from '../../Components/Navbar.vue';
import Sidebar from '../../Components/Sidebar.vue';

</script>

<template>
    <div class="flex flex-col min-h-screen">
        <div class="drawer lg:drawer-open">
            <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
            <div class="drawer-content flex-1 flex flex-col">
                <!-- Navbar -->
                <navbar/>
                <!-- Page content here -->
                <div class="grow p-6 bg-base-200">
                    <slot></slot>
                </div>
                <Footer/>
            </div>
    
            <sidebar/>
        </div>
    </div>
</template>
