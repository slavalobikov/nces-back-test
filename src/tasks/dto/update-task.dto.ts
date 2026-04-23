import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { TaskPriority } from '../task-priority.enum';
import { TaskStatus } from '../task-status.enum';

export class UpdateTaskDto {
  @ApiPropertyOptional({ minLength: 5 })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  title?: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({ example: '2000-02-05' })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiPropertyOptional({
    type: [String],
  })
  @ValidateIf((o: { tags?: string[] }) => o.tags !== undefined)
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  tags?: string[];
}
