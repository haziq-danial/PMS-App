import { computed, ref, watch, onMounted } from 'vue';
import { router } from '@inertiajs/vue3';

/**
 * Read a persisted table setting from localStorage. Returns `{}` on any failure
 * (private mode, SSR, corrupt value) so callers can fall back to defaults.
 */
function readSetting(key) {
    try {
        return JSON.parse(window.localStorage.getItem(key)) ?? {};
    } catch {
        return {};
    }
}

function writeSetting(key, value) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // ignore (storage unavailable/full)
    }
}

/**
 * Controlled state for a server-side (`manual`) DataTable backed by a Laravel
 * paginator. Reloads the given resource prop from the server whenever the sort
 * or page changes, and remembers the page size + sort per resource across visits.
 *
 * @param {Object}   opts
 * @param {string}   opts.routeName    Ziggy route name for the index endpoint.
 * @param {Object}   opts.paginator    The initial paginator payload (props.<resource>).
 * @param {string[]} opts.only         Inertia partial-reload keys (e.g. ['roles']).
 * @param {string}  [opts.storageKey]  localStorage key; defaults to `table:<routeName>`.
 * @returns {{ sorting: import('vue').Ref, pagination: import('vue').Ref, loading: import('vue').Ref }}
 */
export function useServerTable({ routeName, paginator, only, storageKey }) {
    const key = storageKey ?? `table:${routeName}`;
    const saved = readSetting(key);

    const serverPageSize = paginator?.per_page ?? 5;

    const sorting = ref(saved.sort ? [saved.sort] : []);
    const pagination = ref({
        pageIndex: (paginator?.current_page ?? 1) - 1,
        // Restore the remembered page size, falling back to what the server rendered.
        pageSize: saved.pageSize ?? serverPageSize,
    });
    const loading = ref(false);
    const query = computed(() => {
        const sort = sorting.value[0];

        return {
            page: pagination.value.pageIndex + 1,
            per_page: pagination.value.pageSize,
            sort: sort?.id,
            direction: sort ? (sort.desc ? 'desc' : 'asc') : undefined,
        };
    });

    const reload = () => {
        router.get(route(routeName), query.value, {
            only,
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onStart: () => (loading.value = true),
            onFinish: () => (loading.value = false),
        });
    };

    // Persist the page size + sort so the choice survives navigating away and back.
    watch([sorting, () => pagination.value.pageSize], () => {
        writeSetting(key, {
            pageSize: pagination.value.pageSize,
            sort: sorting.value[0] ?? null,
        });
    }, { deep: true });

    // Reset to the first page when the page size changes (avoids an out-of-range page).
    watch(() => pagination.value.pageSize, (size, prev) => {
        if (size !== prev && pagination.value.pageIndex !== 0) {
            pagination.value = { ...pagination.value, pageIndex: 0 };
        }
    });

    // Reload the current page from the server on any sort/page change.
    watch([sorting, pagination], reload, { deep: true });

    // The initial server render used default params, so if a remembered setting
    // differs from what came back, sync once on mount to apply it.
    onMounted(() => {
        if (pagination.value.pageSize !== serverPageSize || sorting.value.length > 0) {
            reload();
        }
    });

    return { sorting, pagination, loading, query };
}
