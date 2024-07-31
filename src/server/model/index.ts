import { withPagination } from "../utils/db";
import { users } from "./users";

const demoApp = {
  users,
};

export { demoApp as demoAppSchema, users as usersSchema, withPagination };
