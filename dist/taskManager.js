import { TaskStorage } from "./storage.js";
export class TaskManager {
    constructor() {
        this.tasks = [];
        this.tasks = TaskStorage.loadTasks();
    }
    addTask(task) {
        this.tasks.push(task);
        this.save();
    }
    removeTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.save();
    }
    updateTask(updatedTask) {
        const index = this.tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
            this.tasks[index] = updatedTask;
            this.save();
        }
    }
    getTaskById(taskId) {
        return this.tasks.find(task => task.id === taskId);
    }
    filterByStatus(status) {
        return this.tasks.filter(task => task.status === status);
    }
    filterByType(type) {
        return this.tasks.filter(task => "type" in task && task.type === type);
    }
    getTasks() {
        return this.tasks;
    }
    save() {
        TaskStorage.saveTasks(this.tasks);
    }
}
