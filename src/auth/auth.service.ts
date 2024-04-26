import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { PasswordToolService } from 'src/password-tools/password-tool.service';
import { JwtService } from '@nestjs/jwt';
import type { IJWtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private passwordToolService: PasswordToolService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name, { timestamp: true });

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { password, userName } = authCredentialsDto;
    const hashedPassword =
      await this.passwordToolService.hashPassword(password);
    const newUser = this.userRepository.create({
      password: hashedPassword,
      userName,
    });
    try {
      await this.userRepository.insert(newUser);
    } catch (error) {
      this.logger.error(error.message);
      throw new ConflictException(error.message);
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { password, userName } = authCredentialsDto;
    const user = await this.userRepository.findOneBy({ userName });
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
