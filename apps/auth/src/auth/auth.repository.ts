import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { Auth } from './auth.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Auth)
    private readonly repository: Repository<Auth>
  ) {}

  async create(data: Partial<Auth>): Promise<Auth> {
    const result = this.repository.create(data);
    return this.repository.save(result);
  }

  async findAll(): Promise<Auth[]> {
    return this.repository.find();
  }

  async findOneById(id: string): Promise<Auth | null> {
    return this.findOne({ id });
  }

  async findOneByEmail(email: string): Promise<Auth | null> {
    return this.findOne({ email });
  }

  private findOne(payload: {
    email?: string;
    id?: string;
  }): Promise<Auth | null> {
    const options: FindOneOptions<Auth> = { where: { ...payload } };
    return this.repository.findOne(options);
  }

  async update(id: string, updateData: Partial<Auth>): Promise<Auth> {
    await this.repository.update(id, updateData);
    return this.findOne({ id });
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
