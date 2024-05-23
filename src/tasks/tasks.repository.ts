import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
  ) {
    super(
      tasksRepository.target,
      tasksRepository.manager,
      tasksRepository.queryRunner,
    );
  }
  private readonly logger = new Logger(TasksRepository.name);

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { search, status } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.findOneBy({ id, user });
    if (!found) {
      this.logger.error(`Task with id: ${id} not found`);
      throw new NotFoundException(`Task with id: ${id} not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const newTask = this.create({
      title,
      description,
      user,
    });
    try {
      await this.insert(newTask);
      this.logger.verbose(
        `Task for user: ${JSON.stringify(user.userName)} successfully created`,
      );
      return newTask;
    } catch (error) {
      this.logger.error(error.message);
      throw new ConflictException(error.message);
    }
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    const result = await this.softDelete({ id, user });
    if (result.affected === 0) {
      this.logger.error(`Task with id: ${id} not found`);
      throw new NotFoundException(`Task with id: ${id} not found`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const taskToUpdate = await this.getTaskById(id, user);
    taskToUpdate.status = status;
    try {
      await this.save(taskToUpdate);
      return taskToUpdate;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
