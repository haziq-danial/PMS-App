<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { X } from '@lucide/vue';

const props = defineProps({
  options: { type: Array, required: true },
  modelValue: { type: Array, default: () => [] }
});

const emit = defineEmits(['update:modelValue']);

const searchQuery = ref('');
const isOpen = ref(false);
const container = ref(null);
const activeIndex = ref(0); // Tracks keyboard highlight

const filteredOptions = computed(() => {
  return props.options.filter(option => {
    const matchesSearch = option.label.toLowerCase().includes(searchQuery.value.toLowerCase());
    const isNotSelected = !props.modelValue.some(selected => selected.id === option.id);
    return matchesSearch && isNotSelected;
  });
});

// Reset highlight when search changes or dropdown opens
watch([searchQuery, isOpen], () => {
  activeIndex.value = 0;
});

const selectOption = (option) => {
  if (!option) return;
  emit('update:modelValue', [...props.modelValue, option]);
  searchQuery.value = '';
  // Keep focus on input after selection
};

const removeOption = (id) => {
  emit('update:modelValue', props.modelValue.filter(item => item.id !== id));
};

// Keyboard Navigation Handler
const handleKeyDown = (e) => {
  if (!isOpen.value) {
    if (e.key === 'ArrowDown' || e.key === 'Enter') isOpen.value = true;
    return;
  }

  switch (e.key) {
    case 'ArrowDown':
      if (activeIndex.value < filteredOptions.value.length - 1) {
        activeIndex.value++;
      }
      break;
    case 'ArrowUp':
      if (activeIndex.value > 0) {
        activeIndex.value--;
      }
      break;
    case 'Enter':
      e.preventDefault(); // Prevent form submission
      if (filteredOptions.value[activeIndex.value]) {
        selectOption(filteredOptions.value[activeIndex.value]);
      }
      break;
    case 'Escape':
      isOpen.value = false;
      break;
    case 'Backspace':
      // Remove last tag if search query is empty
      if (searchQuery.value === '' && props.modelValue.length > 0) {
        removeOption(props.modelValue[props.modelValue.length - 1].id);
      }
      break;
  }
};

const handleClickOutside = (event) => {
  if (container.value && !container.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<template>
  <div ref="container" class="relative w-full max-w-md" @keydown="handleKeyDown">
    <div
      class="flex min-h-9 flex-wrap gap-1.5 rounded-md border border-input bg-transparent p-1.5 shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50"
      @click="isOpen = true"
    >
      <span
        v-for="item in modelValue" :key="item.id"
        class="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
      >
        {{ item.label }}
        <button type="button" @click.stop="removeOption(item.id)" class="rounded-full p-0.5 hover:bg-accent">
          <X class="size-3" />
        </button>
      </span>

      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="min-w-20 flex-1 bg-transparent p-0.5 text-sm outline-none placeholder:text-muted-foreground"
        @focus="isOpen = true"
      />
    </div>

    <div
      v-if="isOpen && filteredOptions.length > 0"
      class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
    >
      <ul>
        <li
          v-for="(option, index) in filteredOptions"
          :key="option.id"
          @click="selectOption(option)"
          @mouseenter="activeIndex = index"
          :class="[
            'cursor-pointer rounded-sm px-2 py-1.5 text-sm',
            activeIndex === index ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'
          ]"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>
