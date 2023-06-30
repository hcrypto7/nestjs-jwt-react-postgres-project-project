import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';

import User from '../../users/user.entity';
import RegisterationDto from '../dto/register.dto';
import UserService from '../../users/user.service';
import AuthenticationService from '../authentication.service';
import mockedConfigService from '../../utils/mocks/config.service';
import mockedJwtService from '../../utils/mocks/jwt.service';
import LoginDto from '../dto/login.dto';

jest.mock('bcryptjs');

describe('Authentication Service', () => {
  let authenticationService: AuthenticationService;
  let userService: UserService;
  let jwtService: JwtService;
  let findOne: jest.Mock;
  let bcryptCompare: jest.Mock;
  let bcryptHash: jest.Mock;
  let create: jest.Mock;
  let save: jest.Mock;

  beforeEach(async () => {
    create = jest.fn();
    save = jest.fn();
    findOne = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        UserService,
        AuthenticationService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: { create, findOne, save },
        },
      ],
    }).compile();

    authenticationService = await module.get<AuthenticationService>(
      AuthenticationService,
    );
    userService = await module.get<UserService>(UserService);
    jwtService = await module.get<JwtService>(JwtService);
  });

  describe('when creating a cookie', () => {
    let userId: string;
    beforeEach(() => {
      userId = 'abc-def';
    });
    it('should return a string', () => {
      expect(typeof authenticationService.getJwtToken(userId)).toEqual(
        'string',
      );
    });

    it('should have been signed by jwt', () => {
      const jwtSignSpy = jest.spyOn(jwtService, 'sign');
      authenticationService.getJwtToken(userId);
      expect(jwtSignSpy).toBeCalledTimes(1);
    });
  });

  describe('when hashing a password', () => {
    let password: string;
    beforeEach(() => {
      password = 'password123';
      bcryptHash = jest.fn().mockReturnValue('hashedpassword');
      (bcrypt.hash as jest.Mock) = bcryptHash;
    });
    it('should return a string', async () => {
      const hashedPassword = await authenticationService.hashPassword(password);
      expect(typeof hashedPassword).toEqual('string');
    });

    it('should be hashed with a salt round of 10', async () => {
      const bcryptHashSpy = jest.spyOn(bcrypt, 'hash');
      await authenticationService.hashPassword(password);
      expect(bcryptHashSpy).toHaveBeenCalledWith(password, 10);
    });
  });

  describe('when accessing the data of authenticated user', () => {
    describe('and credentials are valid', () => {
      let user: User;
      beforeEach(() => {
        bcryptCompare = jest.fn().mockReturnValue(true);
        (bcrypt.compare as jest.Mock) = bcryptCompare;
        user = new User();
        findOne.mockReturnValue(Promise.resolve(user));
      });

      it('should attempt to get user', async () => {
        const getUserByEmailSpy = jest.spyOn(userService, 'getByEmail');
        await authenticationService.getAuthenticatedUser({
          email: 'test@test.com',
          password: 'password123',
        });
        expect(getUserByEmailSpy).toBeCalledTimes(1);
      });
    });

    describe('and credentials are invalid', () => {
      beforeEach(() => {
        findOne.mockReturnValue(Promise.resolve(null));
      });
      it('should throw error for missing password', async () => {
        const credentials = {
          email: 'test@test.com',
        } as LoginDto;
        await expect(
          authenticationService.getAuthenticatedUser(credentials),
        ).rejects.toThrow('Wrong credentials provided');
      });

      it('should throw error for missing email', async () => {
        const credentials = {
          password: 'password123',
        } as LoginDto;
        await expect(
          authenticationService.getAuthenticatedUser(credentials),
        ).rejects.toThrow('Wrong credentials provided');
      });
    });
  });

  describe('when registering a user', () => {
    let user: User;
    let userData: RegisterationDto;

    describe('when successful', () => {
      beforeEach(() => {
        user = new User();
        userData = {
          email: 'test@test.com',
          firstName: 'John',
          lastName: 'Doe',
          password: 'password123',
        };
        user.email = userData.email;
        create.mockReturnValue(Promise.resolve(user));
        save.mockReturnValue(Promise.resolve({}));
      });
      it('should return created user', async () => {
        const registeredUser = await authenticationService.register(userData);
        expect(registeredUser).toEqual(user);
      });
    });

    describe('when failed', () => {
      beforeEach(() => {
        user = new User();
        user.email = userData.email;
        create.mockImplementation(() => {
          throw new Error();
        });
      });
      it('should throw error', async () => {
        await expect(
          authenticationService.register(userData),
        ).rejects.toThrow();
      });
    });
  });
});
