import { TaskManager } from "./taskManager.js";
const taskManager = new TaskManager();
// DOM элементы
const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks");
const typeSelect = document.getElementById("type");
const extraField = document.getElementById("extra-field");
const statusFilter = document.getElementById("status-filter");
const typeFilter = document.getElementById("type-filter");
// Обновление списка задач
function renderTasks(tasks) {
    tasksContainer.innerHTML = "";
    tasks.forEach((task) => {
        const taskElement = document.createElement("div");
        taskElement.className = "task";
        taskElement.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description || "Нет описания"}</p>
      <p>Статус: ${task.status}</p>
      <p>Тип: ${task.type}</p>
      ${"deadline" in task
            ? `<p>Дедлайн: ${new Date(task.deadline).toLocaleDateString()}</p>`
            : ""}
      ${"assignee" in task
            ? `<p>Ответственный: ${task.assignee}</p>`
            : ""}
      ${"location" in task
            ? `<p>Место проведения: ${task.location}</p>`
            : ""}
       <button data-id="${task.id}" class="delete-task">Удалить</button>
      ${task.status !== "completed"
            ? `<button data-id="${task.id}" class="complete-task">Завершить</button>`
            : ""}
    `;
        tasksContainer.appendChild(taskElement);
    });
    // Обработчик удаления задач
    document.querySelectorAll(".delete-task").forEach((button) => {
        button.addEventListener("click", (event) => {
            const taskId = event.target.dataset.id;
            if (taskId) {
                taskManager.removeTask(taskId);
                renderTasks(taskManager.getTasks());
            }
        });
    });
    // Обработчик завершения задачи
    document.querySelectorAll(".complete-task").forEach((button) => {
        button.addEventListener("click", (event) => {
            const taskId = event.target.dataset.id;
            if (taskId) {
                const task = taskManager.getTaskById(taskId);
                if (task) {
                    task.status = "completed";
                    taskManager.updateTask(task);
                    renderTasks(taskManager.getTasks());
                }
            }
        });
    });
}
// Обновление дополнительных полей
typeSelect.addEventListener("change", () => {
    const type = typeSelect.value;
    extraField.innerHTML = "";
    if (type === "deadline") {
        extraField.innerHTML = `<label>Дедлайн: <input type="date" id="extra" /></label>`;
    }
    else if (type === "assigned") {
        extraField.innerHTML = `<label>Ответственный: <input type="text" id="extra" /></label>`;
    }
    else if (type === "location") {
        extraField.innerHTML = `<label>Место проведения: <input type="text" id="extra" /></label>`;
    }
});
// Обработчик формы
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const type = typeSelect.value;
    const extraInput = document.getElementById("extra");
    const task = Object.assign(Object.assign(Object.assign({ id: Date.now().toString(), title,
        description, createdAt: new Date(), status: "pending", type }, (type === "deadline" && { deadline: new Date(extraInput.value) })), (type === "assigned" && { assignee: extraInput.value })), (type === "location" && { location: extraInput.value }));
    taskManager.addTask(task);
    renderTasks(taskManager.getTasks());
    taskForm.reset();
    extraField.innerHTML = "";
});
// Фильтры
function applyFilters() {
    let filteredTasks = taskManager.getTasks();
    const status = statusFilter.value;
    if (status !== "all") {
        filteredTasks = taskManager.filterByStatus(status);
    }
    const type = typeFilter.value;
    if (type !== "all") {
        filteredTasks = taskManager.filterByType(type);
    }
    renderTasks(filteredTasks);
}
statusFilter.addEventListener("change", applyFilters);
typeFilter.addEventListener("change", applyFilters);
// Начальная загрузка
renderTasks(taskManager.getTasks());
