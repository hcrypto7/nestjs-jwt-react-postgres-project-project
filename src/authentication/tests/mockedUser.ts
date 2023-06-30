import User from '../../users/user.entity';

export const mockedUserData = {
  id: 'abc-def',
  email: 'test@test.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'password123',
};

export const mockedUser = new User();
mockedUser.email = mockedUserData.email;
mockedUser.firstName = mockedUserData.firstName;
mockedUser.lastName = mockedUserData.lastName;
mockedUser.password = mockedUserData.password;
mockedUser.id = mockedUserData.id;
