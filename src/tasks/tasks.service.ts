import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import type { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return await this.taskRepository.find();
  }
  // getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<ITask[]> {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (
  //         task.title.toLowerCase().includes(search.toLowerCase()) ||
  //         task.description.toLowerCase().includes(search.toLowerCase())
  //       ) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   }
  //   return tasks;
  // }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOneBy({ id });
    if (!found) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }
    return found;
  }
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const newTask = this.taskRepository.create({
      title,
      description,
    });
    await this.taskRepository.save(newTask);
    return newTask;
  }

  // async deleteTaskById(id: string): void {
  //   const taskToDelete = this.getTaskById(id);
  //   this.tasks = this.tasks.filter((task) => task.id !== taskToDelete.id);
  // }
  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const taskToUpdate = await this.getTaskById(id);
    await this.taskRepository.update(
      {
        id,
      },
      {
        status,
      },
    );
    return taskToUpdate;
  }
}
