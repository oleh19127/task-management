import { Injectable } from '@nestjs/common';
import { TaskStatus, type ITask } from './task.module';
import { v4 as uuid } from 'uuid';
import type { CreateTaskDto } from './dto/create-task.dto';
import type { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  getAllTasks() {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): ITask[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter((task) => {
        if (
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase())
        ) {
          return true;
        }
        return false;
      });
    }
    return tasks;
  }

  getTaskById(id: string): ITask {
    return this.tasks.find((task) => id === task.id);
  }

  createTask(createTaskDto: CreateTaskDto): ITask {
    const { title, description } = createTaskDto;
    const task: ITask = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  deleteTaskById(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  updateTaskStatus(id: string, status: TaskStatus): ITask {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
