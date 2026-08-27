<script setup>
import { useConfigStore } from '@/stores/configStore'
const configStore = useConfigStore()
</script>

<template>
  <v-btn
    variant="outlined"
    color="white"
    size="small"
    class="mr-2"
    @click="configStore.toggleUnit"
  >
    <v-icon icon="mdi-thermometer" class="mr-1" />
    {{ configStore.unitSymbol }}
  </v-btn>
</template>
