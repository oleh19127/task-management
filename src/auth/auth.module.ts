import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { PasswordToolService } from 'src/password-tools/password-tool.service';

@Module({
  providers: [AuthService, PasswordToolService],
  controllers: [AuthController],
  imports: [TypeOrmModule.forFeature([User])],
})
export class AuthModule {}
