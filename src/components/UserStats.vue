<template>
  <div class="stats-container">
    <h2 class="stats-title">Session Stats</h2>

    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="stat-card">
        <span class="stat-value">{{ totalSessions }}</span>
        <span class="stat-label">Total Sessions</span>
      </div>
      <div class="stat-card accent">
        <span class="stat-value">{{ workSessions }}</span>
        <span class="stat-label">Work Sessions</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ breakSessions }}</span>
        <span class="stat-label">Breaks Taken</span>
      </div>
      <div class="stat-card accent">
        <span class="stat-value">{{ totalFocusMinutes }}<small>m</small></span>
        <span class="stat-label">Focus Time</span>
      </div>
    </div>

    <!-- Today vs All Time Toggle -->
    <div class="filter-tabs">
      <button :class="{ active: filter === 'today' }" @click="filter = 'today'">Today</button>
      <button :class="{ active: filter === 'all' }" @click="filter = 'all'">All Time</button>
    </div>

    <!-- Filtered Stats -->
    <div class="filtered-stats">
      <div class="filtered-row">
        <span>Work sessions</span>
        <strong>{{ filteredWorkSessions }}</strong>
      </div>
      <div class="filtered-row">
        <span>Break sessions</span>
        <strong>{{ filteredBreakSessions }}</strong>
      </div>
      <div class="filtered-row">
        <span>Focus time</span>
        <strong>{{ filteredFocusMinutes }} min</strong>
      </div>
    </div>

    <!-- Session History -->
    <div class="history-section">
      <h3>Recent Sessions</h3>
      <div v-if="history.length === 0" class="empty-state">
        No sessions yet. Start your first Pomodoro!
      </div>
      <ul v-else class="history-list">
        <li
            v-for="(session, index) in recentHistory"
            :key="index"
            :class="['history-item', session.type === 'work' ? 'work' : 'break']"
        >
          <span class="session-badge">{{ session.type === 'work' ? '🍅' : '☕' }}</span>
          <span class="session-type">{{ session.type === 'work' ? 'Work' : 'Break' }}</span>
          <span class="session-duration">{{ session.duration }} min</span>
          <span class="session-time">{{ formatTime(session.timestamp) }}</span>
        </li>
      </ul>
    </div>

    <!-- Clear History -->
    <button v-if="history.length > 0" class="clear-btn" @click="$emit('clear-history')">
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

<style scoped>
.stats-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 480px;
  margin: 0 auto;
  padding: 20px;
  background: #1a1a2e;
  border-radius: 16px;
  color: #eee;
}

.stats-title {
  text-align: center;
  font-size: 1.4rem;
  margin-bottom: 16px;
  color: #ff4757;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* Summary Cards */
.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: #16213e;
  border-radius: 12px;
  padding: 16px 12px;
  text-align: center;
  border: 1px solid #0f3460;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-card.accent {
  background: #0f3460;
  border-color: #ff4757;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #ff4757;
  line-height: 1;
}

.stat-value small {
  font-size: 1rem;
  font-weight: 400;
}

.stat-label {
  font-size: 0.75rem;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
  border: 1px solid #0f3460;
}

.filter-tabs button {
  flex: 1;
  padding: 8px;
  background: #16213e;
  color: #aaa;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.filter-tabs button.active {
  background: #ff4757;
  color: white;
  font-weight: 600;
}

/* Filtered Stats */
.filtered-stats {
  background: #16213e;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 20px;
  border: 1px solid #0f3460;
}

.filtered-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 0.9rem;
  color: #ccc;
  border-bottom: 1px solid #0f3460;
}

.filtered-row:last-child {
  border-bottom: none;
}

.filtered-row strong {
  color: #ff4757;
}

/* History Section */
.history-section h3 {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #aaa;
  margin-bottom: 10px;
}

.empty-state {
  text-align: center;
  color: #555;
  font-size: 0.9rem;
  padding: 20px 0;
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
}

.history-item.work {
  background: rgba(255, 71, 87, 0.1);
  border-left: 3px solid #ff4757;
}

.history-item.break {
  background: rgba(46, 213, 115, 0.1);
  border-left: 3px solid #2ed573;
}

.session-badge { font-size: 1rem; }

.session-type {
  flex: 1;
  font-weight: 600;
  color: #eee;
}

.session-duration {
  color: #aaa;
  font-size: 0.8rem;
}

.session-time {
  color: #666;
  font-size: 0.75rem;
  min-width: 48px;
  text-align: right;
}

/* Clear button */
.clear-btn {
  display: block;
  width: 100%;
  margin-top: 16px;
  padding: 8px;
  background: transparent;
  border: 1px solid #333;
  border-radius: 8px;
  color: #555;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.clear-btn:hover {
  border-color: #ff4757;
  color: #ff4757;
}
</style>