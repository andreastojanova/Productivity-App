UserStats.vue

<template>
  <div
      class="w-full h-full bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-6"
  >
    <h2 class="text-xl font-bold text-slate-800 mb-6 text-center">
      Session Stats
    </h2>

    <div class="grid grid-cols-2 gap-4 mb-6">

      <div
          class="rounded-2xl bg-gradient-to-br from-indigo-50 to-white p-5 border border-indigo-100 text-center"
      >
        <div class="text-3xl font-bold text-indigo-600">
          {{ totalSessions }}
        </div>

        <div class="text-sm text-slate-400 mt-1">
          Sessions
        </div>
      </div>

      <div
          class="rounded-2xl bg-gradient-to-br from-emerald-50 to-white p-5 border border-emerald-100 text-center"
      >
        <div class="text-3xl font-bold text-emerald-500">
          {{ totalFocusMinutes }}m
        </div>

        <div class="text-sm text-slate-400 mt-1">
          Focus Time
        </div>
      </div>
    </div>

    <div class="space-y-3">

      <div class="flex justify-between bg-slate-50 rounded-2xl p-4">
        <span class="text-slate-500">Work Sessions</span>

        <span class="font-semibold text-indigo-600">
          {{ workSessions }}
        </span>
      </div>

      <div class="flex justify-between bg-slate-50 rounded-2xl p-4">
        <span class="text-slate-500">Break Sessions</span>

        <span class="font-semibold text-emerald-500">
          {{ breakSessions }}
        </span>
      </div>
    </div>
    <button
        @click="$emit('clear-history')"
        class="w-full mt-4 py-2 rounded-2xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all duration-300"
    >
      Clear History
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  history: {
    type: Array,
    default: () => [],
  },
});


const totalSessions = computed(() => props.history.length);

const workSessions = computed(() =>
    props.history.filter((s) => s.type === "work").length
);

const breakSessions = computed(() =>
    props.history.filter((s) => s.type === "shortBreak").length
);

const totalFocusMinutes = computed(() => {
  return props.history
      .filter((s) => s.type === "work")
      .reduce((acc, session) => acc + session.duration, 0);
});
</script>