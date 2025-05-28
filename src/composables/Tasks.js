import { ref } from 'vue'
import { LocalStorage } from 'quasar'

const loadTasks = (key) => {
  const data = LocalStorage.getItem(key)
  return (Array.isArray(data) ? data : []).filter(task => 
    task && typeof task === 'object' && task.id && task.todo
  )
}
let MyTasks = ref(loadTasks('myTasks'))
let FinishedTasks = ref(loadTasks('finishedTasks'))
let DeletedTasks = ref(loadTasks('deletedTasks'))

const saveTasks = () => {
  const validTasks = (tasks) => tasks.filter(task => 
    task && typeof task === 'object' && task.id && task.todo
  )
  
  LocalStorage.set('myTasks', validTasks(MyTasks.value))
  LocalStorage.set('finishedTasks', validTasks(FinishedTasks.value))
  LocalStorage.set('deletedTasks', validTasks(DeletedTasks.value))
}

export { MyTasks, FinishedTasks, DeletedTasks, saveTasks }