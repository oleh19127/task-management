import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  userName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @IsStrongPassword({ minLength: 8 })
  password: string;
}
