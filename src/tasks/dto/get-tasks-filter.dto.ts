import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class GetTasksFilterDto {
  @ApiProperty({
    enum: TaskStatus,
    default: TaskStatus.OPEN,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({
    nullable: true,
    required: false,
    uniqueItems: false,
    default: 'title',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
