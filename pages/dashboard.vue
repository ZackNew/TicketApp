<script setup lang="ts">
import { useCollection } from 'vuefire'
import { collection, doc, updateDoc } from 'firebase/firestore'

definePageMeta({
  middleware: ['auth'],
})

// const db = useFirestore()
const { data: payments, pending, error } = useFetch('/api/dashboard/getDashboard')

const filterStatus = ref<'pending' | 'approved' | 'rejected'>('pending')

const toaster = useToast()

// const pendingPayments = computed(() => {
//   return payments.value.filter(p => p.status === filterStatus.value)
//     .map(p => ({
//       Name: p.full_name,
//       Email: p.email,
//       Phone: p.phone_number,
//       Tickets: p.number_of_tickets,
//       Image: p.image_path,
//       actions: p.id
//     }))
// })

// function approveOrReject(status: 'approved' | 'rejected', id: string) {
//   toaster.add({
//     id: 'postJob',
//     title: 'Are you sure you want to approve',
//     color: 'red',
//     timeout: 0,
//     actions: [{
//       label: 'Yes',
//       click: async () => {
//         try {
//           await updateDoc(doc(db, 'payments', id), {
//             status: status
//           })
//         } catch (error) {
//           console.error(error)
//         }
//       },

//     }, {

//       label: 'No',
//       color: 'red',
//       click: () => toaster.clear(),
//     }],
//   })
// }
</script>

<template>
  <div class="max-w-7xl mx-auto rounded-xl border border-gray-200 shadow md:mt-20 mt-4 p-8">
    <div class="flex justify-between">
      <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
      <div class="flex gap-2 text-white">
        <p class="cursor-pointer" :class="filterStatus === 'pending' ? 'text-green-500' : ''"
          @click="filterStatus = 'pending'">Pending</p>
        <p>|</p>
        <p class="cursor-pointer" :class="filterStatus === 'approved' ? 'text-green-500' : ''"
          @click="filterStatus = 'approved'">Approved</p>
        <p>|</p>
        <p class="cursor-pointer" :class="filterStatus === 'rejected' ? 'text-green-500' : ''"
          @click="filterStatus = 'rejected'">Rejected</p>
      </div>
    </div> {{ payments }}
    <!-- <div class="bg-white rounded-lg p-4">
      <UTable v-if="pendingPayments.length" :rows="pendingPayments">
        <template #Image-data="{ row }">
          <a :href="row.Image" target="_blank" class="text-green-700">open image</a>
        </template>
<template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton size="sm" label="Approve" @click="approveOrReject('approved', row.actions)" />
            <UButton color="red" size="sm" label="Reject" @click="approveOrReject('rejected', row.actions)" />
          </div>
        </template>
</UTable>
</div> -->
  </div>
</template>