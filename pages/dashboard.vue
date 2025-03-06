<script setup lang="ts">
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable";

definePageMeta({
  middleware: ['auth'],
})

interface Payment {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  full_name: string;
  email: string;
  phone_number: string;
  // number_of_tickets: number;
  image_path: string;
  ticketNumber: string;
}

// const { data: payments, error, execute: refetchPayments } = useFetch<Payment[]>('/api/dashboard/getDashboard', {
//   method: 'POST',
// })

const filterStatus = ref<'pending' | 'approved' | 'rejected'>('pending')

const { data: payments, error, execute: refetchPayments } = useFetch<Payment[]>('/api/dashboard/getDashboard', {
  query: computed(() => ({ status: filterStatus.value })),
  watch: [filterStatus]
});

const loadingDownloadPdf = ref(false)

const toaster = useToast()

const listPayments = computed(() => {
  if (!payments.value) return []
  return payments.value.filter(p => p.status === filterStatus.value).sort((a, b) => a.full_name.localeCompare(b.full_name))
    .map((p, index) => ({
      No: index + 1,
      Name: p.full_name,
      Email: p.email,
      Phone: p.phone_number,
      // Tickets: p.number_of_tickets,
      Image: p.image_path,
      TicketNumber: p.ticketNumber,
      actions: p.id
    }));
})

const generatePDF = () => {
  const printableContent = document.getElementById("printable-table")?.innerHTML;
  if (!printableContent) {
    console.error("No table found!");
    return;
  }

  const printWindow = window.open("", "", "width=800,height=600");
  if (!printWindow) {
    console.error("Failed to open print window!");
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>Print Table</title>
        <style>
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        ${printableContent}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
  printWindow.close();
};

function approveOrReject(status: 'approved' | 'rejected', id: string, userName: string, email: string) {
  toaster.add({
    id: 'postJob',
    title: 'Are you sure you want to approve',
    color: 'red',
    timeout: 0,
    actions: [{
      label: 'Yes',
      click: async () => {
        try {
          console.log(userName);

          const response: { message: string; success: string } = await $fetch("/api/dashboard/update-payment", {
            method: "POST",
            body: {
              id,
              status,
              userName,
              email,
              // numberOfTickets
            },
          });
          if (response.success) {
            toaster.add({
              title: `Payment ${status} successfully`,
              color: 'green',
              timeout: 5000,
            })
            // refetchPayments()
          }
        } catch (error) {
          console.error(error)
        }
      },

    }, {

      label: 'No',
      color: 'red',
      click: () => toaster.clear(),
    }],
  })
}
</script>

<template>
  <div class="max-w-7xl mx-auto rounded-xl border border-gray-200 shadow md:mt-20 mt-4 p-8">
    <div class="flex justify-between">
      <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
      <div class="flex gap-2 text-white">
        <p class="cursor-pointer" :class="filterStatus === 'pending' ? 'text-green-500' : ''"
          @click="filterStatus = 'pending'; refetchPayments()">Pending</p>
        <p>|</p>
        <p class="cursor-pointer" :class="filterStatus === 'approved' ? 'text-green-500' : ''"
          @click="filterStatus = 'approved'; refetchPayments()">Approved</p>
        <p>|</p>
        <p class="cursor-pointer" :class="filterStatus === 'rejected' ? 'text-green-500' : ''"
          @click="filterStatus = 'rejected'; refetchPayments()">Rejected</p>
      </div>
    </div>
    <div class="flex gap-2">
      <UButton label="Refresh" @click="refetchPayments()" class="mb-2" />
      <UButton label="Download PDF" @click="generatePDF()" class="mb-2 bg-blue-500 text-white"
        :loading="loadingDownloadPdf" />
    </div>
    <div class="bg-white rounded-lg p-4">
      <UTable v-if="listPayments.length" :rows="listPayments">
        <template #Image-data="{ row }">
          <a :href="row.Image" target="_blank" class="text-green-700">open image</a>
        </template>
        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton size="sm" label="Approve" @click="approveOrReject('approved', row.actions, row.Name, row.Email)" />
            <UButton color="red" size="sm" label="Reject"
              @click="approveOrReject('rejected', row.actions, row.Name, row.Email)" />
          </div>
        </template>
      </UTable>
    </div>
    <div id="printable-table">
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Ticket Number</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="payment in listPayments" :key="payment.No">
            <td>{{ payment.No }}</td>
            <td>{{ payment.Name }}</td>
            <td>{{ payment.Phone }}</td>
            <td>{{ payment.TicketNumber }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
#printable-table {
  display: none;
  /* Hide it by default */
}

@media print {
  body * {
    visibility: hidden;
    /* Hide everything */
  }

  #printable-table,
  #printable-table * {
    visibility: visible;
    /* Show only the printable table */
  }

  #printable-table {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>