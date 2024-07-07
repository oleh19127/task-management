import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty({
    required: true,
    default: 'Oleh1',
    nullable: false,
    uniqueItems: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  userName: string;

  @ApiProperty({
    uniqueItems: false,
    nullable: false,
    required: true,
    default: 'Oleh19127@1',
    maxLength: 20,
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 4,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @MaxLength(20)
  password: string;
}
