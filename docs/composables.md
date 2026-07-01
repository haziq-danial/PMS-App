# Composables

Reusable Composition-API functions live in
[`resources/js/composables/`](../resources/js/composables) and are imported via the
`@/composables/*` alias. A composable is a plain function that uses Vue reactivity
(`ref`, `watch`, `computed`) and returns reactive state + methods, letting multiple
components share stateful logic without duplication.

Current composables:

- [`useServerTable`](#useservertable) — controlled state for a server-side DataTable.
- [`useDeleteResource`](#usedeleteresource) — delete-with-confirmation for a table row.

Both are consumed by [`ManageRoles/View.vue`](../resources/js/Pages/ManageRoles/View.vue)
and [`ManagePermissions/View.vue`](../resources/js/Pages/ManagePermissions/View.vue).

---

## `useServerTable`

[`resources/js/composables/useServerTable.js`](../resources/js/composables/useServerTable.js)

Owns the controlled `sorting` / `pagination` / `loading` state for a `manual`
[DataTable](./datatable-server-side.md) and reloads the resource from the server on any
sort or page change. Encapsulates the tricky bits: the Inertia partial-reload `only`
key, `preserveState`, and resetting to page 1 when the page size changes.

### Signature

```js
useServerTable({ routeName, paginator, only }) => { sorting, pagination, loading }
```

| Param       | Type       | Description                                                        |
| ----------- | ---------- | ------------------------------------------------------------------ |
| `routeName` | `string`   | Ziggy route name for the index endpoint, e.g. `'manage-roles.index'`. |
| `paginator` | `Object`   | The initial Laravel paginator payload (`props.<resource>`). Read once to seed `pageIndex` / `pageSize`. |
| `only`      | `string[]` | Inertia partial-reload keys, e.g. `['roles']` — only these props are refetched. |

### Returns

| Ref          | Shape                                     | Bind to                                     |
| ------------ | ----------------------------------------- | ------------------------------------------- |
| `sorting`    | `[{ id, desc }]`                          | `<DataTable v-model:sorting>`               |
| `pagination` | `{ pageIndex, pageSize }` (0-based index) | `<DataTable v-model:pagination>`            |
| `loading`    | `boolean`                                 | `<DataTable :loading>`                      |

### Usage

```js
const props = defineProps({ roles: Object }); // Laravel paginator

const { sorting, pagination, loading } = useServerTable({
    routeName: 'manage-roles.index',
    paginator: props.roles,
    only: ['roles'],
});
```

```vue
<DataTable
    manual
    :columns="columns"
    :data="roles?.data ?? []"
    :row-count="roles?.total ?? 0"
    :loading="loading"
    v-model:sorting="sorting"
    v-model:pagination="pagination"
/>
```

The controller side (whitelisted sorting + `paginate()->through()`) is documented in
[datatable-server-side.md](./datatable-server-side.md).

### Notes

- `paginator` is read **once** at setup to seed state. Later server responses echo the
  state the user chose, so it is intentionally not re-watched (that would risk a loop).
- Relies on the global `route()` helper (Ziggy's `@routes` directive) — available
  everywhere, including composables.

---

## `useDeleteResource`

[`resources/js/composables/useDeleteResource.js`](../resources/js/composables/useDeleteResource.js)

Drives an [AlertDialog](../resources/js/Components/ui/alert-dialog) confirmation for
deleting a single row. Call `ask(item)` to open the dialog, `confirm()` to perform the
`DELETE`. Success/failure feedback is handled by the global flash toast — this
composable does not toast itself.

### Signature

```js
useDeleteResource(routeName) => { open, target, deleting, ask, confirm }
```

| Param       | Type     | Description                                                               |
| ----------- | -------- | ------------------------------------------------------------------------- |
| `routeName` | `string` | Ziggy route name for the destroy endpoint; the item `id` is passed as its route parameter. |

### Returns

| Key        | Type                    | Description                                          |
| ---------- | ----------------------- | ---------------------------------------------------- |
| `open`     | `Ref<boolean>`          | Bind to `<AlertDialog v-model:open>`.                |
| `target`   | `Ref<Object \| null>`   | The row awaiting deletion (for the dialog message).  |
| `deleting` | `Ref<boolean>`          | `true` while the request is in flight.               |
| `ask`      | `(item) => void`        | Open the dialog for `item`.                          |
| `confirm`  | `() => void`            | Perform the `DELETE`, then close and reset.          |

### Usage

Alias the returns to page-friendly names so templates read naturally:

```js
const {
    open: showDelete,
    target: deleteTarget,
    deleting,
    ask: askDelete,
    confirm: confirmDelete,
} = useDeleteResource('manage-roles.destroy');
```

Trigger it from a row action (TanStack column cell):

```js
h(Button, {
    variant: 'outline', size: 'icon-sm', 'aria-label': 'Delete',
    onClick: () => askDelete(row.original),
}, () => h(Trash2, { class: 'size-4' }));
```

Confirmation dialog:

```vue
<AlertDialog v-model:open="showDelete">
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Delete this role?</AlertDialogTitle>
            <AlertDialogDescription>
                This will permanently delete the
                <span class="font-medium text-foreground">{{ deleteTarget?.roles }}</span>
                role. This action cannot be undone.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel :disabled="deleting">Cancel</AlertDialogCancel>
            <AlertDialogAction
                class="bg-destructive text-white hover:bg-destructive/90"
                :disabled="deleting"
                @click.prevent="confirmDelete"
            >
                {{ deleting ? 'Deleting…' : 'Delete' }}
            </AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>
```

> Use `@click.prevent` on `AlertDialogAction` so the dialog stays open showing the
> "Deleting…" state and closes only when the request finishes (`onFinish`), instead of
> the primitive's default immediate close.

---

## Design notes

### What is intentionally *not* a composable

The **create/edit form** logic (`useForm`, `openCreate`/`openEdit`/`submit`) is kept
**inline** in each View. Its shape and edit-hydration differ per resource — Roles maps
permission objects and transforms them to labels on submit; Permissions just copies a
name — so a shared `useResourceForm` would need `hydrate`/`transform` callbacks and
trade duplication for indirection. Per the "rule of three", extract it only once a
third resource proves the pattern.

Likewise, TanStack **column definitions** and **dialog templates** are view-specific and
are not shared.

### Adding a composable

1. Create `resources/js/composables/useThing.js` exporting a `useThing()` function.
2. Use only reactivity primitives; return refs/methods (do not read component `props`
   directly — pass what you need as arguments).
3. Import via `@/composables/useThing` and document it here.
