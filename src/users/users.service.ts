import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UserRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}
  private readonly logger = new Logger(UsersService.name);

  async findOneByName(userName: string): Promise<User> {
    try {
      return this.userRepository.findOneByName(userName);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async createNewUser(userName: string, password: string): Promise<void> {
    try {
      return this.userRepository.createNewUser(userName, password);
    } catch (error) {
      this.logger.error(error.message);
      throw new ConflictException(error.message);
    }
  }
}
