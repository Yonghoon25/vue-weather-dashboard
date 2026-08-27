import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

// store 생성 -> unit / unitSymbole / toggleunit 정의
export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius')
  const unitSymbol = computed(() => (unit.value === 'celsius' ? '℃' : '℉'))

  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  return { unit, unitSymbol, toggleUnit }
})
