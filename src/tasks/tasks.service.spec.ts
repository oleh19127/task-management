import { Test } from '@nestjs/testing';
import { TaskStatus } from './enums/task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  getTaskById: jest.fn(),
  createTask: jest.fn(),
});

const mockUser = {
  id: 'someId',
  userName: 'Oleh',
  password: 'somePassword',
  tasks: [],
};

const createTaskDto: CreateTaskDto = {
  description: 'some description',
  title: 'some title',
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.getTaskById and returns the result', async () => {
      const mockTask = {
        title: 'Test title',
        description: 'Test desc',
        id: 'someId',
        status: TaskStatus.OPEN,
      };

      tasksRepository.getTaskById.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });
  });

  describe('createTask', () => {
    it('Calls TasksRepository.createTask and returns the result', async () => {
      tasksRepository.createTask.mockResolvedValue(createTaskDto);
      const result = await tasksService.createTask(createTaskDto, mockUser);
      expect(result).toEqual(createTaskDto);
    });
  });
});
