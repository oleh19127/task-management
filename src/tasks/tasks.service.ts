import { Injectable } from '@nestjs/common';
import { TaskStatus, type ITask } from './task.module';
import { v4 as uuid } from 'uuid';
import type { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  getAllTasks() {
    return this.tasks;
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
}
