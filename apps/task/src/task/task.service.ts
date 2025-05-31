import { Inject, Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { TaskRepository } from './task.repository';
import RESPONSE_MESSAGE from '../constants/message.constant';
import { LoggerService } from 'logger';
import { TaskProto } from 'protos';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly logger: LoggerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async createTask(payload: TaskProto.CreateTaskRequest) {
    const newTask = await this.taskRepository.create({
      ...payload,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
      completedAt: payload.completedAt ? new Date(payload.completedAt) : null,
    });

    this.logger.log(`Task created with ID: ${newTask.id}`, 'TaskService');

    return {
      ...newTask,
      message: RESPONSE_MESSAGE.TASK_CREATION_SUCCESS,
    };
  }

  async findAllTasks(
    payload: Partial<Task>,
    query: { page?: number; limit?: number }
  ) {

    this.logger.log(`Fetching tasks with payload: ${JSON.stringify(payload)} ${JSON.stringify(query)}`, 'TaskService');
    return await this.taskRepository.findAll({
      ...payload,
      ...query,
    });
  }

  async findById(payload: TaskProto.GetTaskRequest) {
    return this.taskRepository.findOne(payload);
  }

  async updateTask(payload: TaskProto.UpdateTaskRequest) {
    const { id, ...data } = payload;

    const task = await this.taskRepository.update(id, {
      ...data,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
      completedAt: payload.completedAt ? new Date(payload.completedAt) : null,
    });

    this.logger.log(`Task updated with ID: ${task.id}`, 'TaskService');

    return {
      ...task,
      message: RESPONSE_MESSAGE.TASK_UPDATE_SUCCESS,
    };
  }
}
