<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

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
      class="min-h-10.5 p-1 flex flex-wrap gap-2 border rounded-lg bg-white shadow-sm focus-within:ring-2 focus-within:ring-primary transition-all"
      @click="isOpen = true"
    >
      <span 
        v-for="item in modelValue" :key="item.id"
        class="flex items-center gap-1 px-2 py-1 bg-purple-100 text-primary text-sm font-medium rounded-md"
      >
        {{ item.label }}
        <button @click.stop="removeOption(item.id)" class="hover:bg-purple-200 rounded-full p-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </span>

      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="flex-1 min-w-20 outline-none text-sm p-1"
        @focus="isOpen = true"
      />
    </div>

    <div 
      v-if="isOpen && filteredOptions.length > 0"
      class="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto"
    >
      <ul class="py-1">
        <li 
          v-for="(option, index) in filteredOptions" 
          :key="option.id"
          @click="selectOption(option)"
          @mouseenter="activeIndex = index"
          :class="[
            'px-4 py-2 cursor-pointer text-sm',
            activeIndex === index ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>