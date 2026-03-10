<script setup>

</script>
<template>
    <Head title=" | Dashboard"></Head>
    <div class="flex justify-between items-center">
        <p class="font-medium text-lg">Dashboard</p>
        <div class="breadcrumbs p-0 mr-1 text-sm inline">
            <ul>
                <li>PETAKOM</li>
                <li>Admin</li>
                <li>Dashboard</li>
            </ul>
        </div>
    </div>
    <div class="mt-6">
        <div class="flex flex-col gap-6 md:flex-row md:flex-wrap">
            <!-- Card 1: Takes full width on mobile, 1/3 on desktop -->
            <div class="p-6 bg-white rounded-lg shadow flex-1 md:basis-1/3">
                <h3 class="text-lg font-bold">Card Title 1</h3>
                <p>This card will grow and shrink to fill the row equally.</p>
            </div>
            <!-- Card 2: Similar sizing -->
            <div class="p-6 bg-white rounded-lg shadow flex-1 md:basis-1/3">
                <h3 class="text-lg font-bold">Card Title 2</h3>
                <p>All cards in this row will have equal width.</p>
            </div>
            <!-- Card 3 -->
            <div class="p-6 bg-white rounded-lg shadow flex-1 md:basis-1/3">
                <h3 class="text-lg font-bold">Card Title 3</h3>
                <p>Notice how the cards wrap to a new line on smaller viewports.</p>
            </div>
        </div>
    </div>
</template>