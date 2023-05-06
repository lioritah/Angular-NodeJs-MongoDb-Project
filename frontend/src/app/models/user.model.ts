export type User = {
  _id: string;
  email: string;
  lastName: string;
  firstName: string;
  roles: string;
  password?: string;
  addressCity: string;
  addressStreet: string;
  passportId: string;
};

export type UserRegistrationForm = Omit<User, '_id'>;
