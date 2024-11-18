import { TaskManager } from "./taskManager";
import { Task, TaskStatus, TaskType } from "./types";

const taskManager = new TaskManager();

// DOM элементы
const taskForm = document.getElementById("task-form") as HTMLFormElement;
const tasksContainer = document.getElementById("tasks") as HTMLElement;
const typeSelect = document.getElementById("type") as HTMLSelectElement;
const extraField = document.getElementById("extra-field") as HTMLElement;
const statusFilter = document.getElementById("status-filter") as HTMLSelectElement;
const typeFilter = document.getElementById("type-filter") as HTMLSelectElement;

// Обновление списка задач
function renderTasks(tasks: Task[]): void {
  tasksContainer.innerHTML = "";
  tasks.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.className = "task";
    taskElement.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description || "Нет описания"}</p>
      <p>Статус: ${task.status}</p>
      <p>Тип: ${task.type}</p>
      ${
        "deadline" in task
          ? `<p>Дедлайн: ${new Date(task.deadline).toLocaleDateString()}</p>`
          : ""
      }
      ${
        "assignee" in task
          ? `<p>Ответственный: ${task.assignee}</p>`
          : ""
      }
      ${
        "location" in task
          ? `<p>Место проведения: ${task.location}</p>`
          : ""
      }
       <button data-id="${task.id}" class="delete-task">Удалить</button>
      ${
        task.status !== "completed"
          ? `<button data-id="${task.id}" class="complete-task">Завершить</button>`
          : ""
      }
    `;
    tasksContainer.appendChild(taskElement);
  });

  // Обработчик удаления задач
  document.querySelectorAll(".delete-task").forEach((button) => {
    button.addEventListener("click", (event) => {
      const taskId = (event.target as HTMLButtonElement).dataset.id;
      if (taskId) {
        taskManager.removeTask(taskId);
        renderTasks(taskManager.getTasks());
      }
    });
  });

  
// Обработчик завершения задачи
document.querySelectorAll(".complete-task").forEach((button) => {
    button.addEventListener("click", (event) => {
      const taskId = (event.target as HTMLButtonElement).dataset.id;
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
  const type = typeSelect.value as TaskType;
  extraField.innerHTML = "";
  if (type === "deadline") {
    extraField.innerHTML = `<label>Дедлайн: <input type="date" id="extra" /></label>`;
  } else if (type === "assigned") {
    extraField.innerHTML = `<label>Ответственный: <input type="text" id="extra" /></label>`;
  } else if (type === "location") {
    extraField.innerHTML = `<label>Место проведения: <input type="text" id="extra" /></label>`;
  }
});

// Обработчик формы
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = (document.getElementById("title") as HTMLInputElement).value;
  const description = (document.getElementById("description") as HTMLInputElement).value;
  const type = typeSelect.value as TaskType;
  const extraInput = document.getElementById("extra") as HTMLInputElement;

  const task: Task = {
    id: Date.now().toString(),
    title,
    description,
    createdAt: new Date(),
    status: "pending",
    type,
    ...(type === "deadline" && { deadline: new Date(extraInput.value) }),
    ...(type === "assigned" && { assignee: extraInput.value }),
    ...(type === "location" && { location: extraInput.value }),
  };

  taskManager.addTask(task);
  renderTasks(taskManager.getTasks());
  taskForm.reset();
  extraField.innerHTML = "";
});

// Фильтры
function applyFilters(): void {
  let filteredTasks = taskManager.getTasks();

  const status = statusFilter.value as TaskStatus | "all";
  if (status !== "all") {
    filteredTasks = taskManager.filterByStatus(status as TaskStatus);
  }

  const type = typeFilter.value as TaskType | "all";
  if (type !== "all") {
    filteredTasks = taskManager.filterByType(type as TaskType);
  }

  renderTasks(filteredTasks);
}

statusFilter.addEventListener("change", applyFilters);
typeFilter.addEventListener("change", applyFilters);

// Начальная загрузка
renderTasks(taskManager.getTasks());
