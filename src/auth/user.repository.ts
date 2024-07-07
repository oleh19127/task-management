import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  async createNewUser(userName: string, password: string) {
    const newUser = this.create({
      password,
      userName,
    });
    await this.insert(newUser);
  }

  async findOneByName(userName: string): Promise<User> {
    return this.findOneBy({ userName });
  }
}
