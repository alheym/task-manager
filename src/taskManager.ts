import { Task, TaskStatus, TaskType } from "./types";
import { TaskStorage } from "./storage";

export class TaskManager {
  private tasks: Task[] = [];

  constructor() {
    this.tasks = TaskStorage.loadTasks();
  }

  addTask(task: Task): void {
    this.tasks.push(task);
    this.save();
  }

  removeTask(taskId: string): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.save();
  }

  updateTask(updatedTask: Task): void {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.save();
    }
  }

  getTaskById(taskId: string): Task | undefined {
    return this.tasks.find(task => task.id === taskId);
  }

  filterByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  filterByType(type: TaskType): Task[] {
    return this.tasks.filter(task => "type" in task && task.type === type);
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  private save(): void {
    TaskStorage.saveTasks(this.tasks);
  }
}
