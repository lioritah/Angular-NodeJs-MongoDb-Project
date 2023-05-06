import mongoose, { mongo, ObjectId } from "mongoose";
import bcrypt from "bcrypt";
export const SALT_WORK_FACTOR = 10;

const validateEmail = function (email: any) {
  if (!email) return false;
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

// interface
export interface User extends mongoose.Document<ObjectId> {
  passportId: string;
  firstName: string;
  lastName: string;
  roles: string;
  addressCity: string;
  addressStreet: string;
  email: string;
  password: string;
}

// scheme
const UserSchema = new mongoose.Schema<User>(
  {
    passportId: {
      type: String,
      unique: true,
      required: [true, "Passport id is required (9 digits)"],
      minlength: 9,
      maxlength: 9,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    addressCity: { type: String, required: [false, "city is required"] },
    addressStreet: { type: String, required: [false, "street is required"] },
    roles: { type: String, default: "user" },
    email: {
      type: String,
      unique: true,
      required: [true, "Email address is required"],
      validate: [validateEmail, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  {
    versionKey: false,
  }
);

// pass hash
UserSchema.pre("save", function (next) {
  let user = this;
  if (!user.isModified("password")) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function (error, salt) {
    if (error) return next(error);

    bcrypt.hash(user.password, salt, function (hashError, hashedPassword) {
      if (hashError) return next(hashError);
      user.password = hashedPassword;
      next();
    });
  });
});

// model
const UserModel = mongoose.model("UserModel", UserSchema, "users");

// new UserModel({....}).save()
export default UserModel;
