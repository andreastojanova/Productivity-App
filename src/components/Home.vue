<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100 p-5">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-4">
        <div>
          <!-- left side - empty or add logo here -->
        </div>
        <div class="flex gap-3 items-center">
    <span v-if="user" class="text-sm text-slate-500">
        👋 {{ user.email.split('@')[0] }}

    </span>
          <button v-if="!user" @click="goLogin"
                  class="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold shadow-sm hover:bg-slate-50 transition-all">
            Login
          </button>
          <button v-if="!user" @click="goRegister"
                  class="px-8 py-2.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-indigo-200">
            Register
          </button>
          <button v-if="user" @click="logout"
                  class="px-8 py-2.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-indigo-200">
            Logout
          </button>
        </div>
      </div>

      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-slate-800 mb-2">🍅 Pomodoro Focus</h1>
        <p class="text-slate-500">Stay focused and productive.</p>
      </div>

      <div class="flex flex-row items-stretch justify-center -mx-2">
        <div class="p-2.5 w-1/2">
          <TimerPomodoro @session-completed="updateStats"/>
        </div>
        <div class="p-2.5 w-1/2">
          <div v-if="user">
            <UserStats :history="allSessions" @clear-history="clearHistory"/>
          </div>

          <div
              v-else
              class="w-full h-full bg-white/70 backdrop-blur-md rounded-3xl border border-white/40 shadow-xl p-6 text-center flex flex-col items-center justify-center"
          >
            <div class="text-5xl mb-4">🔒</div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">Login Required</h3>
            <p class="text-slate-500 mb-5">Sign in to save and view your focus statistics.</p>
            <button
                @click="goLogin"
                class="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg shadow-indigo-200 hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              Login Now
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <TodoList/>
      </div>


    </div>
  </div>
</template>

<script setup>
import {inject} from "vue";
import {useRouter} from "vue-router";
import {supabase} from '../supabase';

import TimerPomodoro from "./TimerPomodoro.vue";
import UserStats from "./UserStats.vue";
import TodoList from "./TodoList.vue";


const router = useRouter();

const user = inject('user');
const allSessions = inject('allSessions');
const clearAuth = inject('clearAuth');


const goLogin = () => router.push('/login');
const goRegister = () => router.push('/register');

console.log('SUPABASE:', supabase);


const logout = async () => {
  console.log('LOGOUT CLICKED');
  clearAuth();
  await supabase.auth.signOut();
  router.push('/login');
};

const updateStats = async (data) => {
  console.log('UPDATE STATS CALLED');

  // always update UI immediately
  allSessions.value.unshift(data);

  // save to localStorage as backup
  localStorage.setItem('pomodoro-history', JSON.stringify(allSessions.value));

  // try to save to Supabase if logged in
  if (user.value) {
    try {
      const {error} = await supabase.from('sessions').insert({
        user_id: user.value.id,
        type: data.type,
        duration: data.duration,
        timestamp: data.timestamp
      });
      console.log('INSERT ERROR:', error);
    } catch (e) {
      console.log('SUPABASE INSERT FAILED:', e);
    }
  }
};

const clearHistory = async () => {
  if (!user.value) return;

  await supabase
      .from('sessions')
      .delete()
      .eq('user_id', user.value.id);

  allSessions.value = [];
};
</script>