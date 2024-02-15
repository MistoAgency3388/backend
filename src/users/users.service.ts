import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
// import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { UpdateUserDto } from './dto/update-user.dto';
// import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async getAll() {
    return this.usersRepository.find();
  }

  async me(id: number): Promise<User> {
    const me = await this.usersRepository.findOneByOrFail({ id });

    return me;
  }

  async updateUser(id: number, payload: UpdateUserDto) {
    const user = await this.usersRepository.findOneByOrFail({ id });

    Object.assign(user, { ...payload });

    const updatedUser = await this.usersRepository.save(user);

    return updatedUser;
  }
}
