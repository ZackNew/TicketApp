<template>
  <div class="flex h-screen flex-col items-center justify-center text-center p-6">
    <h1 class="text-6xl font-bold text-green-800">{{ error!.statusCode }}</h1>
    <p class="text-2xl mt-4">{{ error!.message || 'Oops! Page not found.' }}</p>
    <NuxtLink to="/" class="mt-6 px-4 py-2 bg-green-900 text-white rounded">Go Home</NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps({
  error: Object
});
</script>
