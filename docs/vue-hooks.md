# Vue Hooks & Reactivity

A reference for Vue 3's built-in Composition API "hooks" — the reactivity primitives,
lifecycle hooks, and `<script setup>` macros used throughout this project. For the
**project-specific** composables (`useServerTable`, `useDeleteResource`) see
[composables.md](./composables.md); this file is about the framework primitives they're
built from.

Every component here uses `<script setup>` — a compile-time sugar where top-level
bindings are automatically exposed to the template, and macros like `defineProps` are
available without importing them.

---

## Reactivity primitives

Import from `vue`. These are the building blocks of all state.

### `ref()` — a single reactive value

```js
import { ref } from 'vue';
const loading = ref(false);
loading.value = true;          // access/mutate via .value in <script>
```

In the **template**, refs are auto-unwrapped — write `loading`, not `loading.value`.
Used everywhere here for local state (`mobileOpen`, `showForm`, `deleting`, …).

### `computed()` — derived, cached value

Recomputes only when its dependencies change. Read-only by default.

```js
import { computed } from 'vue';
const isEditing = computed(() => editing.value !== null);
```

Real example — the sidebar's active-link check reads a shared prop and derives a boolean
([Sidebar.vue](../resources/js/Components/Sidebar.vue)).

### `watch()` — react to specific changes

Runs a callback when the watched source(s) change. Gets `(newValue, oldValue)`.

```js
import { watch } from 'vue';

// getter source
watch(() => pagination.value.pageSize, (size, prev) => { /* … */ });

// multiple sources + deep for nested objects
watch([sorting, pagination], () => { /* reload */ }, { deep: true });
```

Used to reload the DataTable on sort/page change, reset the form when a modal closes, and
fire flash toasts. **Does not run on mount** unless you pass `{ immediate: true }`.

Key detail seen in the layout: `watch(() => page.props.flash, …)` fires on full visits
(new object reference) but **not** on partial reloads (reference preserved on merge) —
that's how phantom pagination toasts are avoided.

### `watchEffect()` — auto-track dependencies

Runs immediately and re-runs when any reactive value it *reads* changes. Handy when you
don't want to list sources explicitly. (Not currently used here, but valid.)

```js
import { watchEffect } from 'vue';
watchEffect(() => console.log(count.value));
```

### `reactive()` — reactive object

An alternative to `ref` for objects (no `.value`, but you can't reassign the whole
variable). This project prefers `ref({...})` for consistency; `reactive` is available if
you need it.

---

## Lifecycle hooks

Register callbacks tied to a component's life. Import from `vue`.

| Hook               | Fires when…                                  |
| ------------------ | -------------------------------------------- |
| `onMounted`        | Component is inserted into the DOM.          |
| `onBeforeUnmount`  | Just before it's removed.                    |
| `onUnmounted`      | After it's removed — clean up here.          |
| `onUpdated`        | After a reactive re-render.                  |

Real example — [`Multiselect.vue`](../resources/js/Components/FormInputs/Multiselect.vue)
adds a document listener on mount and removes it on unmount:

```js
import { onMounted, onUnmounted } from 'vue';
onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
```

> **Always pair global side-effects with cleanup.** Anything you add in `onMounted`
> (event listeners, timers, subscriptions) should be removed in `onUnmounted` to avoid
> leaks — especially in the persistent layout, which stays mounted across page visits.

---

## `<script setup>` macros

Compiler macros — no import needed, only valid inside `<script setup>`.

### `defineProps` — declare inputs

```js
const props = defineProps({
    roles: Object,
    permissions: { type: Array, required: false },
});
// use props.roles in script; `roles` directly in template
```

### `defineEmits` — declare events

```js
const emit = defineEmits(['navigate']);
emit('navigate');                       // or in template: $emit('navigate')
```

### `defineModel` — two-way binding (`v-model`)

The modern way to accept a `v-model`. Returns a ref you read/write; changes emit the
`update:*` event automatically.

```js
// GroupInput.vue — default v-model
const model = defineModel();

// DataTable.vue — named models: v-model:sorting / v-model:pagination
const sorting = defineModel('sorting', { type: Array, default: () => [] });
const pagination = defineModel('pagination', { type: Object, default: () => ({ pageIndex: 0, pageSize: 5 }) });
```

### `useId` — stable unique id

For linking labels to inputs (SSR-safe, collision-free):

```js
import { useId } from 'vue';
const id = useId();     // GroupInput.vue uses this for <Label :for> / <Input :id>
```

---

## Inertia "hooks"

Inertia provides its own composition helpers (import from `@inertiajs/vue3`). They behave
like hooks and are used across pages.

### `usePage()` — access shared page data

```js
import { usePage } from '@inertiajs/vue3';
const page = usePage();
page.props.currentRouteName;   // shared prop (see HandleInertiaRequests)
page.props.flash;              // watched in the layout to toast
```

### `useForm()` — form state + submission

A reactive form helper with dirty tracking, validation errors, and submit helpers.

```js
import { useForm } from '@inertiajs/vue3';
const form = useForm({ name: '' });

form.post(route('categories.store'), {
    preserveScroll: true,
    onSuccess: () => { form.reset(); showForm.value = false; },
});
```

- `form.processing` — in-flight flag (disable buttons).
- `form.errors.<field>` — server validation errors.
- `form.transform(fn)` — reshape payload before send.
- `form.put(...)` / `form.delete(...)` — other verbs.

### `router` — programmatic visits

```js
import { router } from '@inertiajs/vue3';
router.get(url, data, { only: ['roles'], preserveState: true });
router.delete(route('...destroy', id));
```

Used inside the composables for table reloads and deletes — pages rarely call `router`
directly (they go through the composables or `useForm`).

---

## From primitives to composables

A composable is just a function that combines the above primitives and returns reactive
state — nothing more. Example distilled from
[`useDeleteResource`](../resources/js/composables/useDeleteResource.js):

```js
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';

export function useDeleteResource(routeName) {
    const open = ref(false);          // primitive
    const target = ref(null);
    const ask = (item) => { target.value = item; open.value = true; };
    const confirm = () => router.delete(route(routeName, target.value.id), { /* … */ });
    return { open, target, ask, confirm };   // hand reactive state back to the component
}
```

The rules that make this safe:

1. Only call reactivity/lifecycle hooks at the **top level** of `setup`/a composable —
   never inside a condition, loop, or nested callback.
2. Composables should be **self-contained**: take arguments, return refs/methods; don't
   reach into a component's `props`.
3. Lifecycle hooks registered inside a composable bind to the **component that calls it**.

See [composables.md](./composables.md) for the project's composables and
[development-guide.md](./development-guide.md) for the overall workflow.
```
