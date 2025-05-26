<script setup>
import { ref, onMounted } from 'vue'
import { MyTasks, FinishedTasks, DeletedTasks, saveTasks } from '../composables/Tasks'
import axios from 'axios'

let text = ref('')
let form = ref(null)
let selectedTodo = ref(null)
let showDialog = ref(false)
let toMarkAsDone = ref(null)
let toDelete = ref(null)

const fetchTasks = async () => {
  if (MyTasks.value.length === 0) {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_start=10&_limit=10')
      MyTasks.value = response.data.map((todo) => ({ id: todo.id, todo: todo.title }))
      saveTasks()
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }
}

onMounted(fetchTasks)

const addTodo = async () => {
  if (!text.value.trim()) return
  try {
    // For demo purposes, we'll just create a local task
    const newTask = { id: Date.now(), todo: text.value.trim() }
    MyTasks.value.unshift(newTask)
    text.value = ''
    form.value.reset()
    saveTasks()
  } catch (error) {
    console.error('Error adding task:', error)
  }
}

const selectTodo = (task) => {
  selectedTodo.value = task
  text.value = task.todo
}

const updateTodo = async () => {
  if (!text.value.trim()) {
    // Don't allow empty updates - you could also delete the task here if you prefer
    return
  }
  
  try {
    const index = MyTasks.value.findIndex((t) => t.id === selectedTodo.value.id)
    if (index !== -1) {
      // Update the local task directly (since JSONPlaceholder won't actually update)
      MyTasks.value[index].todo = text.value.trim()
      saveTasks()
    }
    text.value = ''
    selectedTodo.value = null
    form.value.reset()
  } catch (error) {
    console.error('Error updating task:', error)
  }
}

const toggleDialog = (row, status) => {
  showDialog.value = true
  toMarkAsDone.value = toDelete.value = null
  status !== 'delete' ? (toMarkAsDone.value = row) : (toDelete.value = row)
}

const markAsDone = () => {
  const index = MyTasks.value.findIndex((t) => t.id === toMarkAsDone.value.id)
  if (index !== -1) {
    FinishedTasks.value.push(MyTasks.value[index])
    MyTasks.value.splice(index, 1)
    saveTasks()
  }
  toMarkAsDone.value = null
  showDialog.value = false
}

const removeTodo = async () => {
  try {
    const index = MyTasks.value.findIndex((t) => t.id === toDelete.value.id)
    if (index !== -1) {
      const deletedTask = MyTasks.value.splice(index, 1)[0]
      DeletedTasks.value.push(deletedTask)
      saveTasks()
    }
    toDelete.value = null
    showDialog.value = false
  } catch (error) {
    console.error('Delete failed:', error)
  }
}
</script>

<template>
  <q-page class="q-pa-md" :style="{ background: '#e8f0fe', minHeight: '100vh' }">
    <q-form ref="form" @submit.prevent="!selectedTodo ? addTodo() : updateTodo()" class="q-mb-md row items-center q-gutter-sm">
      <q-input
        v-model="text"
        label="Task Name"
        filled
        class="col-grow"
        :rules="[(val) => !!val.trim() || 'Field is required']"
      />
      <q-btn
        :label="!selectedTodo ? 'Add Task' : 'Update Task'"
        type="submit"
        color="primary"
      />
      <q-btn
        v-if="selectedTodo"
        label="Cancel"
        color="negative"
        @click="selectedTodo = null; text = ''; form.reset()"
      />
    </q-form>

    <div class="column q-gutter-md">
      <q-card
        class="my-card"
        v-for="task in MyTasks"
        :key="task.id"
        @click="selectTodo(task)"
        style="backdrop-filter: blur(10px); background: rgba(255,255,255,0.6);"
      >
        <q-card-section class="row items-center q-pa-sm">
          <q-input
            v-model="task.todo"
            dense
            filled
            class="col-grow q-mr-sm"
            dark
            readonly
          />
          <div class="row q-gutter-sm">
            <q-btn
              flat
              color="green"
              label="Done"
              @click.stop="toggleDialog(task, 'mark-done')"
            />
            <q-btn
              flat
              color="red"
              label="Delete"
              @click.stop="toggleDialog(task, 'delete')"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="showDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div v-if="toMarkAsDone" class="q-ml-sm">
            Are you sure you want to mark <span class="text-green">"{{ toMarkAsDone.todo }}"</span> as done?
          </div>
          <div v-else class="q-ml-sm">
            Are you sure you want to delete <span class="text-red">"{{ toDelete.todo }}"</span>?
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            @click="toMarkAsDone ? markAsDone() : removeTodo()"
            flat
            label="Yes"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style scoped>
.my-card {
  transition: transform 0.2s;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #222;
  background: rgba(255, 255, 255, 0.6);
}
.my-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.75) !important;
}
.q-field--filled .q-field__control {
  background: rgba(255, 255, 255, 0.6);
  color: #222;
}
:deep(.q-field__native) {
  color: #222 !important;
}
</style>