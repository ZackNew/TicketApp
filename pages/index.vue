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
      console.log(state.image_path);

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
  <div class="p-2 md:p-0">
    <div class="max-w-7xl mx-auto md:p-8 p-2 md:flex flex-row gap-4">
      <div class="md:w-1/2 mx-auto shadow border rounded-xl p-4">
        <img class="rounded-lg" src="/img/home.jpeg" />
        <div class="mt-4">
          <h1 class="text-xl font-semibold">የ6ኛዙር የሱባዔ ጉባኤ ተማሪዎች ጉዞ ፩</h1>
          <p class="mt-4">
            ርእሰ አድባራት ወገዳማት ዳግሚት ጽዮን አዲስ አለም ማርያም ገዳም የካቲት ፴
          </p>
          <p class="mt-4">
            እንዳልጓዝ የሚከለክለኝ ምንድነው?
          </p>
          <p class="mt-4">
            ቦሌ ደብረ ሳሌም መድኃኔዓለም መጥምቁ ቅዱስ ዮሐንስ ወአቡነ አረጋዊ ካቴድራል ፈለገ ዮርዳኖስ ሰ/ት/ቤት
          </p>
          <p class="mt-8">
            የክፍያ አማራጮች (የጉዞ ዋጋ ብር 500)
          </p>
          <p class="mt-2">
            <span class="font-semibold">Commericial Bank Of Ethiopia: </span> 1000316708777 - Biruk Akaleweld
          </p>
          <p class="mt-2">
            <span class="font-semibold">Bank Of Abyssinia: </span> 37564281 - Biruk Akaleweld
          </p>
          <p class="mt-2">
            <span class="font-semibold">Telebirr: </span> +251987272007 - Biruk
          </p>
        </div>
      </div>
      <div class="md:w-1/2 mx-auto mt-12 md:mt-0 shadow border rounded-xl p-4">
        <div class="p-4 mx-auto">
          <h1 class="text-xl font-semibold mb-6">Submit your payment</h1>
          <UForm :schema="formSchema" :state="state" @submit="onSubmit">
            <UFormGroup class="mt-4" label="Full Name" name="full_name" :ui="{ label: { base: 'text-white' } }">
              <UInput size="lg" v-model="state.full_name" />
            </UFormGroup>

            <UFormGroup class="mt-4" label="Email" name="email" :ui="{ label: { base: 'text-white' } }">
              <UInput size="lg" v-model="state.email" />
            </UFormGroup>

            <UFormGroup class="mt-4" label="Phone Number" name="phone_number" :ui="{ label: { base: 'text-white' } }">
              <UInput size="lg" v-model="state.phone_number" />
            </UFormGroup>

            <UFormGroup class="mt-4" label="Number  of tickets" name="number_of_tickets"
              :ui="{ label: { base: 'text-white' } }">
              <UInput size="lg" v-model="state.number_of_tickets" />
            </UFormGroup>

            <UFormGroup class="mt-4" label="Payment Image" name="image_path" :ui="{ label: { base: 'text-white' } }">
              <UInput ref="fileInput" v-model="state.image_path" size="lg" type="file" icon="i-heroicons-folder"
                @change="uploadImage" />
            </UFormGroup>

            <UButton :disabled="loadingImageUpload" :loading="loadingSubmit" label="Submit"
              class="bg-primary-900 hover:bg-primary-800 px-16 mt-12" size="lg" type="submit" />
          </UForm>
        </div>
      </div>
    </div>
  </div>
</template>