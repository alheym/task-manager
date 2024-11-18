const STORAGE_KEY = "tasks";
export class TaskStorage {
    static saveTasks(tasks) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
    static loadTasks() {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data)
            return [];
        try {
            return JSON.parse(data);
        }
        catch (_a) {
            console.error("Ошибка загрузки данных");
            return [];
        }
    }
}
