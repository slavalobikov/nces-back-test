import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tag } from '../tags/tag.entity';
import { TaskPriority } from './task-priority.enum';
import { TaskStatus } from './task-status.enum';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: TaskStatus, enumName: 'task_status_enum' })
  status: TaskStatus;

  @Column({ type: 'enum', enum: TaskPriority, enumName: 'task_priority_enum' })
  priority: TaskPriority;

  @Column({ type: 'date' })
  deadline: Date;

  @ManyToMany(() => Tag, (tag) => tag.tasks, { cascade: false })
  @JoinTable({
    name: 'task_tags',
    joinColumn: { name: 'task_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
