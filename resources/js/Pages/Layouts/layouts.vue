<script setup>
import { ref } from 'vue';
import Footer from '../../Components/Footer.vue';
import Navbar from '../../Components/Navbar.vue';
import Sidebar from '../../Components/Sidebar.vue';
import { Sheet, SheetContent } from '@/Components/ui/sheet';

const mobileOpen = ref(false);
</script>

<template>
    <div class="flex min-h-screen">
        <!-- Desktop sidebar -->
        <aside class="hidden lg:block">
            <Sidebar class="sticky top-0 h-screen" />
        </aside>

        <!-- Mobile sidebar -->
        <Sheet v-model:open="mobileOpen">
            <SheetContent side="left" class="w-64 p-0">
                <Sidebar @navigate="mobileOpen = false" />
            </SheetContent>
        </Sheet>

        <!-- Main column -->
        <div class="flex min-w-0 flex-1 flex-col">
            <Navbar @toggle-sidebar="mobileOpen = true" />
            <main class="grow bg-muted/40 p-6">
                <slot />
            </main>
            <Footer />
        </div>
    </div>
</template>
