import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './enums/task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/entities/user.entity';
import { TasksRepository } from './tasks.repository';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    return this.tasksRepository.getTaskById(id, user);
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    return this.tasksRepository.deleteTaskById(id, user);
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    return this.tasksRepository.updateTaskStatus(id, status, user);
  }
}
