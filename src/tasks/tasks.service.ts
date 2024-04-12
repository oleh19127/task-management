import { Injectable } from '@nestjs/common';
import { TaskStatus, type ITask } from './task.module';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  getAllTasks() {
    return this.tasks;
  }

  createTask(
    title: string,
    description: string,
    status: TaskStatus = TaskStatus.OPEN,
  ): ITask {
    const task: ITask = {
      id: uuid(),
      title,
      description,
      status,
    };
    this.tasks.push(task);
    return task;
  }
}
