<script setup lang="ts">
import { useCollection } from 'vuefire'
import { collection, doc } from 'firebase/firestore'

definePageMeta({
  middleware: ['auth'],
})

const db = useFirestore()
const todos = useCollection(collection(db, 'payments'))
const someTodo = useDocument(doc(collection(db, 'todos'), '00jUhL99VkrBuKjuuBdR'))
</script>

<template>
  <div class="max-w-7xl mx-auto rounded-xl border border-gray-200 shadow md:mt-20 mt-4 p-8">
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
    <p>Welcome to the dashboard</p>
    {{ someTodo }} pink
  </div>
</template>