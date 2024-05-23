import { Repository } from 'typeorm';
import { User } from './user.entity';
import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PasswordToolService } from '../utils/password-tools/password-tool.service';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import type { IJWtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private passwordToolService: PasswordToolService,
    private jwtService: JwtService,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  private readonly logger = new Logger(UserRepository.name);

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { password, userName } = authCredentialsDto;
    const hashedPassword =
      await this.passwordToolService.hashPassword(password);
    const newUser = this.create({
      password: hashedPassword,
      userName,
    });
    try {
      await this.insert(newUser);
    } catch (error) {
      this.logger.error(error.message);
      throw new ConflictException(error.message);
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { password, userName } = authCredentialsDto;
    const user = await this.findOneBy({ userName });
    const verifiedPassword = await this.passwordToolService.verifyPassword(
      user.password,
      password,
    );
    if (user && verifiedPassword) {
      const payload: IJWtPayload = { userName };
      const accessToken = await this.jwtService.signAsync(payload);
      return { accessToken };
    } else {
      this.logger.error('Please check you credentials');
      throw new UnauthorizedException('Please check you credentials');
    }
  }
}
