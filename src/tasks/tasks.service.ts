import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { TagsService } from '../tags/tags.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { PaginatedTasksDto } from './dto/paginated-tasks.dto';
import { QueryTasksDto, SortOrder, TaskSortField } from './dto/query-tasks.dto';
import { TaskViewDto } from './dto/task-view.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

function toDeadlineString(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function toView(task: Task): TaskViewDto {
  const deadline =
    task.deadline instanceof Date ? task.deadline : new Date(task.deadline);
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? undefined,
    status: task.status,
    priority: task.priority,
    deadline: toDeadlineString(deadline),
    tags: [...(task.tags ?? [])]
      .map((t) => t.name)
      .sort((a, b) => a.localeCompare(b)),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    private readonly tagsService: TagsService,
  ) {}

  async create(dto: CreateTaskDto): Promise<TaskViewDto> {
    const tags = await this.tagsService.requireByIds(dto.tags);
    const description =
      dto.description === undefined || dto.description === ''
        ? null
        : dto.description;
    const task = this.taskRepo.create({
      title: dto.title,
      description,
      status: dto.status,
      priority: dto.priority,
      deadline: new Date(dto.deadline),
      tags,
    });
    const saved = await this.taskRepo.save(task);
    return toView(await this.requireWithTags(saved.id));
  }

  async findPage(query: QueryTasksDto): Promise<PaginatedTasksDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const sortBy = query.sortBy ?? TaskSortField.CREATED_AT;
    const sortOrder = query.sortOrder ?? SortOrder.DESC;
    const applyFilters = (
      qb: ReturnType<Repository<Task>['createQueryBuilder']>,
    ) => {
      if (query.status) {
        qb.andWhere('task.status = :status', { status: query.status });
      }
      if (query.priority) {
        qb.andWhere('task.priority = :priority', { priority: query.priority });
      }
      if (query.search?.trim()) {
        qb.andWhere({ title: ILike(`%${query.search.trim()}%`) });
      }
      if (query.tag?.length) {
        query.tag.forEach((raw, index) => {
          if (isUuid(raw)) {
            const key = `tagFilterId_${index}`;
            qb.andWhere(
              `EXISTS (
            SELECT 1 FROM task_tags tt
            INNER JOIN tags tg ON tg.id = tt.tag_id
            WHERE tt.task_id = task.id AND tg.id = :${key}
          )`,
              { [key]: raw },
            );
          } else {
            const key = `tagFilterName_${index}`;
            qb.andWhere(
              `EXISTS (
            SELECT 1 FROM task_tags tt
            INNER JOIN tags tg ON tg.id = tt.tag_id
            WHERE tt.task_id = task.id AND tg.name = :${key}
          )`,
              { [key]: raw },
            );
          }
        });
      }
    };
    const countQb = this.taskRepo.createQueryBuilder('task');
    applyFilters(countQb);
    const total = await countQb.getCount();
    const qb = this.taskRepo
      .createQueryBuilder('task')
      .distinct(true)
      .leftJoinAndSelect('task.tags', 'tag');
    applyFilters(qb);
    const sortColumn =
      sortBy === TaskSortField.DEADLINE ? 'task.deadline' : 'task.createdAt';
    qb.orderBy(sortColumn, sortOrder === SortOrder.ASC ? 'ASC' : 'DESC');
    qb.addOrderBy('task.id', 'ASC');
    const items = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    return {
      data: items.map(toView),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<TaskViewDto> {
    return toView(await this.requireWithTags(id));
  }

  async update(id: string, dto: UpdateTaskDto): Promise<TaskViewDto> {
    const task = await this.requireWithTags(id);
    if (dto.title !== undefined) {
      task.title = dto.title;
    }
    if (dto.description !== undefined) {
      task.description = dto.description === '' ? null : dto.description;
    }
    if (dto.status !== undefined) {
      task.status = dto.status;
    }
    if (dto.priority !== undefined) {
      task.priority = dto.priority;
    }
    if (dto.deadline !== undefined) {
      task.deadline = new Date(dto.deadline);
    }
    if (dto.tags !== undefined) {
      task.tags = await this.tagsService.requireByIds(dto.tags);
    }
    await this.taskRepo.save(task);
    return toView(await this.requireWithTags(id));
  }

  async updateStatus(
    id: string,
    dto: UpdateTaskStatusDto,
  ): Promise<TaskViewDto> {
    const task = await this.requireWithTags(id);
    task.status = dto.status;
    await this.taskRepo.save(task);
    return toView(await this.requireWithTags(id));
  }

  async remove(id: string): Promise<void> {
    const res = await this.taskRepo.delete({ id });
    if (res.affected === 0) {
      throw new NotFoundException('Task not found.');
    }
  }

  private async requireWithTags(id: string): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: { tags: true },
    });
    if (!task) {
      throw new NotFoundException('Task not found.');
    }
    return task;
  }
}
