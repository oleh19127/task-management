import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Logger } from 'nestjs-pino';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly logger: Logger,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { password, userName } = authCredentialsDto;
    const newUser = this.userRepository.create({
      password,
      userName,
    });
    try {
      await this.userRepository.save(newUser);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }
}
