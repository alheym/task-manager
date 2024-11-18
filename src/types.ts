export type TaskStatus = "pending" | "completed";

export type TaskType = "general" | "deadline" | "assigned" | "location";

export interface BaseTask {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  status: TaskStatus;
  type: TaskType;
}

export interface DeadlineTask extends BaseTask {
  type: "deadline";
  deadline: Date;
}

export interface AssignedTask extends BaseTask {
  type: "assigned"
  assignee: string; // Ответственное лицо
}

export interface LocationTask extends BaseTask {
  type: "location";
  location: string; // Место проведения
}

export type Task = BaseTask | DeadlineTask | AssignedTask | LocationTask;
