import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { User } from './user.entity';
import { LoggerService } from 'logger';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly logger: LoggerService
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const result = this.repository.create(data);
    return this.repository.save(result);
  }

  async findAll() {
    return await this.repository.find();
  }

  public findOne(id: string): Promise<User | null> {
    const options: FindOneOptions<User> = { where: { id } };
    return this.repository.findOne(options);
  }
}
