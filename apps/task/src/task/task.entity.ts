import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Task {
  @Column('uuid', {
    primary: true,
    default: () => 'gen_random_uuid()',
  })
  id: string;


  @Column()
  title: string;

  @Column()
  description: string;


  @Column('uuid')
  assignedTo: string;

  @Column('uuid')
  createdBy: string;

  @Column()
  status: string;

  @Column()
  priority: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;


  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;


  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;


  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public updatedAt: Date;
}
