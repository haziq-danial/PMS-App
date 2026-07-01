import { ref } from 'vue';
import { router } from '@inertiajs/vue3';

/**
 * Delete-with-confirmation state for a single resource row. Drives an
 * AlertDialog: call `ask(item)` to open it and `confirm()` to perform the
 * DELETE. Feedback is handled by the global flash toast.
 *
 * @param {string} routeName  Ziggy route name for the destroy endpoint
 *                            (expects the item id as its route parameter).
 * @returns {{
 *   open: import('vue').Ref<boolean>,
 *   target: import('vue').Ref<Object|null>,
 *   deleting: import('vue').Ref<boolean>,
 *   ask: (item: Object) => void,
 *   confirm: () => void,
 * }}
 */
export function useDeleteResource(routeName) {
    const open = ref(false);
    const target = ref(null);
    const deleting = ref(false);

    const ask = (item) => {
        target.value = item;
        open.value = true;
    };

    const confirm = () => {
        if (!target.value) return;
        router.delete(route(routeName, target.value.id), {
            preserveScroll: true,
            onStart: () => (deleting.value = true),
            onFinish: () => {
                deleting.value = false;
                open.value = false;
                target.value = null;
            },
        });
    };

    return { open, target, deleting, ask, confirm };
}
