import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcryptjs';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';

import AuthenticationController from '../authentication.controller';
import User from '../../users/user.entity';
import UserService from '../../users/user.service';
import AuthenticationService from '../authentication.service';
import mockedConfigService from '../../utils/mocks/config.service';
import mockedJwtService from '../../utils/mocks/jwt.service';
import { mockedUser, mockedUserData } from './mockedUser';
import LocalStrategy from '../local.strategy';

describe('Authentication Controller', () => {
  let app: INestApplication;
  let findOne: jest.Mock;

  beforeEach(async () => {
    findOne = jest.fn();
    const usersRepository = {
      create: jest.fn().mockResolvedValue(mockedUser),
      findOne,
      save: jest.fn().mockReturnValue(Promise.resolve()),
    };

    const module = await Test.createTestingModule({
      // imports: [PassportModule],
      controllers: [AuthenticationController],
      providers: [
        UserService,
        AuthenticationService,
        LocalStrategy,
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
          useValue: usersRepository,
        },
      ],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('when registering', () => {
    describe('and using valid data', () => {
      it('should respond with data of the user without password', () => {
        const expectedData = { ...mockedUserData };
        delete expectedData.password;

        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            email: mockedUserData.email,
            firstName: mockedUserData.firstName,
            lastName: mockedUserData.lastName,
            password: mockedUserData.password,
          })
          .expect(201)
          .expect(expectedData);
      });
    });

    describe('and using invalid data', () => {
      it('should respond with error', () => {
        const expectedData = { ...mockedUserData };
        delete expectedData.password;

        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            firstName: mockedUserData.firstName,
          })
          .expect(400)
          .then((res) => {
            expect(res.body.error).toEqual('Bad Request');
          });
      });

      it('should return validation error messages', () => {
        const expectedData = { ...mockedUserData };
        delete expectedData.password;

        return request(app.getHttpServer())
          .post('/auth/register')
          .send({})
          .expect(400)
          .then((res) => {
            const message = res.body.message;
            expect(Array.isArray(message)).toBe(true);
            expect(message).toContain('Email must be a valid email');
            expect(message).toContain('First name is required');
            expect(message).toContain('Last name is required');
            expect(message).toContain('Password is required');
            expect(message).toContain('Password must be at least 7 characters');
          });
      });
    });
  });

  describe('when loging in', () => {
    let bcryptCompare: jest.Mock;
    let expectedUser;
    beforeEach(() => {
      expectedUser = { ...mockedUserData };
      bcryptCompare = jest.fn().mockReturnValue(true);
      (bcrypt.compare as jest.Mock) = bcryptCompare;
      delete expectedUser.password;
    });

    describe('and credentials are valid', () => {
      it('should return a 200', () => {
        findOne.mockReturnValue(Promise.resolve(mockedUser));
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: mockedUserData.email,
            password: mockedUserData.password,
          })
          .expect(200)
          .then((res) => {
            expect(res.body).toEqual(expectedUser);
          });
      });
    });

    describe('and credentials are invalid', () => {
      beforeEach(() => {
        findOne.mockReturnValue(Promise.resolve(null));
      });

      it('should return status 400 (wrong email)', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'fakeemail@test.com',
            password: mockedUserData.password,
          })
          .expect(400)
          .then((res) => {
            expect(res.body.message).toContain('Wrong credentials provided');
          });
      });

      it('should return status 400 (wrong password)', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: mockedUserData.email,
            password: 'wrong_password',
          })
          .expect(400)
          .then((res) => {
            expect(res.body.message).toContain('Wrong credentials provided');
          });
      });
    });
  });
});
