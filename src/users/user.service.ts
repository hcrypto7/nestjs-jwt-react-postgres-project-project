import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/createUser.dto';
import { User } from './user.entity';

export const UNIQUE_VIOLATION_CODE = '23505';

@Injectable()
export default class UserService {
  private readonly logger = new Logger(UserService.name);

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
      this.logger.error(
        `User with ${JSON.stringify(identifier)} was not found`,
      );
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
        this.logger.error(`User with email: ${userData.email} already exists`);
        throw new HttpException(
          'User with email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      this.logger.error(`An error occured: ${error.message} `);
    });
    return newuser;
  }
}
