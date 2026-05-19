import './style.css'

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4">

    <div class="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">

      <h1 class="text-2xl font-bold text-slate-800 mb-1">
        Welcome back 👋
      </h1>

      <p class="text-sm text-slate-500 mb-6">
        Login to continue your focus sessions
      </p>

      <div class="flex flex-col gap-4">

        <!-- EMAIL -->
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-700 placeholder-slate-400
                 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400
                 transition-all duration-200"
        />

        <!-- PASSWORD -->
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-700 placeholder-slate-400
                 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400
                 transition-all duration-200"
        />

        <!-- BUTTON -->
        <button
          @click="login"
          class="w-full px-4 py-3 rounded-2xl bg-indigo-500 text-white font-semibold
                 shadow-md hover:bg-indigo-600 active:scale-[0.98]
                 transition-all duration-200"
        >
          Login
        </button>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'

const router = useRouter()

const email = ref('')
const password = ref('')

const login = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  console.log('LOGIN DATA:', data)
  console.log('LOGIN ERROR:', error)

  if (data?.user) {
    router.push('/')
  }
}
</script>

