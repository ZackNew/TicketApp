<script setup lang="ts">
import { number, object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
import { addDoc, collection } from 'firebase/firestore'

const phoneNumberRegex = /^(09|07)\d{8}$|^\+2519|^\+2517\d{8}$|^2519|^2517\d{8}$/

const formSchema = object({
  email: string().email('Invalid email').required('Required'),
  full_name: string().required('Required'),
  image_path: string().required('Required'),
  number_of_tickets: number().required('Required'),
  phone_number: string().matches(phoneNumberRegex, 'Invalid phone number').required('Required'),
})

type FormSchema = InferType<typeof formSchema>

const loadingSubmit = ref(false)
const loadingImageUpload = ref(false)

const fileInput = ref<HTMLInputElement | null>(null)
const state = reactive({
  email: undefined,
  full_name: undefined,
  image_path: undefined,
  number_of_tickets: undefined,
  phone_number: undefined,
})

const db = useFirestore()
const toaster = useToast()

async function onSubmit(event: FormSubmitEvent<FormSchema>) {
  try {
    loadingSubmit.value = true
    const result = await addDoc(collection(db, 'payments'), {
      email: state.email,
      full_name: state.full_name,
      image_path: state.image_path,
      number_of_tickets: state.number_of_tickets,
      phone_number: state.phone_number,
    })
    if (result.id) {
      clearForm();
      toaster.add({
        title: 'Success',
        description: 'Payment submitted successfully. we will send you a confirmation email',
        timeout: 10000,
      })
    }
  } catch (error) {
    console.log(error)
  } finally {
    loadingSubmit.value = false
  }
}

async function uploadImage(event: any) {
  const file = event[0]
  if (!file) return;

  try {
    const response = await useUploadImage(file, file.name);
    if ((response as any)?.data?.display_url) {
      state.image_path = (response as any)?.data?.display_url;
    }
  } catch (error) {
    console.error("Upload failed", error);
  }
};

function clearForm() {
  state.email = undefined;
  state.full_name = undefined;
  state.image_path = undefined;
  state.number_of_tickets = undefined;
  state.phone_number = undefined;
}
</script>

<template>
  <div class="max-w-7xl mx-auto rounded-xl border border-gray-200 shadow mt-20 p-8 flex gap-4">
    <div class="w-1/2">
      <h2 class="text-xl font-semibold text-primary-900">Buy Your Ticket for the Trip!</h2>
      <p class="mt-4">
        We are excited to offer tickets for our upcoming trip! To secure your spot, please follow these simple steps:
      </p>
      <p class="mt-4">
        1️⃣ Make a Payment – Deposit the ticket amount to one of the following bank accounts: <br />

        💳 Bank Name 1: Account Name – XXXX | Account Number – XXXXXXX <br />
        🏦 Bank Name 2: Account Name – XXXX | Account Number – XXXXXXX <br />

        2️⃣ Keep Your Payment Receipt – You’ll need to upload a screenshot of your payment. <br />

        3️⃣ Fill Out the Form – After making the payment, complete the form on this page with your details. <br />

        📢 Once we verify your payment, we’ll confirm your ticket! <br />

        For any questions, feel free to contact us.
      </p>
    </div>
    <div class="w-1/2">
      <div class="max-w-96 mx-auto">
        <UForm :schema="formSchema" :state="state" @submit="onSubmit">
          <UFormGroup class="mt-4" label="Full Name" name="full_name">
            <UInput size="lg" v-model="state.full_name" />
          </UFormGroup>

          <UFormGroup class="mt-4" label="Email" name="email">
            <UInput size="lg" v-model="state.email" />
          </UFormGroup>

          <UFormGroup class="mt-4" label="Phone Number" name="phone_number">
            <UInput size="lg" v-model="state.phone_number" />
          </UFormGroup>

          <UFormGroup class="mt-4" label="Number  of tickets" name="number_of_tickets">
            <UInput size="lg" v-model="state.number_of_tickets" />
          </UFormGroup>

          <UFormGroup class="mt-4" label="Payment Image" name="image_path">
            <UInput ref="fileInput" v-model="state.image_path" size="lg" type="file" icon="i-heroicons-folder"
              @change="uploadImage" />
          </UFormGroup>

          <UButton :disabled="loadingImageUpload" :loading="loadingSubmit" label="Submit"
            class="bg-primary-900 hover:bg-primary-800 px-16 mt-12" size="lg" type="submit" />
        </UForm>
      </div>
    </div>
  </div>
</template>