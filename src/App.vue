<template>
  <div class="min-h-screen bg-slate-100 flex flex-col items-center p-4 gap-6">

    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-center">

      <div class="flex gap-2 justify-center mb-4 flex-wrap">
        <button v-for="(preset, index) in presets" :key="index" @click="selectPreset(index)" class="px-3 py-1 rounded-full text-sm border transition" :class="selectedPresetIndex === index ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-gray-100 text-gray-600 border-gray-200'" >
          {{ preset.work }}:{{ preset.shortBreak }}
        </button>
      </div>

      <div class="text-sm text-gray-500 mb-4">
        <span :class="mode === 'work' ? 'text-indigo-600 font-semibold' : ''">Work</span>
        <span class="mx-2">|</span>
        <span :class="mode === 'shortBreak' ? 'text-indigo-600 font-semibold' : ''">Break</span>
      </div>

      <h1 class="text-5xl font-bold text-gray-800 mb-6">
        {{ displayTime }}
      </h1>

      <div class="flex gap-3 justify-center">
        <button @click="toggleTimer" class="px-5 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition">
          {{ isRunning ? 'PAUSE' : 'START' }}
        </button>

        <button @click="resetTimer" class="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition">
          RESET
        </button>
      </div>

    </div>

    <div class="w-full max-w-md">
      <UserStats :history="allSessions" @clear-history="clearHistory" />
    </div>

    <div class="w-full max-w-md">
      <TodoList />
    </div>

  </div>
</template>

<script setup>
import {ref, computed, onUnmounted, onMounted} from 'vue';
import UserStats from "./components/UserStats.vue";
import TodoList from "./components/TodoList.vue";

const presets = [
  {work: 25, shortBreak: 5, longBreak: 15},
  {work: 30, shortBreak: 10, longBreak: 20},
  {work: 50, shortBreak: 10, longBreak: 30}
];

const selectedPresetIndex = ref(0);
const mode = ref('work');
const isRunning = ref(false);
const timeLeft = ref(presets[0].work * 60);
let timerInterval = null;

const displayTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const toggleTimer = () => {
  if (isRunning.value) pauseLogic();
  else startLogic();
};

const startLogic = () => {
  isRunning.value = true;
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      handleTransition();
    }
  }, 1000);
};

const pauseLogic = () => {
  clearInterval(timerInterval);
  timerInterval = null;
  isRunning.value = false;
};

const handleTransition = () => {
  pauseLogic();

  updateStats({
    type: mode.value,
    duration: presets[selectedPresetIndex.value][mode.value],
    timestamp: new Date().toISOString()
  });

  if (mode.value === 'work') {
    mode.value = 'shortBreak';
    alert("Work session done! Starting your break now.");
  } else {
    mode.value = 'work';
    alert("Break is over! Time to focus.");
  }

  timeLeft.value = presets[selectedPresetIndex.value][mode.value] * 60;
  startLogic();
};

const selectPreset = (index) => {
  selectedPresetIndex.value = index;
  resetTimer();
};

const resetTimer = () => {
  pauseLogic();
  mode.value = 'work';
  timeLeft.value = presets[selectedPresetIndex.value].work * 60;
};

onUnmounted(() => pauseLogic());

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
