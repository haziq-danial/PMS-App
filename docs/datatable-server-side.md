# DataTable — Server-Side Mode

The reusable table lives at [`resources/js/Components/DataTable/DataTable.vue`](../resources/js/Components/DataTable/DataTable.vue).
It runs in two modes:

- **Client-side (default):** you pass the *entire* dataset; the component sorts and
  paginates it in the browser. Best for small lists.
- **Server-side (`manual`):** you pass *one page* of rows plus the total count; the
  component reports sort/page changes back to you, and you refetch from Laravel. Best
  for large tables that should be sorted/paginated in SQL.

This document covers **server-side mode**. The working reference is
[`ManageRoles/View.vue`](../resources/js/Pages/ManageRoles/View.vue) +
[`ManageRolesController@index`](../app/Http/Controllers/ManageRolesController.php).

---

## When to use it

Use server-side mode when any of these are true:

- The table can grow to hundreds/thousands of rows.
- You only want to ship one page of data over the wire.
- Sorting/filtering must happen in the database (e.g. across joined columns).

Otherwise, prefer the default client-side mode — it needs no controller changes.

---

## Props (server-side)

| Prop        | Type      | Required | Description                                                                 |
| ----------- | --------- | -------- | --------------------------------------------------------------------------- |
| `manual`    | `Boolean` | yes      | Turns on `manualPagination` + `manualSorting`. `data` is treated as one page. |
| `data`      | `Array`   | yes      | The **current page** of rows (from Laravel's paginator `.data`).            |
| `columns`   | `Array`   | yes      | TanStack column definitions (same as client mode).                          |
| `rowCount`  | `Number`  | yes\*    | The **total** number of rows on the server (paginator `.total`). Drives page count. |
| `loading`   | `Boolean` | no       | Shows a "Loading…" overlay and disables the pager during a request.         |
| `pageSizeOptions` | `Array` | no   | Rows-per-page choices. Default `[5, 10, 20, 50]`.                            |

\* Required in `manual` mode — without it the component can't compute how many pages exist.

### v-model bindings

In `manual` mode the **parent owns the state** and binds it:

| Binding                 | Shape                                | Notes                                       |
| ----------------------- | ------------------------------------ | ------------------------------------------- |
| `v-model:sorting`       | `[{ id: string, desc: boolean }]`    | TanStack sorting state. Empty = no sort.    |
| `v-model:pagination`    | `{ pageIndex: number, pageSize: number }` | `pageIndex` is **0-based**.            |

When these change (user clicks a sortable header or the pager), the parent reloads
`data` from the backend.

---

## Data flow

```
User clicks sort / page
        │
        ▼
DataTable updates v-model:sorting / v-model:pagination
        │
        ▼
Parent watcher fires → router.get(route, { page, per_page, sort, direction })
        │
        ▼
Laravel: whitelist sort → orderBy → paginate → through() reshape
        │
        ▼
Inertia returns { data, total, current_page, per_page, ... } as the `roles` prop
        │
        ▼
DataTable re-renders the new page (state preserved via preserveState)
```

---

## Frontend example

Copy this pattern to convert any view. Only the column defs and route/prop names change.

```vue
<script setup>
import { ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import DataTable from '@/Components/DataTable/DataTable.vue';

const props = defineProps({
    // Laravel paginator payload: { data, total, current_page, per_page, ... }
    roles: Object,
});

// Controlled table state, seeded from the paginator the server sent.
const sorting = ref([]);
const pagination = ref({
    pageIndex: (props.roles?.current_page ?? 1) - 1, // paginator is 1-based, TanStack is 0-based
    pageSize: props.roles?.per_page ?? 5,
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
    router.get(route('manage-roles.index'), {
        page: pagination.value.pageIndex + 1,
        per_page: pagination.value.pageSize,
        sort: sort?.id,
        direction: sort ? (sort.desc ? 'desc' : 'asc') : undefined,
    }, {
        only: ['roles'],       // partial reload — refetch just this prop
        preserveState: true,   // keep the component + its sorting/pagination refs
        preserveScroll: true,
        replace: true,         // don't push a history entry per keystroke/click
        onStart: () => (loading.value = true),
        onFinish: () => (loading.value = false),
    });
}, { deep: true });

const columns = [ /* TanStack column defs — unchanged from client mode */ ];
</script>

<template>
    <DataTable
        manual
        :columns="columns"
        :data="roles?.data ?? []"
        :row-count="roles?.total ?? 0"
        :loading="loading"
        v-model:sorting="sorting"
        v-model:pagination="pagination"
        empty-message="No roles found."
    />
</template>
```

---

## Backend example

```php
public function index(Request $request)
{
    // Map the front-end column keys to real DB columns for safe sorting.
    // NEVER pass $request->sort straight into orderBy() — this whitelist prevents
    // SQL column injection and 500s on unknown columns.
    $sortable = ['id' => 'id', 'roles' => 'name'];
    $sort = $sortable[$request->query('sort')] ?? 'id';
    $direction = $request->query('direction') === 'desc' ? 'desc' : 'asc';

    $roles = Role::query()
        ->with('permissions:id,name')
        ->orderBy($sort, $direction)
        ->paginate($request->integer('per_page', 5))
        ->withQueryString()                 // keep sort/filter params on paginator links
        ->through(fn ($role) => [           // reshape rows, preserve pagination meta
            'id' => $role->id,
            'roles' => $role->name,
            'permissions' => $role->permissions->pluck('name')->toArray(),
        ]);

    return inertia('ManageRoles/View', compact('roles'));
}
```

Key points:

- **`->paginate($perPage)`** returns a `LengthAwarePaginator` that serializes to
  `{ data, total, current_page, per_page, last_page, ... }` — exactly what the frontend reads.
- **`->through(fn)`** transforms each row **while keeping** the pagination metadata.
  (Do not use `->map()` on a paginator for this — it returns a plain collection and
  drops `total`/`current_page`.)
- **`->withQueryString()`** carries the current query params onto generated links.
- The **`$sortable` whitelist** maps the column's front-end `accessorKey`/`id`
  (`roles`) to the DB column (`name`). The sortable header's `column.toggleSorting()`
  sends the column id as `sort`, so the map must cover every sortable column.

---

## Column key ↔ DB column mapping

The `sort` value sent to the server is the column's `id`/`accessorKey`, **not** the DB
column. When they differ, map them:

| Column `accessorKey` (frontend) | `$sortable` value (DB column) |
| ------------------------------- | ----------------------------- |
| `id`                            | `id`                          |
| `roles`                         | `name`                        |

Mark non-sortable columns with `enableSorting: false` in their column def (e.g. the
`permissions` and `actions` columns) so they never emit a `sort` the backend can't map.

---

## Gotchas

- **0-based vs 1-based pages.** TanStack `pageIndex` is 0-based; Laravel `page` is
  1-based. Convert both ways (`pageIndex + 1` when sending, `current_page - 1` when seeding).
- **`preserveState: true` is required.** Without it Inertia recreates the component on
  each reload, wiping the `sorting`/`pagination` refs and breaking the loop.
- **Don't watch the incoming prop to reset state.** State is seeded once at setup. The
  server echoes back what the user chose, so re-seeding would risk a reload loop.
- **`->through()` not `->map()`** on the paginator (see backend note above).
- **Whitelist every sortable column** or a crafted `?sort=` param will error or, worse,
  reference an arbitrary column.

---

## Converting another view (checklist)

1. Controller `index()`: add `Request $request`, a `$sortable` whitelist, and
   `->orderBy()->paginate()->withQueryString()->through()`.
2. Page props: change the data prop from `Array` to `Object` (the paginator).
3. Add `sorting`, `pagination`, `loading` refs seeded from the paginator.
4. Add the page-size-reset watcher and the reload watcher (`router.get`).
5. On `<DataTable>`: add `manual`, `:row-count`, `:loading`,
   `v-model:sorting`, `v-model:pagination`; point `:data` at `<prop>.data`.
6. Ensure every sortable column's key exists in the controller's `$sortable` map.
```
