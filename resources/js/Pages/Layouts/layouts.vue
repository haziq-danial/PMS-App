<script setup>
import { watch } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { toast } from 'vue-sonner';
import Footer from '../../Components/Footer.vue';
import Navbar from '../../Components/Navbar.vue';
import Sidebar from '../../Components/Sidebar.vue';
import { SidebarProvider, SidebarInset } from '@/Components/ui/sidebar';
import { Toaster } from '@/Components/ui/sonner';

const page = usePage();

// Toast on flash messages. A full visit replaces `flash` with a new object
// reference (so identical consecutive messages still fire), while partial reloads
// — like the DataTable's `only: ['roles']` pagination — don't re-send `flash`, so
// its reference is preserved on merge and this watcher correctly stays silent.
watch(() => page.props.flash, (flash) => {
    if (!flash) return;
    if (flash.success) toast.success(flash.success);
    if (flash.error) toast.error(flash.error);
});
</script>

<template>
    <SidebarProvider>
        <Sidebar />

        <SidebarInset>
            <Navbar />
            <main class="grow bg-muted/40 p-6">
                <slot />
            </main>
            <Footer />
        </SidebarInset>
    </SidebarProvider>

    <Toaster rich-colors close-button position="bottom-right" />
</template>
