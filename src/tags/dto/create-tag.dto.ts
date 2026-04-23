import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    example: 'tag',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name: string;
}
