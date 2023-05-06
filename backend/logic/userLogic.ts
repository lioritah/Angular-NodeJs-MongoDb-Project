import { DecodedToken } from "../middleware/validateToken";
import UserModel, { SALT_WORK_FACTOR, User } from "../models/User";
import bcrypt from "bcrypt";
import { ValidationException } from "../exceptions/exceptions";
async function createNewUser(user: User) {
  const userModel = new UserModel(user);
  //validate user
  await userModel.validate();
  return await userModel.save();
}

async function getUserById(userId?: DecodedToken) {
  const userModel = await UserModel.findById(userId).exec();
  return userModel;
}

async function validateNewUser(email: string, passportId: string) {
  let userModel = await UserModel.findOne({ email }).exec();
  if (userModel)
    throw new ValidationException(`User with email ${email} already exists`);
  userModel = await UserModel.findOne({ passportId }).exec();
  if (userModel)
    throw new ValidationException(
      `User with passport id ${passportId} already exists`
    );
  return true; // valid
}

async function login(email: string, password: string): Promise<User> {
  return new Promise(async (resolve, reject) => {
    const userModel = await UserModel.findOne({ email }).exec();
    try {
      if (!userModel) {
        throw new ValidationException("Email does not exist");
      }
      const samePasswords = await bcrypt.compare(password, userModel.password);
      if (!samePasswords) {
        throw new ValidationException("Incorrect Password");
      }
      resolve(userModel);
    } catch (e) {
      reject(e);
    }
  });
}

export { createNewUser, getUserById, login, validateNewUser };
