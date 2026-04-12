<template>
  <div>
    <Navbar v-if="!isAuthPage" />
    <router-view />
    <Footer v-if="!isAuthPage" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
const isAuthPage = computed(() => ['/login', '/register'].includes(route.path))
</script>
