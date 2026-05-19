<template>
  <div
      class="w-full h-full bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-8 text-center"
  >
    <!-- PRESETS -->
    <div class="flex gap-3 justify-center mb-6 flex-wrap">
      <button
          v-for="(preset, index) in presets"
          :key="index"
          @click="selectPreset(index)"
          class="px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300"
          :class="
          selectedPresetIndex === index
            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200'
            : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
        "
      >
        {{ preset.label }}
      </button>
    </div>

    <!-- MODE -->
    <div class="flex justify-center gap-4 text-sm mb-8">
      <span :class="mode === 'work' ? 'text-indigo-600 font-semibold' : 'text-slate-400'">
        Focus
      </span>
      <span class="text-slate-300">•</span>
      <span :class="mode === 'shortBreak' ? 'text-emerald-500 font-semibold' : 'text-slate-400'">
        Break
      </span>
    </div>

    <!-- TIMER -->
    <div class="mb-8">
      <div class="text-7xl font-bold tracking-tight text-slate-800 mb-3">
        {{ displayTime }}
      </div>
      <div
          class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
          :class="isRunning ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'"
      >
        {{ isRunning ? 'Currently focusing...' : 'Ready to focus' }}
      </div>
    </div>

    <!-- BUTTONS -->
    <div class="flex gap-4 justify-center">
      <button
          @click="toggleTimer"
          class="px-8 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-indigo-200"
      >
        {{ isRunning ? 'PAUSE' : 'START' }}
      </button>
      <button
          @click="resetTimer"
          class="px-8 py-4 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition-all duration-300"
      >
        RESET
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';

const emit = defineEmits(['session-completed']);

const presets = [
  { label: "🍅 Classic",   work: 25, shortBreak: 5  },
  { label: "⚡ Deep Work", work: 50, shortBreak: 10 },
  { label: "📚 Study",     work: 30, shortBreak: 10 },
];

const selectedPresetIndex = ref(0);
const mode = ref('work');
const isRunning = ref(false);
const timeLeft = ref(3); // TODO: revert to presets[0].work * 60
let timerInterval = null;

const displayTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const toggleTimer = () => {
  if (isRunning.value) pauseTimer();
  else startTimer();
};

const startTimer = () => {
  isRunning.value = true;
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      finishSession();
    }
  }, 1000);
};

const pauseTimer = () => {
  clearInterval(timerInterval);
  timerInterval = null;
  isRunning.value = false;
};

const resetTimer = () => {
  pauseTimer();
  mode.value = 'work';
  timeLeft.value = presets[selectedPresetIndex.value].work * 60;
};

const finishSession = () => {
  pauseTimer();

  emit('session-completed', {
    type: mode.value,
    duration: presets[selectedPresetIndex.value][mode.value],
    timestamp: new Date().toISOString()
  });

  if (mode.value === 'work') {
    mode.value = 'shortBreak';
    alert("Focus session completed! ☕");
  } else {
    mode.value = 'work';
    alert("Break finished! 🍅");
  }

  timeLeft.value = 5; // TODO: revert to presets[selectedPresetIndex.value][mode.value] * 60
  startTimer();
};

const selectPreset = (index) => {
  selectedPresetIndex.value = index;
  resetTimer();
};

onUnmounted(() => pauseTimer());
</script>