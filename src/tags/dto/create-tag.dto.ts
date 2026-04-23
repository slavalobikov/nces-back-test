import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    example: 'frontend',
    description:
      'Label you will attach to tasks. Kept unique so filters stay predictable.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name: string;
}
