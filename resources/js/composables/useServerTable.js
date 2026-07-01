import { ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';

/**
 * Controlled state for a server-side (`manual`) DataTable backed by a Laravel
 * paginator. Reloads the given resource prop from the server whenever the sort
 * or page changes.
 *
 * @param {Object}   opts
 * @param {string}   opts.routeName  Ziggy route name for the index endpoint.
 * @param {Object}   opts.paginator  The initial paginator payload (props.<resource>).
 * @param {string[]} opts.only       Inertia partial-reload keys (e.g. ['roles']).
 * @returns {{ sorting: import('vue').Ref, pagination: import('vue').Ref, loading: import('vue').Ref }}
 */
export function useServerTable({ routeName, paginator, only }) {
    const sorting = ref([]);
    const pagination = ref({
        pageIndex: (paginator?.current_page ?? 1) - 1,
        pageSize: paginator?.per_page ?? 5,
    });
    const loading = ref(false);

    // Reset to the first page when the page size changes (avoids an out-of-range page).
    watch(() => pagination.value.pageSize, (size, prev) => {
        if (size !== prev && pagination.value.pageIndex !== 0) {
            pagination.value = { ...pagination.value, pageIndex: 0 };
        }
    });

    // Reload the current page from the server on any sort/page change.
    watch([sorting, pagination], () => {
        const sort = sorting.value[0];
        router.get(route(routeName), {
            page: pagination.value.pageIndex + 1,
            per_page: pagination.value.pageSize,
            sort: sort?.id,
            direction: sort ? (sort.desc ? 'desc' : 'asc') : undefined,
        }, {
            only,
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onStart: () => (loading.value = true),
            onFinish: () => (loading.value = false),
        });
    }, { deep: true });

    return { sorting, pagination, loading };
}
