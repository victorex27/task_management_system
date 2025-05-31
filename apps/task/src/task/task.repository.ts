import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { Task } from './task.entity';
import { LoggerService } from 'logger';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly repository: Repository<Task>,
    private readonly logger: LoggerService, 
  ) {}

  async create(data: Partial<Task>): Promise<Task> {
    const result = this.repository.create(data);
    return this.repository.save(result);
  }

  async findAll(
    payload: {
      page?: number;
      limit?: number;
    } & Partial<Task>
  ) {
    const { page = 1, limit = 10, ...rest } = payload;
    // const page = payload.page ?? 1;
    // const limit = payload.limit ?? 10;
    const skip = (page - 1) * limit;

    let whereCondition = {};

    if (rest) {
      whereCondition = { where: { ...rest } };
    }

    this.logger.log(`Finding tasks with conditions: ${JSON.stringify(whereCondition)}`, 'TaskRepository');
    this.logger.log(`Pagination - Page: ${page}, Limit: ${limit}, Skip: ${skip}`, 'TaskRepository');

    const [data, total] = await this.repository.findAndCount({
      ...whereCondition,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    this.logger.log(`Found ${data.length} tasks`, 'TaskRepository');
    this.logger.log(`Total tasks: ${total}`, 'TaskRepository');


    return {tasks: data, total};
  }



  public findOne(payload: {
    assignedTo?: string;
    id?: string;
  }): Promise<Task | null> {
    const options: FindOneOptions<Task> = { where: { ...payload } };
    return this.repository.findOne(options);
  }

  async update(id: string, updateData: Partial<Task>): Promise<Task> {
    await this.repository.update(id, updateData);
    return this.findOne({ id });
  }

}
