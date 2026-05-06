<template>
  <div class="pomodoro-card">
    <div class="preset-selector">
      <p>Choose your session type:</p>
      <button
          v-for="(preset, index) in presets"
          :key="index"
          :class="['preset-btn', { active: selectedPresetIndex === index }]"
          @click="selectPreset(index)"
      >
        {{ preset.work }}/{{ preset.shortBreak }} min
      </button>
    </div>

    <hr />

    <div class="mode-buttons">
      <button
          :class="['mode-btn', { active: mode === 'work' }]"
          @click="changeMode('work')"
      >
        Work
      </button>
      <button
          :class="['mode-btn', { active: mode === 'shortBreak' }]"
          @click="changeMode('shortBreak')"
      >
        Short Break
      </button>
      <button
          :class="['mode-btn', { active: mode === 'longBreak' }]"
          @click="changeMode('longBreak')"
      >
        Long Break
      </button>
    </div>

    <div class="timer-display">
      <div class="time-text">{{ displayTime }}</div>
      <div class="status-badge">{{ isRunning ? 'FOCUSING...' : 'PAUSED' }}</div>
    </div>

    <div class="controls">
      <button class="btn-primary" @click="toggleTimer">
        {{ isRunning ? 'PAUSE' : 'START' }}
      </button>
      <button class="btn-secondary" @click="resetTimer">
        RESET
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';

const emit = defineEmits(['session-completed']);

// Листа на можни конфигурации (Presets)
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

// Пресметување на секунди врз основа на избраниот Preset и Режим
const currentDuration = computed(() => {
  const preset = presets[selectedPresetIndex.value];
  return preset[mode.value] * 60;
});

const timeLeft = ref(currentDuration.value);

// Форматирање (MM:SS)
const displayTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// Функција за избор на сет (25/5, 30/10 итн.)
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

<style scoped>
.pomodoro-card {
  text-align: center;
  padding: 2rem;
  border-radius: 20px;
  background: white;
  color: #333;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.preset-selector {
  margin-bottom: 20px;
}

.preset-btn {
  margin: 5px;
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  background: transparent;
}

.preset-btn.active {
  background: #333;
  color: white;
  border-color: #333;
}

.mode-buttons {
  margin: 20px 0;
}

.mode-btn {
  padding: 10px 20px;
  border: none;
  background: #eee;
  cursor: pointer;
  margin: 0 5px;
  border-radius: 5px;
}

.mode-btn.active {
  background: #ff5f5f;
  color: white;
}

.time-text {
  font-size: 5rem;
  font-weight: bold;
}

.btn-primary {
  padding: 15px 40px;
  font-size: 1.2rem;
  background: #ff5f5f;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-right: 10px;
}

.btn-secondary {
  padding: 15px 20px;
  background: #ccc;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
</style>