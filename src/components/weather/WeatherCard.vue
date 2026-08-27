<script setup>
import { computed } from 'vue'
import { useTemperature } from '@/composables/useTemperature'

const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])
const { displayTemp, unitSymbol } = useTemperature(() => props.cityItem.today.temp)

const isHot = computed(() => props.cityItem.today.temp >= 25)
</script>

<template>
  <v-card
    class="mb-3"
    elevation="1"
    rounded="lg"
    hover
    @click="emit('select-card', `${props.cityItem.name}이 선택됨`)"
  >
    <v-card-title class="d-flex align-center justify-space-between">
      <span>{{ props.cityItem.name }}</span>
      <v-chip :color="isHot ? 'red-lighten-1' : 'blue-lighten-1'" size="small" label>
        {{ isHot ? '더움 🔥' : '선선함 🌤️' }}
      </v-chip>
    </v-card-title>

    <v-card-text>
      <v-row dense>
        <v-col cols="6">
          <div class="text-caption text-medium-emphasis">현재 기온</div>
          <div class="text-h6 font-weight-bold">{{ displayTemp }}{{ unitSymbol }}</div>
        </v-col>
        <v-col cols="6">
          <div class="text-caption text-medium-emphasis">날씨</div>
          <div>{{ props.cityItem.today.status }}</div>
        </v-col>
        <v-col cols="6">
          <div class="text-caption text-medium-emphasis">습도</div>
          <div>{{ props.cityItem.today.humidity }}%</div>
        </v-col>
        <v-col cols="6">
          <div class="text-caption text-medium-emphasis">풍속</div>
          <div>{{ props.cityItem.today.wind }}m/s</div>
        </v-col>
        <v-col cols="6">
          <div class="text-caption text-medium-emphasis">내일 기온</div>
          <div>{{ props.cityItem.tomorrow.temp?.toFixed(1) ?? '-' }}℃</div>
        </v-col>
        <v-col cols="6">
          <div class="text-caption text-medium-emphasis">내일 강수확률</div>
          <div>{{ Math.round((props.cityItem.tomorrow.rainProbability ?? 0) * 100) }}%</div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn
        color="blue-darken-2"
        variant="tonal"
        size="small"
        append-icon="mdi-chevron-right"
        @click.stop="emit('click-detail', props.cityItem.id)"
      >
        상세보기
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
