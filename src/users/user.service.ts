import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/createUser.dto';
import { User } from './user.entity';

export const UNIQUE_VIOLATION_CODE = '23505';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async findByIdentifier(
    identifier: { email: string } | { id: string },
  ) {
    const foundUser = await this.userRepository.findOne({
      where: { ...identifier },
    });
    if (!foundUser) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }
    return foundUser;
  }

  async getByEmail(email: string): Promise<User> {
    return this.findByIdentifier({ email });
  }

  async getById(userId: string) {
    return this.findByIdentifier({ id: userId });
  }

  async create(userData: CreateUserDto): Promise<User> {
    const newuser = this.userRepository.create(userData);
    await this.userRepository.save(newuser).catch((error) => {
      if (error?.code === UNIQUE_VIOLATION_CODE) {
        throw new HttpException(
          'User with email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
    });
    return newuser;
  }
}
