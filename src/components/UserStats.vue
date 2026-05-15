<template>
  <div class="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-5">

    <h2 class="text-center text-lg font-semibold text-gray-700 mb-4 uppercase tracking-wider">
      Session Stats
    </h2>

    <div class="grid grid-cols-2 gap-3 mb-5">

      <div class="bg-gray-50 border rounded-xl p-4 text-center">
        <div class="text-2xl font-bold text-indigo-500">{{ totalSessions }}</div>
        <div class="text-xs text-gray-400 mt-1">Total Sessions</div>
      </div>

      <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-center">
        <div class="text-2xl font-bold text-indigo-600">{{ workSessions }}</div>
        <div class="text-xs text-gray-400 mt-1">Work Sessions</div>
      </div>

      <div class="bg-gray-50 border rounded-xl p-4 text-center">
        <div class="text-2xl font-bold text-emerald-500">{{ breakSessions }}</div>
        <div class="text-xs text-gray-400 mt-1">Breaks</div>
      </div>

      <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-center">
        <div class="text-2xl font-bold text-indigo-600">
          {{ totalFocusMinutes }}<span class="text-sm font-normal">m</span>
        </div>
        <div class="text-xs text-gray-400 mt-1">Focus Time</div>
      </div>

    </div>

    <div class="flex gap-2 mb-4">
      <button @click="filter = 'today'" class="flex-1 py-2 rounded-lg text-sm transition" :class="filter === 'today' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600'" >
        Today
      </button>

      <button @click="filter = 'all'" class="flex-1 py-2 rounded-lg text-sm transition" :class="filter === 'all' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600'" >
        All Time
      </button>
    </div>

    <div class="bg-gray-50 border rounded-xl p-4 mb-5 space-y-3">

      <div class="flex justify-between text-sm">
        <span class="text-gray-500">Work sessions</span>
        <strong class="text-indigo-500">{{ filteredWorkSessions }}</strong>
      </div>

      <div class="flex justify-between text-sm">
        <span class="text-gray-500">Break sessions</span>
        <strong class="text-emerald-500">{{ filteredBreakSessions }}</strong>
      </div>

      <div class="flex justify-between text-sm">
        <span class="text-gray-500">Focus time</span>
        <strong class="text-indigo-500">{{ filteredFocusMinutes }} min</strong>
      </div>

    </div>

    <div>
      <h3 class="text-xs uppercase tracking-wider text-gray-400 mb-3">
        Recent Sessions
      </h3>

      <div v-if="history.length === 0" class="text-center text-gray-400 text-sm py-4">
        No sessions yet. Start your first Pomodoro!
      </div>

      <ul v-else class="space-y-2">

        <li v-for="(session, index) in recentHistory" :key="index" class="flex items-center justify-between p-3 rounded-xl border bg-gray-50" :class="session.type === 'work' ? 'border-indigo-100' : 'border-emerald-100'" >

          <div class="flex items-center gap-2">
            <span class="text-lg">
              {{ session.type === 'work' ? '🍅' : '☕' }}
            </span>

            <span class="text-sm font-medium text-gray-700">
              {{ session.type === 'work' ? 'Work' : 'Break' }}
            </span>
          </div>

          <div class="text-xs text-gray-400">
            {{ session.duration }}m · {{ formatTime(session.timestamp) }}
          </div>

        </li>

      </ul>
    </div>

    <button v-if="history.length > 0" class="w-full mt-5 py-2 rounded-lg border text-sm text-gray-500 hover:text-indigo-500 hover:border-indigo-300 transition" @click="$emit('clear-history')" >
      Clear History
    </button>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  history: {
    type: Array,
    default: () => []
  }
});

defineEmits(['clear-history']);

const filter = ref('today');

// --- All-time stats ---
const totalSessions = computed(() => props.history.length);

const workSessions = computed(() =>
    props.history.filter(s => s.type === 'work').length
);

const breakSessions = computed(() =>
    props.history.filter(s => s.type === 'shortBreak').length
);

const totalFocusMinutes = computed(() =>
    props.history
        .filter(s => s.type === 'work')
        .reduce((sum, s) => sum + (s.duration || 0), 0)
);

// --- Filtered stats (today vs all time) ---
const isToday = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
  );
};

const filteredHistory = computed(() =>
    filter.value === 'today'
        ? props.history.filter(s => isToday(s.timestamp))
        : props.history
);

const filteredWorkSessions = computed(() =>
    filteredHistory.value.filter(s => s.type === 'work').length
);

const filteredBreakSessions = computed(() =>
    filteredHistory.value.filter(s => s.type === 'shortBreak').length
);

const filteredFocusMinutes = computed(() =>
    filteredHistory.value
        .filter(s => s.type === 'work')
        .reduce((sum, s) => sum + (s.duration || 0), 0)
);

// --- Recent 10 sessions for history list ---
const recentHistory = computed(() => props.history.slice(0, 10));

// --- Helpers ---
const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
</script>