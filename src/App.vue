<template>
  <router-view />
</template>

<script setup>
import { ref, onMounted, provide } from "vue";
import { supabase } from './supabase';

const user = ref(null);
const allSessions = ref([]);
let isLoadingSessions = false;

provide('user', user);
provide('allSessions', allSessions);


const loadSessions = async () => {
  if (isLoadingSessions) return;
  isLoadingSessions = true;

  const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('created_at', { ascending: false });

  if (!error) allSessions.value = data || [];
  isLoadingSessions = false;
};

onMounted(() => {
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('AUTH EVENT:', event);

    if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
      if (!session) {
        user.value = null;
        return;
      }
      if (user.value?.id === session.user.id) return; // ← already set, skip
      user.value = session.user;
      await loadSessions();

    } else if (event === 'SIGNED_OUT') {
      clearAuth();
    }
  });
});

const clearAuth = () => {
  user.value = null;
  allSessions.value = [];
};
provide('clearAuth', clearAuth);
</script>