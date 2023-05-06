import { Router } from "express";
import createToken from "../logic/tokenLogic";
import {
  createNewUser,
  getUserById,
  login,
  validateNewUser,
} from "../logic/userLogic";
import validateToken, { AuthorizedRequest } from "../middleware/validateToken";

const router = Router();

// REGISTER ROUTE
router.post("/", async function (request, response, next) {
  const user = request.body;

  try {
    const createdUser = await createNewUser(user);
    console.log(createdUser);
    const token = await createToken(createdUser);
    return response.status(201).json(token);
  } catch (error) {
    request.statusCode = error.status;
    next(error);
  }
});

// LOGIN ROUTE
router.post("/login", async function (request, response, next) {
  try {
    const { email, password } = request.body; // {email,password}
    const user = await login(email, password);
    console.log("Logged: " + JSON.stringify(user));
    const token = await createToken(user);
    return response.status(201).json(token);
  } catch (error) {
    request.statusCode = 401;
    next(error);
  }
});

router.post("/validateNewUser", async function (request, response, next) {
  try {
    const { email, passportId } = request.body; // {email,password}
    const isValid = await validateNewUser(email, passportId);
    console.log("New user is valid: " + JSON.stringify(isValid));
    return response.status(201).json(isValid);
  } catch (error) {
    request.statusCode = 401;
    next(error);
  }
});

router.get(
  "/",
  validateToken,
  async function (request: AuthorizedRequest, response, next) {
    try {
      console.log(request.userId);
      const user = await getUserById(request.userId);
      return response.status(201).json(user);
    } catch (error) {
      request.statusCode = error.status;
      next(error);
    }
  }
);

export default router;
