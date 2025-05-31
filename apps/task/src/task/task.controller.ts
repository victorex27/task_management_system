import { Controller } from '@nestjs/common';
import { TaskService } from './task.service';
import { GrpcMethod } from '@nestjs/microservices';
import { TaskProto } from 'protos';
import {  CreateTaskDto } from './dto/create-task.dto';
import { GetTaskDto } from './dto/get-tasks.dto';
import { GetTaskByIdDto } from './dto/get-task-by-id.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

const TASK_SERVICE_NAME = TaskProto.TASK_SERVICE_NAME;


@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @GrpcMethod(TASK_SERVICE_NAME, 'CreateTask')
  async createTask(payload: CreateTaskDto) {
    return await  this.taskService.createTask(payload);
  }

  @GrpcMethod(TASK_SERVICE_NAME, 'GetTasks')
  async findAllTasks(payload: GetTaskDto) {
    return await this.taskService.findAllTasks(payload.data, payload.query);
  }


  @GrpcMethod(TASK_SERVICE_NAME, 'GetTask')
  async findById(payload: GetTaskByIdDto) {
    return await this.taskService.findById(payload);
  }

  
  @GrpcMethod(TASK_SERVICE_NAME, 'UpdateTask')
  updateTask(payload: UpdateTaskDto) {
   
    return  this.taskService.updateTask( payload);
  }
}
