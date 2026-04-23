import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './tag.entity';
import { TagsService } from './tags.service';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiOperation({
    summary: 'get tags',
  })
  @ApiResponse({ status: 200, type: [Tag] })
  findAll(): Promise<Tag[]> {
    return this.tagsService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'create tag',
  })
  @ApiResponse({ status: 201, type: Tag })
  create(@Body() dto: CreateTagDto): Promise<Tag> {
    return this.tagsService.create(dto);
  }
}
