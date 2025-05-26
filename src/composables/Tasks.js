import { ref } from "vue";

// Load tasks from localStorage or initialize empty arrays
const loadTasks = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

let MyTasks = ref(loadTasks('myTasks'));
let FinishedTasks = ref(loadTasks('finishedTasks'));
let DeletedTasks = ref(loadTasks('deletedTasks'));

// Function to save tasks to localStorage
const saveTasks = () => {
  localStorage.setItem('myTasks', JSON.stringify(MyTasks.value));
  localStorage.setItem('finishedTasks', JSON.stringify(FinishedTasks.value));
  localStorage.setItem('deletedTasks', JSON.stringify(DeletedTasks.value));
};

export { MyTasks, FinishedTasks, DeletedTasks, saveTasks };