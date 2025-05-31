import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OnEvent } from '@nestjs/event-emitter';
import { UserService } from './user.service';
import { AdminGuard } from '../guards/admin.guard';
import {
  CreateUserRequestDto,
} from './dto/request/create-user.request.dto';
import { UserLogoutResponseDto } from './dto/response/user-logout-response.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @OnEvent('create.user')
  handleRequestEvent(payload: CreateUserRequestDto) {
    return this.userService.createUser(payload);
  }

  @Get('/:id')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: UserLogoutResponseDto })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'JSON payload for getting a user by ID',
  })
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Get('')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: UserLogoutResponseDto })
  @UseGuards(AdminGuard)
  getUsers() {
    return this.userService.getUsers();
  }
}
