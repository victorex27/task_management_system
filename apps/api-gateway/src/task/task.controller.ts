import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { AdminGuard } from '../guards/admin.guard';
import { CreateTaskDto } from './dto/request/create-task.dto';
import { UserLoginResponseDto } from './dto/response/user-login-response.dto';
import { UserRegistrationResponseDto } from './dto/response/user-registration-response.dto';
import { UpdateTaskDto } from './dto/request/update-task.dto';
import { GetUser } from '../decorator/user.decorator';
import { AuthProto } from 'protos';
import { UserGuard } from '../guards/user.guard';
import { GetTasksDto } from './dto/request/get-tasks.dto';

@ApiTags('Task')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ type: UserLoginResponseDto })
  @ApiBody({
    type: CreateTaskDto,
    description: 'JSON payload for task creation',
  })
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create a new task' })
  createTask(@Body() payload: CreateTaskDto, @GetUser() user: AuthProto.Auth) {
    return this.taskService.createTask({ ...payload, createdBy: user.id });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiTags('Admin')
  @ApiOperation({ summary: 'Updating a new task' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ type: UserRegistrationResponseDto })
  @ApiParam({
    name: 'id',
    description: 'ID of the task to update',
    required: true,
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @UseGuards(UserGuard)
  updateTask(
    @Param('id') id: string,
    @Body() payload: UpdateTaskDto,
    @GetUser() user: AuthProto.Auth
  ) {
    return this.taskService.updateTask({ ...payload, id }, user);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiTags('Admin')
  @ApiOperation({ summary: 'Deleting a  task' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ type: UserRegistrationResponseDto })
  @ApiParam({
    name: 'id',
    description: 'ID of the task to be deleted',
    required: true,
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @UseGuards(UserGuard)
  deleteTask(@Param('id') id: string, @GetUser() user: AuthProto.Auth) {
    return this.taskService.deleteTask(id, user);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ type: UserLoginResponseDto })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Status of the task',
  })
  @ApiQuery({
    name: 'priority',
    required: false,
    type: String,
    description: 'Priority of the task',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiOperation({ summary: 'Retrieve tasks' })
  getTasks(@Query() payload: GetTasksDto, @GetUser() user: AuthProto.Auth) {
    const { page, limit, ...rest } = payload;
    let data: {
      isDeleted: boolean;
      status?: string;
      priority?: string;
      assignedTo?: string;
    } = {
      ...rest,
      isDeleted: false,
    };

    if (user.role !== 'USER') {
      data = {
        ...data,
        assignedTo: user.id,
      };
    }
    return this.taskService.retrieveTasks({
      data,
      query: {
        page,
        limit,
      },
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ type: UserLoginResponseDto })
  @ApiParam({
    name: 'id',
    description: 'ID of the task to retrieve',
    required: true,
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOperation({ summary: 'Retrieve task' })
  getTask(@Param('id') id: string, @GetUser() user: AuthProto.Auth) {
    let data: { id: string; isDeleted: boolean; assignedTo?: string } = {
      id,
      isDeleted: false,
    };

    if (user.role !== 'USER') {
      data = {
        ...data,
        assignedTo: user.id,
      };
    }
    return this.taskService.retrieveTask(data);
  }
}
