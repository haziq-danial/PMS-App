<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { router } from '@inertiajs/vue3';
import { toast } from 'vue-sonner';
import Footer from '../../Components/Footer.vue';
import Navbar from '../../Components/Navbar.vue';
import Sidebar from '../../Components/Sidebar.vue';
import { Sheet, SheetContent } from '@/Components/ui/sheet';
import { Toaster } from '@/Components/ui/sonner';

const mobileOpen = ref(false);

// Show a toast whenever a request lands with a flash message. Using the router
// 'success' event (rather than watching props) means identical consecutive
// messages still fire, and read-only visits without flash simply do nothing.
let stopListening;
onMounted(() => {
    stopListening = router.on('success', (event) => {
        const flash = event.detail.page.props.flash ?? {};
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    });
});
onUnmounted(() => stopListening?.());
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

    <Toaster rich-colors close-button position="bottom-right" />
</template>
