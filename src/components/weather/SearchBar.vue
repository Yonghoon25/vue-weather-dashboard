<script setup>
const props = defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query'])
</script>

<template>
  <v-text-field
    :model-value="props.currentQuery"
    placeholder="검색할 도시 이름 입력"
    prepend-inner-icon="mdi-magnify"
    clearable
    hide-details
    density="compact"
    variant="outlined"
    @update:model-value="emit('update-query', $event)"
    @click:clear="emit('update-query', '')"
  />
</template>
