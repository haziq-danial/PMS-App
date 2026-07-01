# Form Components

This guide covers the form primitives in `resources/js/Components/ui/form` and the
project-level `GroupInput` and `UnderscoreInput` wrappers in
`resources/js/Components/FormInputs`.

Use these components when building forms so fields keep the same layout, spacing,
labels, helper text, and error messages across the app.

---

## Component Structure

The intended structure is:

```text
Form
+-- FormField
    +-- FormLabel
    +-- FormControl
    |   +-- Input
    +-- FormDescription
    +-- FormMessage
```

Imports:

```js
import {
    Form,
    FormField,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from '@/Components/ui/form';
```

`Form` renders a styled `<form>`. The other components are layout and text primitives
that wrap actual controls such as `Input`, `Select`, `Checkbox`, or custom project
components.

---

## Quick Usage With GroupInput

For standard text-like inputs, prefer `GroupInput`:

```vue
<script setup>
import { useForm } from '@inertiajs/vue3';
import GroupInput from '@/Components/FormInputs/GroupInput.vue';

const form = useForm({
    name: '',
});

const submit = () => {
    form.post(route('users.store'));
};
</script>

<template>
    <form @submit.prevent="submit">
        <GroupInput
            legend="Name"
            placeholder="Enter name"
            input_name="name"
            input_type="text"
            v-model="form.name"
            :required="true"
            description="Use the user's full legal name."
            :err_msg="form.errors.name"
        />
    </form>
</template>
```

When no slot is provided, `GroupInput` renders the default `Input` component inside
`FormControl`.

`GroupInput` props:

| Prop | Type | Required | Purpose |
| --- | --- | --- | --- |
| `legend` | `String` | Yes | Label text shown above the input. |
| `placeholder` | `String` | Yes | Placeholder passed to `Input`. |
| `input_type` | `String` | Yes | Input type, such as `text`, `email`, `password`, or `date`. |
| `input_name` | `String` | No | Input `name` and `autocomplete` value. |
| `required` | `Boolean` | No | Adds required state and the visual asterisk. |
| `description` | `String` | No | Optional helper text below the control. |
| `err_msg` | `String` | No | Optional validation message below the field. |

`GroupInput` slot props:

| Slot Prop | Type | Purpose |
| --- | --- | --- |
| `id` | `String` | Generated input id. Use this on the custom control so the label stays connected. |
| `model` | `String \| Number` | Current `v-model` value passed from `GroupInput`. Use it for read-only display needs; bind editable custom controls to the same parent form state. |

---

## GroupInput With a Custom Control Slot

Use the optional default slot when you want `GroupInput` to keep the same label,
description, error, and spacing, but need to replace the inner control.

```vue
<script setup>
import { useForm } from '@inertiajs/vue3';
import GroupInput from '@/Components/FormInputs/GroupInput.vue';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';

const form = useForm({
    role: '',
});
</script>

<template>
    <GroupInput
        legend="Role"
        placeholder="Select a role"
        input_name="role"
        input_type="text"
        v-model="form.role"
        description="Choose the access level for this user."
        :err_msg="form.errors.role"
    >
        <template #default="{ id }">
            <Select v-model="form.role">
                <SelectTrigger
                    :id="id"
                    class="w-full"
                    :aria-describedby="`${id}-description ${id}-message`"
                    :aria-invalid="!!form.errors.role"
                >
                    <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
            </Select>
        </template>
    </GroupInput>
</template>
```

The slot is rendered inside `FormControl`, so do not wrap the replacement control in
another `FormControl`. Use the provided `id` on the focusable control or trigger so
`FormLabel` still targets the right element.

For custom controls, make sure to pass any needed accessibility attributes yourself,
such as `aria-invalid` and `aria-describedby`. The description id is
`${id}-description` and the message id is `${id}-message`. The default `Input`
fallback already receives those attributes from `GroupInput`.

---

## UnderscoreInput

`UnderscoreInput` is a thin wrapper around the base `Input` that replaces any
whitespace the user types with underscores. It is meant for slug-like fields such
as permission names, where values must not contain spaces.

