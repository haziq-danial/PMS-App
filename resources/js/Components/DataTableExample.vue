<template>
    <div class="table-container space-y-4">
        <!-- Search Input -->
        <div v-if="searchable" class="flex justify-between items-center">
            <div class="form-control w-full max-w-xs">
                <div class="input-group">
                    <input 
                        type="text" 
                        v-model="searchQuery"
                        placeholder="Search..." 
                        class="input input-bordered input-sm w-full"
                    />
                    <button class="btn btn-square btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            <table v-bind="$attrs" class="table table-zebra w-full">
                <thead>
                    <tr>
                        <slot name="header-start-actions"></slot>
                        <slot v-for="col in columns" :name="`header-${col.key}`" :col="col" :key="col.key">
                            <th 
                                @click="col.sortable && handleSort(col.key)"
                                :class="{ 
                                    'cursor-pointer hover:bg-base-300': col.sortable,
                                    'bg-base-300': sortColumn === col.key
                                }"
                            >
                                <div class="flex items-center gap-1">
                                    {{ col.label }}
                                    <span v-if="sortColumn === col.key" class="text-primary">
                                        {{ sortDirection === 'asc' ? '↑' : '↓' }}
                                    </span>
                                </div>
                            </th>
                        </slot>
                        <slot name="header-end-actions"></slot>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in paginatedData" :key="item.id" class="hover">
                        <slot name="body-start-actions"></slot>
                        <slot v-for="col in columns" :name="col.key" :key="col.key" :item="item">
                            <td>
                                {{ formatCellValue(item[col.key], col) }}
                            </td>
                        </slot>
                        <slot name="body-end-actions"></slot>
                    </tr>
                    
                    <!-- Empty State -->
                    <tr v-if="paginatedData.length === 0">
                        <td :colspan="columns.length" class="text-center py-8">
                            <div class="flex flex-col items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-base-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <span class="text-base-content/70">{{ noDataMessage }}</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div v-if="paginated && filteredData.length > 0" class="flex justify-between items-center">
            <div class="text-sm text-base-content/70">
                Showing {{ paginationStart }} to {{ paginationEnd }} of {{ filteredData.length }} entries
            </div>
            
            <div class="flex gap-2 items-center">
                <!-- Items per page selector -->
                <select v-model="itemsPerPage" class="select select-bordered select-sm">
                    <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
                        {{ option }} per page
                    </option>
                </select>

                <!-- Pagination buttons -->
                <div class="btn-group">
                    <button 
                        class="btn btn-sm" 
                        @click="currentPage--"
                        :disabled="currentPage === 1"
                    >
                        «
                    </button>
                    
                    <button 
                        v-for="page in displayedPages" 
                        :key="page"
                        @click="currentPage = page"
                        class="btn btn-sm"
                        :class="{ 'btn-active': currentPage === page }"
                        :disabled="page === '...'"
                    >
                        {{ page }}
                    </button>
                    
                    <button 
                        class="btn btn-sm" 
                        @click="currentPage++"
                        :disabled="currentPage === totalPages"
                    >
                        »
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    columns: { 
        type: Array, 
        required: true,
        validator: (columns) => {
            return columns.every(col => col.key && col.label)
        }
    },
    items: { 
        type: Array, 
        required: true 
    },
    
    // Feature flags
    searchable: {
        type: Boolean,
        default: false
    },
    paginated: {
        type: Boolean,
        default: false
    },
    
    // Search configuration
    searchKeys: {
        type: Array,
        default: () => []
    },
    
    // Pagination configuration
    itemsPerPageOptions: {
        type: Array,
        default: () => [10, 25, 50, 100]
    },
    defaultItemsPerPage: {
        type: Number,
        default: 10
    },
    
    // Display configuration
    noDataMessage: {
        type: String,
        default: 'No data available'
    },
    
    // Custom formatters
    formatters: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update:sort', 'search', 'page-change'])

// Search state
const searchQuery = ref('')

// Sorting state
const sortColumn = ref(null)
const sortDirection = ref('asc')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(props.defaultItemsPerPage)

// Watch for search changes
watch(searchQuery, (newQuery) => {
    currentPage.value = 1
    emit('search', newQuery)
})

// Watch for items changes to reset pagination
watch(() => props.items, () => {
    currentPage.value = 1
})

// Filtered data based on search
const filteredData = computed(() => {
    let data = [...props.items]
    
    // Apply search filter
    if (props.searchable && searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        const searchKeys = props.searchKeys.length > 0 
            ? props.searchKeys 
            : props.columns.map(col => col.key)
        
        data = data.filter(item => {
            return searchKeys.some(key => {
                const value = item[key]
                return value && String(value).toLowerCase().includes(query)
            })
        })
    }
    
    // Apply sorting
    if (sortColumn.value) {
        data.sort((a, b) => {
            let aVal = a[sortColumn.value]
            let bVal = b[sortColumn.value]
            
            // Handle different data types
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal
            }
            
            // Handle dates
            if (aVal instanceof Date || bVal instanceof Date) {
                aVal = new Date(aVal).getTime()
                bVal = new Date(bVal).getTime()
                return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal
            }
            
            // Default string comparison
            aVal = String(aVal).toLowerCase()
            bVal = String(bVal).toLowerCase()
            
            if (sortDirection.value === 'asc') {
                return aVal.localeCompare(bVal)
            } else {
                return bVal.localeCompare(aVal)
            }
        })
    }
    
    return data
})

// Paginated data
const paginatedData = computed(() => {
    if (!props.paginated) {
        return filteredData.value
    }
    
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredData.value.slice(start, end)
})

// Pagination calculations
const totalPages = computed(() => {
    return Math.ceil(filteredData.value.length / itemsPerPage.value)
})

const paginationStart = computed(() => {
    return filteredData.value.length === 0 ? 0 : ((currentPage.value - 1) * itemsPerPage.value) + 1
})

const paginationEnd = computed(() => {
    return Math.min(currentPage.value * itemsPerPage.value, filteredData.value.length)
})

// Displayed pages for pagination
const displayedPages = computed(() => {
    const delta = 2
    const range = []
    const rangeWithDots = []
    let l
    
    for (let i = 1; i <= totalPages.value; i++) {
        if (i === 1 || i === totalPages.value || (i >= currentPage.value - delta && i <= currentPage.value + delta)) {
            range.push(i)
        }
    }
    
    range.forEach((i) => {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1)
            } else if (i - l !== 1) {
                rangeWithDots.push('...')
            }
        }
        rangeWithDots.push(i)
        l = i
    })
    
    return rangeWithDots
})

// Methods
const handleSort = (columnKey) => {
    if (sortColumn.value === columnKey) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortColumn.value = columnKey
        sortDirection.value = 'asc'
    }
    emit('update:sort', { column: columnKey, direction: sortDirection.value })
}

const formatCellValue = (value, column) => {
    // Check if there's a custom formatter for this column
    if (props.formatters[column.key]) {
        return props.formatters[column.key](value)
    }
    
    // Default formatting
    if (value === null || value === undefined) {
        return '-'
    }
    
    if (value instanceof Date) {
        return value.toLocaleDateString()
    }
    
    return value
}

// Watch for itemsPerPage changes to adjust current page if needed
watch(itemsPerPage, () => {
    if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value || 1
    }
})

// Watch for page changes
watch(currentPage, (newPage) => {
    emit('page-change', newPage)
})
</script>