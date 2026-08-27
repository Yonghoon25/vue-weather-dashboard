<template>
  <v-card class="mb-4" elevation="2" rounded="lg">
    <v-card-title v-if="$slots.title" class="text-h6 font-weight-bold pa-4 pb-2">
      <slot name="title" />
    </v-card-title>

    <v-card-text class="pt-2">
      <slot />
    </v-card-text>
  </v-card>
</template>
