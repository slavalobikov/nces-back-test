import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
} from 'class-validator';
import { TaskPriority } from '../task-priority.enum';
import { TaskStatus } from '../task-status.enum';

export class CreateTaskDto {
  @ApiProperty({ minLength: 5, example: 'title' })
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  title: string;

  @ApiPropertyOptional({
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ enum: TaskStatus })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty({ enum: TaskPriority })
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @ApiProperty({
    example: '2026-05-01',
  })
  @IsDateString()
  deadline: string;

  @ApiProperty({
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  tags: string[];
}
