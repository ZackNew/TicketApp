<script setup lang="ts">
import { signInWithEmailAndPassword } from 'firebase/auth';

definePageMeta({
  middleware: ['authenticated'],
})

const auth = useFirebaseAuth();

const state = reactive({
  email: '',
  password: '',
});
const loadingLogin = ref(false);

async function loginUser() {
  if (auth) {
    loadingLogin.value = true;
    try {
      await signInWithEmailAndPassword(auth, state.email, state.password)
        .then((userCredential) => {
          const user = userCredential.user
          console.log(user);

        })
    } catch (error) {
      console.log(error);
    } finally {
      loadingLogin.value = false;
    }
  }
}
</script>

<template>
  <div class="border border-gray-400 rounded-lg w-96 mx-auto mt-48 p-8">
    <h1 class="text-2xl font-semibold text-primary-900">Login to Dashboard</h1>
    <form @submit.prevent="loginUser">
      <div class="flex flex-col mt-8">
        <label class="text-sm text-gray-700" for="email">Email</label>
        <input v-model="state.email" type="email" id="email" class="border p-2 rounded-lg border-gray-400"
          placeholder="Enter your email" />
      </div>
      <div class="flex flex-col mt-4">
        <label class="text-sm text-gray-700" for="password">Password</label>
        <input v-model="state.password" type="password" id="password" class="border p-2 rounded-lg border-gray-400"
          placeholder="Enter password" />
      </div>
      <UButton :disabled="loadingLogin" type="submit" block :loading="loadingLogin"
        class="bg-primary-900 w-full rounded-lg py-3 text-white font-semibold mt-10">Login</UButton>
    </form>
  </div>
</template>