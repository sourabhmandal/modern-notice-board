import { withPagination } from "../utils/db";
import {
  accounts,
  authenticators,
  sessions,
  users,
  verificationTokens,
} from "./auth";
import { attachments, notices } from "./notice";

const demoApp = {
  accounts,
  authenticators,
  sessions,
  users,
  verificationTokens,
  attachments,
  notices,
};

export {
  accounts as accountsSchema,
  attachments as attachmentsSchema,
  authenticators as authenticatorSchema,
  demoApp as demoAppSchema,
  notices as noticesSchema,
  sessions as sessionsSchema,
  users as usersSchema,
  verificationTokens as verificationTokensSchema,
  withPagination,
};

export { type IUserRoleEnum } from "./common";

