<script setup>
import { provide } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import UnitToggler from '@/components/weather/UnitToggler.vue'

provide('appTitle', 'Vue Weather Dashboard')
</script>

<template>
  <v-app>
    <v-app-bar color="blue-darken-3" elevation="2">
      <v-app-bar-title>
        <v-icon icon="mdi-weather-cloudy" class="mr-2" />
        Vue Weather Dashboard
      </v-app-bar-title>

      <template #append>
        <RouterLink to="/" style="text-decoration: none">
          <v-btn variant="text" color="white">Home</v-btn>
        </RouterLink>
        <RouterLink to="/about" style="text-decoration: none">
          <v-btn variant="text" color="white">About</v-btn>
        </RouterLink>
        <UnitToggler />
      </template>
    </v-app-bar>

    <v-main class="bg-blue-lighten-5">
      <v-container class="py-6">
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
