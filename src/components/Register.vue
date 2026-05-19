<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4">

    <div class="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">

      <h1 class="text-2xl font-bold text-slate-800 mb-1">
        Create account ✨
      </h1>

      <p class="text-sm text-slate-500 mb-6">
        Start your focus journey with Pomodoro
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

        <!-- REGISTER BUTTON -->
        <button
          @click="register"
          class="w-full px-4 py-3 rounded-2xl bg-indigo-500 text-white font-semibold
                 shadow-md hover:bg-indigo-600 active:scale-[0.98]
                 transition-all duration-200"
        >
          Create account
        </button>

        <!-- LOGIN LINK -->
        <p class="text-sm text-slate-500 text-center mt-2">
          Already have an account?
          <span
            @click="goLogin"
            class="text-indigo-500 font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

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

const register = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })

  console.log('REGISTER DATA:', data)
  console.log('REGISTER ERROR:', error)

  if (data?.user) {
    router.push('/')
  }
}

const goLogin = () => {
  router.push('/login')
}
</script>