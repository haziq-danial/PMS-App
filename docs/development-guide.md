# Development Guide

Onboarding for developers continuing work on this project. It explains the stack, the
conventions this codebase follows, and step-by-step recipes for the most common tasks.

For deeper dives see:

- [datatable-server-side.md](./datatable-server-side.md) — server-side tables.
- [composables.md](./composables.md) — shared Composition-API utilities.

---

## Tech stack

| Layer            | Tool                          | Notes                                             |
| ---------------- | ----------------------------- | ------------------------------------------------- |
| Backend          | **Laravel**                   | Controllers return Inertia responses, not Blade.  |
| SPA bridge       | **Inertia.js v2**             | Server-driven pages, no separate API layer.       |
| Routing helper   | **Ziggy**                     | Laravel route names usable in JS via `route()`.   |
| Frontend         | **Vue 3** (`<script setup>`)  | Composition API throughout.                       |
| Build            | **Vite** + `laravel-vite-plugin` | HMR in dev, hashed assets in prod.             |
| Styling          | **Tailwind CSS v4**           | CSS-first config in `resources/css/app.css`.      |
| UI components    | **shadcn-vue** (Reka UI)      | Copied into the repo under `Components/ui`.        |
| Icons            | **`@lucide/vue`**             | Import named icons, e.g. `import { Plus } from '@lucide/vue'`. |
| Tables           | **TanStack Table** (`@tanstack/vue-table`) | Headless; rendered with shadcn `Table`. |
| Toasts           | **vue-sonner**                | Driven by Laravel flash messages.                 |
| Permissions      | **spatie/laravel-permission** | Roles & permissions models.                       |

> **Not used:** DaisyUI and PrimeVue were fully removed in the shadcn migration. Do not
> reintroduce their classes/components.

---

## Running locally

The app is developed under Laragon (Windows), served at `http://localhost:8000`.

```bash
# One command runs artisan serve + queue listener + vite together:
composer dev

# …or individually:
php artisan serve      # backend (http://localhost:8000)
npm run dev            # Vite dev server + HMR

npm run build          # production assets (public/build)
```

HMR is configured for Laragon in [`vite.config.js`](../vite.config.js) (polling watcher).
Editing a `.vue` file hot-swaps the component; editing Blade/PHP/routes triggers a full
refresh via `laravel-vite-plugin`.

---

## Project structure

```
app/Http/
  Controllers/          ManageRolesController, ManagePermissionsController, ...
  Middleware/HandleInertiaRequests.php   # shared props (flash, currentRouteName)
routes/web.php          # route groups per resource
resources/
  css/app.css           # Tailwind v4 + shadcn zinc design tokens
  js/
    app.js              # Inertia bootstrap, layout auto-assign, global Head/Link/route
    Components/
      ui/               # shadcn-vue components (generated; safe to edit)
      DataTable/        # reusable TanStack table wrapper
      FormInputs/       # GroupInput, Multiselect
      Navbar, Sidebar, Footer, PageHeader, Modal
    composables/        # useServerTable, useDeleteResource
    lib/utils.js        # cn() class-merge helper
    Pages/              # Inertia page components (resolved by name)
      Layouts/layouts.vue   # app shell (sidebar + navbar + toaster)
docs/                   # this documentation
```

---

## Conventions (read before writing code)

### Import alias & folder casing

- `@` → `resources/js` (configured in both [`vite.config.js`](../vite.config.js) and
  [`jsconfig.json`](../jsconfig.json)).
- The components folder is **capital-C `Components`** on disk. Always import as
  **`@/Components/...`** (e.g. `@/Components/ui/button`). Lowercase works on Windows but
  breaks case-sensitive Linux builds — keep it capitalised.
- UI primitives: `@/Components/ui/<name>`. Composables: `@/composables/<name>`.
  Utilities: `@/lib/utils`.

### `route()` is global

Ziggy's `@routes` directive (in `resources/views/app.blade.php`) exposes `route()`
globally — usable in `<script setup>`, composables, and templates without importing it.

### Styling with design tokens

Use shadcn's semantic Tailwind tokens, not raw colors: `bg-background`, `text-foreground`,
`bg-card`, `text-muted-foreground`, `border`, `bg-primary`, `text-destructive`, etc.
They are defined as CSS variables in [`app.css`](../resources/css/app.css) (zinc base) and
keep the UI consistent and theme-ready. Merge conditional classes with `cn()` from
`@/lib/utils`.

### Feedback via flash → toast

Never wire toasts per-page. Redirect from the controller with a flash message:

```php
return redirect()->route('manage-roles.index')->with('success', 'Role Created!');
// or ->with('error', '...')
```

`HandleInertiaRequests::share()` exposes `flash`, and [`layouts.vue`](../resources/js/Pages/Layouts/layouts.vue)
watches it and pops a toast automatically for every full visit.