It sets `inheritAttrs: false` and forwards all attributes (`$attrs`) to the inner
`Input`, so you can pass `id`, `name`, `placeholder`, `autocomplete`, `aria-*`, and
similar attributes directly and they land on the real control.

`UnderscoreInput` model:

| Binding | Type | Default | Purpose |
| --- | --- | --- | --- |
| `v-model` | `String` | `''` | Current value. On each update, whitespace runs (`\s+`) are collapsed to `_` before the model is set. |

Because it forwards attributes and exposes a `v-model`, `UnderscoreInput` drops
straight into a `GroupInput` custom control slot:

```vue
<script setup>
import { useForm } from '@inertiajs/vue3';
import GroupInput from '@/Components/FormInputs/GroupInput.vue';
import UnderscoreInput from '@/Components/FormInputs/UnderscoreInput.vue';

const form = useForm({
    name: '',
});
</script>

<template>
    <GroupInput
        legend="Permission Name"
        placeholder="permission"
        input_type="text"
        v-model="form.name"
        :required="true"
        :err_msg="form.errors.name"
    >
        <template #default="{ id }">
            <UnderscoreInput
                :id="id"
                v-model="form.name"
                name="name"
                autocomplete="name"
                placeholder="permission"
                :aria-describedby="form.errors.name ? `${id}-message` : undefined"
                :aria-invalid="!!form.errors.name"
            />
        </template>
    </GroupInput>
</template>
```

Bind `UnderscoreInput` to the same form state as `GroupInput` (`form.name` above) so
the sanitized value and the parent form stay in sync. Since the slot replaces the
default `Input`, pass the accessibility attributes yourself as shown; the `id` comes
from the slot props so `FormLabel` still targets the control.

---

## Custom Field Example

Use the primitives directly when a field needs a non-`Input` control or custom layout.

```vue
<script setup>
import { useId } from 'vue';
import { Input } from '@/Components/ui/input';
import {
    FormField,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from '@/Components/ui/form';

const model = defineModel();

defineProps({
    error: { type: String, required: false },
});

const id = useId();
</script>

<template>
    <FormField>
        <FormLabel :for="id">Email</FormLabel>
        <FormControl>
            <Input
                :id="id"
                v-model="model"
                type="email"
                name="email"
                autocomplete="email"
                placeholder="name@example.com"
                :aria-invalid="!!error"
            />
        </FormControl>
        <FormDescription>
            We'll use this for account notifications.
        </FormDescription>
        <FormMessage v-if="error">
            {{ error }}
        </FormMessage>
    </FormField>
</template>
```

---

## Full Form Example

Use `Form` when you want the default vertical spacing between fields:

```vue
<script setup>
import { useForm } from '@inertiajs/vue3';
import { Form } from '@/Components/ui/form';
import GroupInput from '@/Components/FormInputs/GroupInput.vue';
import { Button } from '@/Components/ui/button';

const form = useForm({
    email: '',
    password: '',
});

const submit = () => {
    form.post(route('login'));
};
</script>

<template>
    <Form @submit.prevent="submit">
        <GroupInput
            legend="Email"
            placeholder="Enter email"
            input_name="email"
            input_type="email"
            v-model="form.email"
            :required="true"
            :err_msg="form.errors.email"
        />

        <GroupInput
            legend="Password"
            placeholder="Enter password"
            input_name="password"
            input_type="password"
            v-model="form.password"
            :required="true"
            :err_msg="form.errors.password"
        />

        <Button type="submit" :disabled="form.processing">
            {{ form.processing ? 'Saving...' : 'Save' }}
        </Button>
    </Form>
</template>
```

---

## Accessibility Notes

- Always connect `FormLabel` to the control with matching `for` and `id` values.
- Use `FormDescription` for helper text, not validation errors.
- Use `FormMessage` for validation errors.
- Set `aria-invalid` on the control when a field has an error.
- If writing a custom wrapper, connect descriptions and messages with
  `aria-describedby` so screen readers can announce them.

`GroupInput` already handles `aria-invalid` and `aria-describedby` for its
description and error message.
