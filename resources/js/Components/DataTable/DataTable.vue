<script setup>
import { ref } from 'vue';
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
});

const sorting = ref([]);

const table = useVueTable({
    get data() { return props.data; },
    get columns() { return props.columns; },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updater) => {
        sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater;
    },
    state: {
        get sorting() { return sorting.value; },
    },
    initialState: {
        pagination: { pageSize: props.pageSize },
    },
});
</script>

<template>
    <div class="space-y-4">
        <div class="rounded-md border">
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
                            {{ emptyMessage }}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
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
                        :disabled="!table.getCanPreviousPage()"
                        @click="table.setPageIndex(0)"
                        aria-label="First page"
                    >
                        <ChevronsLeft class="size-4" />
                    </Button>
                    <Button
                        variant="outline" size="icon-sm"
                        :disabled="!table.getCanPreviousPage()"
                        @click="table.previousPage()"
                        aria-label="Previous page"
                    >
                        <ChevronLeft class="size-4" />
                    </Button>
                    <Button
                        variant="outline" size="icon-sm"
                        :disabled="!table.getCanNextPage()"
                        @click="table.nextPage()"
                        aria-label="Next page"
                    >
                        <ChevronRight class="size-4" />
                    </Button>
                    <Button
                        variant="outline" size="icon-sm"
                        :disabled="!table.getCanNextPage()"
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
