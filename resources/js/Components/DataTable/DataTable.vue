<script setup>
import {
    FlexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useVueTable,
} from '@tanstack/vue-table';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from '@lucide/vue';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';

const props = defineProps({
    columns: { type: Array, required: true },
    data: { type: Array, required: true },
    pageSize: { type: Number, default: 5 },
    pageSizeOptions: { type: Array, default: () => [5, 10, 20, 50] },
    emptyMessage: { type: String, default: 'No results found.' },
    // Server-side mode: the parent owns sorting/pagination state and reloads
    // `data` from the backend in response to the update:sorting / update:pagination
    // events. `data` is expected to be just the current page of rows.
    manual: { type: Boolean, default: false },
    // Total number of rows on the server (required in manual mode to compute page count).
    rowCount: { type: Number, default: 0 },
    // Shows a loading state and disables the pager while a server request is in flight.
    loading: { type: Boolean, default: false },
});

// Controlled state. In manual mode the parent binds these with
// `v-model:sorting` / `v-model:pagination`; in client mode they act as
// internal state with sensible defaults.
const sorting = defineModel('sorting', {
    type: Array,
    default: () => [],
});
const pagination = defineModel('pagination', {
    type: Object,
    default: () => ({ pageIndex: 0, pageSize: 5 }),
});

// Seed the default page size from the prop without overriding a parent-provided value.
if (pagination.value.pageSize == null) {
    pagination.value = { pageIndex: 0, pageSize: props.pageSize };
}

const table = useVueTable({
    get data() { return props.data; },
    get columns() { return props.columns; },
    getCoreRowModel: getCoreRowModel(),
    // Only compute pagination/sorting locally when NOT in manual mode.
    ...(props.manual
        ? {
            manualPagination: true,
            manualSorting: true,
            get rowCount() { return props.rowCount; },
        }
        : {
            getPaginationRowModel: getPaginationRowModel(),
            getSortedRowModel: getSortedRowModel(),
        }),
    state: {
        get sorting() { return sorting.value; },
        get pagination() { return pagination.value; },
    },
    onSortingChange: (updater) => {
        sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater;
    },
    onPaginationChange: (updater) => {
        pagination.value = typeof updater === 'function' ? updater(pagination.value) : updater;
    },
});
</script>

<template>
    <div class="space-y-4">
        <div class="relative rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                        <TableHead v-for="header in headerGroup.headers" :key="header.id">
                            <FlexRender
                                v-if="!header.isPlaceholder"
                                :render="header.column.columnDef.header"
                                :props="header.getContext()"
                            />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="table.getRowModel().rows.length">
                        <TableRow
                            v-for="row in table.getRowModel().rows"
                            :key="row.id"
                            :data-state="row.getIsSelected() ? 'selected' : undefined"
                        >
                            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                                <FlexRender
                                    :render="cell.column.columnDef.cell"
                                    :props="cell.getContext()"
                                />
                            </TableCell>
                        </TableRow>
                    </template>
                    <TableRow v-else>
                        <TableCell :colspan="columns.length" class="h-24 text-center text-muted-foreground">
                            {{ loading ? 'Loading…' : emptyMessage }}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <!-- Loading overlay for server-side refreshes that still have rows visible -->
            <div
                v-if="loading && table.getRowModel().rows.length"
                class="absolute inset-0 flex items-center justify-center bg-background/60 text-sm text-muted-foreground"
            >
                Loading…
            </div>
        </div>

        <div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Rows per page</span>
                <Select
                    :model-value="String(table.getState().pagination.pageSize)"
                    @update:model-value="table.setPageSize(Number($event))"
                >
                    <SelectTrigger class="h-8 w-[70px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="size in pageSizeOptions" :key="size" :value="String(size)">
                            {{ size }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div class="flex items-center gap-4">
                <span class="text-sm text-muted-foreground">
                    Page {{ table.getState().pagination.pageIndex + 1 }} of {{ Math.max(table.getPageCount(), 1) }}
                </span>
                <div class="flex items-center gap-1">
                    <Button
                        variant="outline" size="icon-sm"
                        :disabled="loading || !table.getCanPreviousPage()"
                        @click="table.setPageIndex(0)"
                        aria-label="First page"
                    >
                        <ChevronsLeft class="size-4" />
                    </Button>
                    <Button
                        variant="outline" size="icon-sm"
                        :disabled="loading || !table.getCanPreviousPage()"
                        @click="table.previousPage()"
                        aria-label="Previous page"
                    >
                        <ChevronLeft class="size-4" />
                    </Button>
                    <Button
                        variant="outline" size="icon-sm"
                        :disabled="loading || !table.getCanNextPage()"
                        @click="table.nextPage()"
                        aria-label="Next page"
                    >
                        <ChevronRight class="size-4" />
                    </Button>
                    <Button
                        variant="outline" size="icon-sm"
                        :disabled="loading || !table.getCanNextPage()"
                        @click="table.setPageIndex(table.getPageCount() - 1)"
                        aria-label="Last page"
                    >
                        <ChevronsRight class="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
