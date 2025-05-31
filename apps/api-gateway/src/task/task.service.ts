import { Injectable, Inject, OnModuleInit, HttpStatus } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { TaskProto, AuthProto } from 'protos';
import { firstValueFrom } from 'rxjs';
import { CustomHttpException } from 'error';
import { LoggerService } from 'logger';

@Injectable()
export class TaskService implements OnModuleInit {
  private taskService: TaskProto.TaskServiceClient;

  constructor(
    @Inject(TaskProto.TASK_SERVICE_NAME) private taskClient: ClientGrpc,
    private readonly logger: LoggerService
  ) {}

  onModuleInit() {
    this.taskService = this.taskClient.getService(TaskProto.TASK_SERVICE_NAME);
  }

  async retrieveTasks(payload: TaskProto.GetTasksRequest) {
    const tasks = await firstValueFrom(this.taskService.getTasks(payload));

    return tasks.data;
  }

  async retrieveTask(
    payload: TaskProto.GetTaskRequest
  ): Promise<TaskProto.Task> {
    const task = await firstValueFrom(this.taskService.getTask(payload));

    if (!task?.data?.id) {
      throw new CustomHttpException(
        'Task not found',
        'TASK_NOT_FOUND',
        {},
        HttpStatus.BAD_REQUEST
      );
    }

    return task.data;
  }

  async createTask(payload: TaskProto.CreateTaskRequest) {
    const newTask = await firstValueFrom(this.taskService.createTask(payload));

    this.logger.log(`Task created with ID: ${newTask.data.id}`, 'TaskService');

    if (!newTask) {
      throw new CustomHttpException(
        'Task creation failed',
        'TASK_CREATION_FAILED',
        { ...payload },
        HttpStatus.BAD_REQUEST
      );
    }

    return {
      ...newTask.data,
      message: 'Task created successfully',
    };
  }

  async updateTask(payload: TaskProto.UpdateTaskRequest, user: AuthProto.Auth) {
    const task = await this.retrieveTask({
      id: payload.id,
      isDeleted: false,
    });

    if (task.assignedTo !== user.id) {
      throw new CustomHttpException(
        'You are not authorized to update this task',
        'UNAUTHORIZED_TASK_UPDATE',
        { ...payload, userId: user.id },
        HttpStatus.UNAUTHORIZED
      );
    }

    const updatedTask = await firstValueFrom(
      this.taskService.updateTask(payload)
    );

    if (!updatedTask) {
      throw new CustomHttpException(
        'Task update failed',
        'TASK_UPDATE_FAILED',
        { ...payload },
        HttpStatus.BAD_REQUEST
      );
    }

    this.logger.log(
      `Task updated with ID: ${updatedTask.data.id}`,
      'TaskService'
    );

    return {
      ...updatedTask.data,
      message: 'Task updated successfully',
    };
  }
  async deleteTask(id: string, user: AuthProto.Auth) {
    const task = await this.retrieveTask({
      id,
      isDeleted: false,
    });

    if (task.assignedTo !== user.id) {
      throw new CustomHttpException(
        'You are not authorized to update this task',
        'UNAUTHORIZED_TASK_UPDATE',
        { id, userId: user.id },
        HttpStatus.UNAUTHORIZED
      );
    }

    const updatedTask = await firstValueFrom(
      this.taskService.updateTask({ id, isDeleted: true })
    );

    if (!updatedTask) {
      throw new CustomHttpException(
        'Task deletion failed',
        'TASK_DELETION_FAILED',
        { id },
        HttpStatus.BAD_REQUEST
      );
    }

    this.logger.log(
      `Task updated with ID: ${updatedTask.data.id}`,
      'TaskService'
    );

    return {
      ...updatedTask.data,
      message: 'Task deleted successfully',
    };
  }
}
