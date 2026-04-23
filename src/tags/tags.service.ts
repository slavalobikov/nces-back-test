import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  findAll(): Promise<Tag[]> {
    return this.tagRepo.find({ order: { name: 'ASC' } });
  }

  async create(dto: CreateTagDto): Promise<Tag> {
    const name = dto.name.trim();
    const existing = await this.tagRepo.findOne({ where: { name } });
    if (existing) {
      throw new ConflictException('A tag with this name already exists.');
    }
    const tag = this.tagRepo.create({ name });
    return this.tagRepo.save(tag);
  }

  async requireByIds(ids: string[]): Promise<Tag[]> {
    if (ids.length === 0) {
      return [];
    }
    const unique = [...new Set(ids)];
    const tags = await this.tagRepo.find({ where: { id: In(unique) } });
    if (tags.length !== unique.length) {
      throw new NotFoundException('One or more tag ids were not found.');
    }
    return tags;
  }
}