---

## How the Inertia wiring works

- Controllers call `inertia('ManageRoles/View', [...])`; the string maps to
  `resources/js/Pages/ManageRoles/View.vue`.
- [`app.js`](../resources/js/app.js) auto-assigns `Layouts/layouts.vue` as the default
  layout to every page and registers `Head`, `Link`, and `route` globally.
- **Shared props** (available on every page as `usePage().props`) are defined in
  [`HandleInertiaRequests`](../app/Http/Middleware/HandleInertiaRequests.php):
  `currentRouteName` (used by the sidebar for active state) and `flash`.

---

## Adding a shadcn-vue component

```bash
npx shadcn-vue@latest add <name>      # e.g. tabs, tooltip, switch
```

Config lives in [`components.json`](../components.json) (style: new-york, base: zinc,
icons: lucide). Components land in `resources/js/Components/ui/<name>` and are yours to
edit. If the CLI writes imports as `@/components` (lowercase), fix them to `@/Components`.

---

## Recipe: add a new CRUD resource

Follow the Roles/Permissions pattern. Example: a `Category` resource.

### 1. Routes — `routes/web.php`

```php
Route::prefix('categories')->name('categories.')
    ->controller(CategoryController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/store', 'store')->name('store');
        Route::put('/update/{id}', 'update')->name('update');
        Route::delete('/{id}', 'destroy')->name('destroy');
    });
```

> Create/edit are **modals on the index page**, so no `create`/`edit` GET routes are
> needed (that was the pattern we standardised on).

### 2. Controller — server-side index + flash redirects

Mirror [`ManagePermissionsController`](../app/Http/Controllers/ManagePermissionsController.php):

```php
public function index(Request $request)
{
    $sortable = ['id' => 'id', 'name' => 'name'];              // whitelist!
    $sort = $sortable[$request->query('sort')] ?? 'id';
    $direction = $request->query('direction') === 'desc' ? 'desc' : 'asc';

    $categories = Category::query()
        ->orderBy($sort, $direction)
        ->paginate($request->integer('per_page', 5))
        ->withQueryString()
        ->through(fn ($c) => ['id' => $c->id, 'name' => $c->name]);

    return inertia('Categories/View', compact('categories'));
}
// store()/update()/destroy(): validate, persist, then
// return redirect()->route('categories.index')->with('success', '...');
```

See [datatable-server-side.md](./datatable-server-side.md) for the full backend contract.

### 3. Page — `resources/js/Pages/Categories/View.vue`

Reuse the composables and the DataTable. Skeleton:

```js
import { h, ref, watch, computed } from 'vue';
import { useForm } from '@inertiajs/vue3';
import { useServerTable } from '@/composables/useServerTable';
import { useDeleteResource } from '@/composables/useDeleteResource';
import DataTable from '@/Components/DataTable/DataTable.vue';
// ...shadcn Card, Button, Dialog, AlertDialog, GroupInput

const props = defineProps({ categories: Object });

const { sorting, pagination, loading } = useServerTable({
    routeName: 'categories.index', paginator: props.categories, only: ['categories'],
});

const { open: showDelete, target: deleteTarget, deleting,
        ask: askDelete, confirm: confirmDelete } = useDeleteResource('categories.destroy');

// create/edit modal: useForm({ name: '' }) + openCreate/openEdit/submit (post vs put)
// columns: define with h(); wire Edit -> openEdit(row.original), Delete -> askDelete(row.original)
```

Copy the `<template>` (Card + DataTable + create/edit `Dialog` + delete `AlertDialog`)
from [`ManagePermissions/View.vue`](../resources/js/Pages/ManagePermissions/View.vue) —
it's the closest template to start from.

### 4. Sidebar link — `resources/js/Components/Sidebar.vue`

Add one entry to `navItems` (single source of truth: the route name drives link +
active state):

```js
{ icon: Tags, title: 'Categories', routeName: 'categories.index' },
```

### 5. Verify

```bash
npm run build        # frontend must compile
php -l routes/web.php # and the controller
```

Then click through: list loads, sort/paginate hits the DB, create/edit modal submits,
delete confirms, and toasts fire on success.

---

## Gotchas

- **Partial reloads and shared props:** `router.get(url, data, { only: ['x'] })` does
  **not** re-send other shared props (like `flash`). This is why the flash toast watches
  by reference — see [composables.md](./composables.md) and the layout comment.
- **Column sort keys must be whitelisted** server-side, or a crafted `?sort=` errors.
  Mark non-sortable columns `enableSorting: false`.
- **Casing:** import `@/Components` (capital C).
- **Don't** hand-roll fetch/axios for pages — go through Inertia (`router` / `useForm`)
  so shared props, flash, and history stay consistent.
```
