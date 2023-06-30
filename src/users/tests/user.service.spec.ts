import { Test } from '@nestjs/testing';
import UserService from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from '../user.entity';
import CreateUserDto from '../dto/createUser.dto';

describe('User Service', () => {
  let userService: UserService;
  let findOne: jest.Mock;
  let create: jest.Mock;
  let save: jest.Mock;

  beforeEach(async () => {
    findOne = jest.fn();
    create = jest.fn();
    save = jest.fn();

    const module = Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create,
            findOne,
            save,
          },
        },
      ],
    }).compile();
    userService = await (await module).get(UserService);
  });

  describe('When getting user', () => {
    describe('by email and user is found', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        findOne.mockReturnValue(Promise.resolve(user));
      });

      it('should return the new user', async () => {
        const findByIdentifierSpy = jest.spyOn(userService, 'findByIdentifier');
        const foundUser = await userService.getByEmail('test@test.com');
        expect(foundUser).toEqual(user);
        expect(findByIdentifierSpy).toBeCalledTimes(1);
      });
    });

    describe('by id and user is found', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        findOne.mockReturnValue(Promise.resolve(user));
      });

      it('should return the new user', async () => {
        const findByIdentifierSpy = jest.spyOn(userService, 'findByIdentifier');
        const foundUser = await userService.getById('test@test.com');
        expect(foundUser).toEqual(user);
        expect(findByIdentifierSpy).toBeCalledTimes(1);
      });
    });

    describe('by email and user is not found', () => {
      beforeEach(() => {
        findOne.mockReturnValue(undefined);
      });

      it('should throw an error', async () => {
        const findByIdentifierSpy = jest.spyOn(userService, 'findByIdentifier');
        await expect(userService.getByEmail('test@test.com')).rejects.toThrow();
        expect(findByIdentifierSpy).toBeCalledTimes(1);
      });
    });

    describe('by id and user is not found', () => {
      beforeEach(() => {
        findOne.mockReturnValue(undefined);
      });

      it('should throw an error', async () => {
        const findByIdentifierSpy = jest.spyOn(userService, 'findByIdentifier');
        await expect(userService.getById('test@test.com')).rejects.toThrow();
        expect(findByIdentifierSpy).toBeCalledTimes(1);
      });
    });
  });

  describe('when creating a user', () => {
    let user: User;
    let userData: CreateUserDto;

    describe('and user is created successfully', () => {
      beforeEach(() => {
        userData = {
          email: 'test@test.com',
          firstName: 'John',
          lastName: 'Doe',
          password: 'password123',
        };
        user = new User();
        user.email = userData.email;
        create.mockReturnValue(Promise.resolve(user));
        save.mockReturnValue(Promise.resolve({}));
      });
      it('should return the created user', async () => {
        const createdUser = await userService.create(userData);
        expect(createdUser).toEqual(user);
      });
    });

    describe('and user already exists', () => {
      beforeEach(() => {
        user = new User();
        create.mockImplementation(() => {
          throw new Error();
        });
      });
      it('should throw error', async () => {
        await expect(userService.create(userData)).rejects.toThrow();
      });
    });
  });
});
