ToDoList.vue

<template>
  <div
      class="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-6"
  >
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-2xl font-bold text-slate-800">
        Tasks
      </h2>

      <span class="text-sm text-slate-400">
        {{ tasks.length }} tasks
      </span>
    </div>

    <!-- INPUT -->
    <div class="flex gap-3 mb-5">

      <input
          v-model="text"
          @keyup.enter="add"
          placeholder="What are you working on?"
          class="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />

      <button
          @click="add"
          class="px-5 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-all duration-300 hover:scale-105"
      >
        Add
      </button>
    </div>

    <!-- EMPTY -->
    <div
        v-if="tasks.length === 0"
        class="text-center py-10 text-slate-400"
    >
      No tasks yet ✨
    </div>

    <!-- TASKS -->
    <div class="space-y-3">

      <div
          v-for="task in tasks"
          :key="task.id"
          class="flex items-center justify-between bg-slate-50 hover:bg-white border border-slate-100 rounded-2xl p-4 transition-all duration-300 hover:shadow-md"
      >

        <label class="flex items-center gap-3 cursor-pointer flex-1">

          <input
              type="checkbox"
              v-model="task.done"
              class="accent-indigo-500 w-4 h-4"
          />

          <span
              :class="
              task.done
                ? 'line-through text-slate-400'
                : 'text-slate-700'
            "
          >
            {{ task.text }}
          </span>
        </label>

        <button
            @click="remove(task.id)"
            class="text-red-400 hover:text-red-600 text-xl px-2"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const text = ref("");

const tasks = ref([]);

const add = () => {
  if (!text.value.trim()) return;

  tasks.value.push({
    id: Date.now(),
    text: text.value,
    done: false,
  });

  text.value = "";
};

const remove = (id) => {
  tasks.value = tasks.value.filter(
      (task) => task.id !== id
  );
};
</script>