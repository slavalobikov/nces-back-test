import { ApiProperty } from '@nestjs/swagger';
import { TaskViewDto } from './task-view.dto';

export class PaginatedTasksDto {
  @ApiProperty({ type: [TaskViewDto] })
  data: TaskViewDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}
