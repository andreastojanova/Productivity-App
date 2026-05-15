<template>
  <div class="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">

    <div class="mb-5">
      <p class="text-sm text-gray-500 mb-3">Choose your session type:</p>

      <div class="flex flex-wrap gap-2">
        <button v-for="(preset, index) in presets" :key="index" @click="selectPreset(index)" class="px-3 py-2 rounded-lg text-sm border transition" :class="selectedPresetIndex === index ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-gray-100 text-gray-600 border-gray-200'" >
          {{ preset.work }}/{{ preset.shortBreak }} min
        </button>
      </div>
    </div>

    <div class="flex gap-2 mb-6">
      <button @click="changeMode('work')" class="flex-1 py-2 rounded-lg border text-sm transition" :class="mode === 'work' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-gray-100 text-gray-500'" >
        Work
      </button>

      <button @click="changeMode('shortBreak')" class="flex-1 py-2 rounded-lg border text-sm transition" :class="mode === 'shortBreak' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-gray-100 text-gray-500'" >
        Break
      </button>

      <button @click="changeMode('longBreak')" class="flex-1 py-2 rounded-lg border text-sm transition" :class="mode === 'longBreak' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-gray-100 text-gray-500'">
        Long
      </button>
    </div>

    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-800 mb-2">
        {{ displayTime }}
      </h1>

      <span class="inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-widest" :class="isRunning ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'" >
        {{ isRunning ? 'FOCUSING...' : 'PAUSED' }}
      </span>
    </div>

    <div class="flex gap-3 mt-8">
      <button @click="toggleTimer" class="flex-1 py-3 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition">
        {{ isRunning ? 'PAUSE' : 'START' }}
      </button>

      <button @click="resetTimer" class="flex-1 py-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition">
        RESET
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';

const emit = defineEmits(['session-completed']);

const presets = [
  { work: 25, shortBreak: 5, longBreak: 15 },
  { work: 30, shortBreak: 10, longBreak: 20 },
  { work: 50, shortBreak: 10, longBreak: 30 },
  { work: 5, shortBreak: 1, longBreak: 2 } // За тестирање (брз режим)
];

const selectedPresetIndex = ref(0);
const mode = ref('work');
const isRunning = ref(false);
let timerInterval = null;


const currentDuration = computed(() => {
  const preset = presets[selectedPresetIndex.value];
  return preset[mode.value] * 60;
});

const timeLeft = ref(currentDuration.value);


const displayTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});


const selectPreset = (index) => {
  if (isRunning.value && !confirm("Session in progress. Switch preset?")) return;
  selectedPresetIndex.value = index;
  resetTimer();
};

const changeMode = (newMode) => {
  if (isRunning.value && !confirm("Switch mode and reset timer?")) return;
  mode.value = newMode;
  resetTimer();
};

const toggleTimer = () => {
  if (isRunning.value) {
    pauseTimer();
  } else {
    startTimer();
  }
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
  timeLeft.value = currentDuration.value;
};

const finishSession = () => {
  pauseTimer();
  const alarm = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
  alarm.play().catch(() => {});

  emit('session-completed', {
    type: mode.value,
    duration: currentDuration.value / 60,
    preset: `${presets[selectedPresetIndex.value].work}/${presets[selectedPresetIndex.value].shortBreak}`,
    timestamp: new Date().toISOString()
  });

  alert(`Time is up! ${mode.value.toUpperCase()} session finished.`);
  resetTimer();
};

onUnmounted(() => pauseTimer());
</script>