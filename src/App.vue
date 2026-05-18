<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100 p-5">
    <div class="max-w-6xl mx-auto">

      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-slate-800 mb-2">🍅 Pomodoro Focus</h1>
        <p class="text-slate-500">Stay focused and productive.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div class="lg:col-span-2">
          <TimerPomodoro @session-completed="updateStats" />
        </div>
        <div>
          <UserStats :history="allSessions" @clear-history="clearHistory" />
        </div>
      </div>

      <div class="mt-6">
        <TodoList />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TimerPomodoro from "./components/TimerPomodoro.vue";
import UserStats from "./components/UserStats.vue";
import TodoList from "./components/TodoList.vue";

const allSessions = ref([]);

const updateStats = (data) => {
  allSessions.value.unshift(data);
  localStorage.setItem('pomodoro-history', JSON.stringify(allSessions.value));
};

const clearHistory = () => {
  allSessions.value = [];
  localStorage.removeItem('pomodoro-history');
};

onMounted(() => {
  const saved = localStorage.getItem('pomodoro-history');
  if (saved) allSessions.value = JSON.parse(saved);
});
</script>