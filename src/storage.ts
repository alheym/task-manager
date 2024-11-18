import { Task } from "./types";

const STORAGE_KEY = "tasks";

export class TaskStorage {
  static saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  static loadTasks(): Task[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data) as Task[];
    } catch {
      console.error("Ошибка загрузки данных");
      return [];
    }
  }
}
