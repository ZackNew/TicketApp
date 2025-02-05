<script setup lang="ts">
import { addDoc, collection } from 'firebase/firestore'

const db = useFirestore()

async function createCollection() {
  await addDoc(collection(db, 'payments'), {
    full_name: 'test Name',
    phone_number: '+251999999999',
    number_of_tickets: 1,
    image_path: 'https://www.google.com',
  })
}
</script>

<template>
  <div class="">
    <h1 @click="createCollection">This is pink page</h1>
  </div>
</template>