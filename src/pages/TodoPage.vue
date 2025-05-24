<template>
  <q-page class="q-pa-md" :style="{ background: '#e8f0fe', minHeight: '100vh' }">
    <q-form @submit.prevent="addTask" class="q-mb-md row items-center q-gutter-sm">
  <q-input 
    v-model="newTask.title" 
    label="Task Name" 
    filled 
    class="col-grow"
  />
  <q-btn 
    label="Add Task" 
    type="submit" 
    color="primary" 
  />
</q-form>


    <div class="column q-gutter-md">
      <q-card 
        class="my-card" 
        v-for="task in tasks" 
        :key="task.id"
        style="backdrop-filter: blur(10px); background: '#00000'"
      >
        <q-card-section class="row items-center q-pa-sm">
          <q-input 
            v-model="task.title" 
            dense 
            filled 
            class="col-grow q-mr-sm"
            dark
          />
          <div class="row q-gutter-sm">
            <q-btn 
              flat 
              color="primary" 
              label="Update" 
              @click="updateTask(task)" 
            />
            <q-btn 
              flat 
              color="red" 
              label="Delete" 
              @click="deleteTask(task.id)" 
            />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';

const tasks = ref([]);
const newTask = ref({ title: '', completed: false, userId: 1 });

const fetchTasks = async () => {
  try {
    const response = await api.get('/todos?_limit=10');
    tasks.value = response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

const addTask = async () => {
  if (!newTask.value.title.trim()) return;
  
  try {
    const response = await api.post('/todos', {
      title: newTask.value.title,
      completed: false,
      userId: 1
    });
    
    const tempTask = {
      ...response.data,
      id: Date.now()
    };
    
    tasks.value.unshift(tempTask);
    newTask.value.title = '';
  } catch (error) {
    console.error('Error adding task:', error);
  }
};
const updateTask = async (task) => {
  try {
    await api.put(`/todos/${task.id}`, task);
  } catch (error) {
    console.error('Error updating task:', error);
  }
};
const deleteTask = async (id) => {
  try {
    await api.delete(`/todos/${id}`);
    tasks.value = tasks.value.filter(task => task.id !== id);
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

onMounted(fetchTasks);
</script>

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