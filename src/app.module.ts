import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import type { DbType } from 'types/dbType';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TasksModule,
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as DbType,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      port: parseInt(process.env.PORT, 10),
      password: process.env.POSTGRES_PASSWORD,
      username: process.env.POSTGRES_USER,
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
