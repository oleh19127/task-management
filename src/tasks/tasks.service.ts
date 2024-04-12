import { Injectable } from '@nestjs/common';
import type { ITask } from './task.module';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  getAllTasks() {
    return this.tasks;
  }
}
