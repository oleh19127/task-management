import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { PasswordToolService } from 'src/utility/password-tool.service';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { IJWtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private readonly passwordToolService: PasswordToolService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(UserRepository.name);

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { password, userName } = authCredentialsDto;
    const user = await this.userRepository.findOneByName(userName);
    if (user) {
      const errorMessage = `User with name "${userName}" already exist`;
      this.logger.error(errorMessage);
      throw new ConflictException(errorMessage);
    }
    const hashedPassword =
      await this.passwordToolService.hashPassword(password);

    return this.userRepository.createNewUser(userName, hashedPassword);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { password, userName } = authCredentialsDto;
    const user = await this.userRepository.findOneByName(userName);
    if (!user) {
      this.logger.error(`User with email: ${userName} not found`);
      throw new NotFoundException(`User with user name: ${userName} not found`);
    }
    const verifiedPassword = await this.passwordToolService.verifyPassword(
      user.password,
      password,
    );
    if (verifiedPassword) {
      const payload: IJWtPayload = { userName };
      const accessToken = await this.jwtService.signAsync(payload);
      return { accessToken };
    } else {
      this.logger.error('Password is incorrect');
      throw new UnauthorizedException('Password is incorrect');
    }
  }
}
