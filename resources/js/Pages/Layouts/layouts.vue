<script setup>
import { ref, watch } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { toast } from 'vue-sonner';
import Footer from '../../Components/Footer.vue';
import Navbar from '../../Components/Navbar.vue';
import Sidebar from '../../Components/Sidebar.vue';
import { Sheet, SheetContent } from '@/Components/ui/sheet';
import { Toaster } from '@/Components/ui/sonner';

const mobileOpen = ref(false);
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
