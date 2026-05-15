<template>
  <div class="w-full bg-white rounded-2xl shadow-md p-5">

    <h3 class="text-lg font-semibold text-gray-800 mb-4">
      Tasks
    </h3>

    <div class="flex gap-2 mb-4">
      <input v-model="text" @keyup.enter="add" placeholder="Add task..." class="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"/>

      <button @click="add" class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">
        +
      </button>
    </div>

    <div v-if="tasks.length === 0" class="text-center text-gray-400 py-4">
      No tasks yet
    </div>

    <ul class="space-y-2">
      <li v-for="t in tasks" :key="t.id" class="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">

        <label class="flex items-center gap-2 flex-1 cursor-pointer">

          <input type="checkbox" v-model="t.done" class="accent-indigo-500" />

          <span :class="t.done ? 'line-through text-gray-400' : 'text-gray-700'" class="text-sm" >
            {{ t.text }}
          </span>

        </label>

        <button @click="remove(t.id)" class="text-red-400 hover:text-red-600 text-lg px-2">
          ✕
        </button>

      </li>
    </ul>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const tasks = ref([])
const text = ref('')

const add = () => {
  if (!text.value.trim()) return

  tasks.value.unshift({
    id: Date.now(),
    text: text.value,
    done: false
  })

  text.value = ''
}

const remove = (id) => {
  tasks.value = tasks.value.filter(t => t.id !== id)
}
</script>
