import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    uniqueItems: false,
    nullable: false,
    required: true,
    default: 'some title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    uniqueItems: false,
    nullable: false,
    required: true,
    default: 'some description',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
