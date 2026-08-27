import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

export function useTemperature(getCelsius) {
  const configStore = useConfigStore()

  const displayTemp = computed(() => {
    const celsius = Number(getCelsius())

    if (configStore.unit === 'fahrenheit') {
      return Math.round((celsius * 9) / 5 + 32)
    }

    return Math.round(celsius)
  })
  const unitSymbol = computed(() => configStore.unitSymbol)

  return { displayTemp, unitSymbol }
}
