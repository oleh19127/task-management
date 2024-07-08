import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './enums/task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../users/entities/user.entity';
import { TasksRepository } from './tasks.repository';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  private readonly logger = new Logger(TasksService.name);

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    try {
      return this.tasksRepository.getTasks(filterDto, user);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.getTaskById(id, user);
    if (!found) {
      this.logger.error(`Task with id: ${id} not found`);
      throw new NotFoundException(`Task with id: ${id} not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    try {
      return this.tasksRepository.createTask(createTaskDto, user);
    } catch (error) {
      this.logger.error(error.message);
      throw new ConflictException(error.message);
    }
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    const deletedTask = await this.tasksRepository.deleteTaskById(id, user);
    if (deletedTask.affected === 0) {
      this.logger.error(`Task with id: ${id} not found`);
      throw new NotFoundException(`Task with id: ${id} not found`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    try {
      return this.tasksRepository.updateTaskStatus(id, status, user);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
