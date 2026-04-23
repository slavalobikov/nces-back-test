import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { PaginatedTasksDto } from './dto/paginated-tasks.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { TaskViewDto } from './dto/task-view.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@ApiExtraModels(TaskViewDto, PaginatedTasksDto)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({
    summary: 'create task',
  })
  @ApiResponse({ status: 201, type: TaskViewDto })
  create(@Body() dto: CreateTaskDto): Promise<TaskViewDto> {
    return this.tasksService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'get tasks',
  })
  @ApiResponse({ status: 200, type: PaginatedTasksDto })
  findAll(@Query() query: QueryTasksDto): Promise<PaginatedTasksDto> {
    return this.tasksService.findPage(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'get task',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: TaskViewDto })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<TaskViewDto> {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'update task',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: TaskViewDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<TaskViewDto> {
    return this.tasksService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'change status',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: TaskViewDto })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskStatusDto,
  ): Promise<TaskViewDto> {
    return this.tasksService.updateStatus(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'remove task',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 204 })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.tasksService.remove(id);
  }
}
