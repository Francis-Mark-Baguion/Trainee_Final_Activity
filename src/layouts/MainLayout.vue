<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> To-do Application </q-toolbar-title>

        <img src="../assets/to-do-list.png" alt="A description of my image" height="40" width="40" class="q-ml-md" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'My Tasks',
    caption: 'List of unfinished tasks',
    icon: 'task',
    route_name: 'my-tasks',
  },
  {
    title: 'Finished Tasks',
    caption: 'List of finished tasks',
    icon: 'check_circle_outline',
    route_name: 'finished-tasks',
  },
  {
    title: 'Deleted Tasks',
    caption: 'List of deleted tasks',
    icon: 'delete_outline',
    route_name: 'deleted-tasks',
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>