import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { UtilityModule } from 'src/utility/utils.module';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  providers: [AuthService, JwtStrategy, UserRepository],
  controllers: [AuthController],
  imports: [
    UtilityModule,
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: 7200,
        },
      }),
    }),
  ],
})
export class AuthModule {}
