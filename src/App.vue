<template>
  <div class="pomodoro-wrapper">
    <div class="presets">
      <button
          v-for="(preset, index) in presets"
          :key="index"
          :class="{ active: selectedPresetIndex === index }"
          @click="selectPreset(index)"
      >
        {{ preset.work }}:{{ preset.shortBreak }}
      </button>
    </div>

    <div class="mode-indicator">
      <span :class="{ 'active-mode': mode === 'work' }">Work</span>
      <span> | </span>
      <span :class="{ 'active-mode': mode === 'shortBreak' }">Break</span>
    </div>

    <div class="timer-display">
      <h1>{{ displayTime }}</h1>
    </div>

    <div class="controls">
      <button @click="toggleTimer">
        {{ isRunning ? 'PAUSE' : 'START' }}
      </button>
      <button @click="resetTimer">RESET</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';

const emit = defineEmits(['session-completed']);

const presets = [
  { work: 25, shortBreak: 5, longBreak: 15 },
  { work: 30, shortBreak: 10, longBreak: 20 },
  { work: 50, shortBreak: 10, longBreak: 30 }
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


  emit('session-completed', {
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
</script>

<style scoped>


.pomodoro-wrapper {
  text-align: center;
  font-family: sans-serif;
  padding: 20px;
}
.presets button { margin: 5px; padding: 5px 10px; cursor: pointer; }
.active { background: #333; color: white; }
.active-mode { font-weight: bold; color: #ff4757; text-decoration: underline; }
.timer-display h1 { font-size: 4rem; margin: 20px 0; }
.controls button { padding: 10px 20px; margin: 5px; cursor: pointer; }
</style>