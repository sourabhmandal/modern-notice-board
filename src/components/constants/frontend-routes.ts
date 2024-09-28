export const LANDING = "/";
export const AUTH_LOGIN = "/auth/login";
export const AUTH_REGISTER = "/auth/register";
export const AUTH_ERROR = "/auth/error";
export const AUTH_RESET = "/auth/reset";
export const AUTH_LOGIN_REDIRECT = "/settings";
export const ADMIN_DASHBOARD = "/admin/dashboard";
export const ADMIN_RESOURCES = "/admin/resources";
export const ADMIN_USERS_LIST = "/admin/users";
export const ADMIN_CREATE_NOTICE = "/admin/notice";
export const DASHBOARD = "/dashboard";
export const RESOURCES = "/dashboard/resources";
export const USERS_LIST = "/dashboard/users";
export const CREATE_NOTICE = "/admin/notice";

export const apiAuthPrefix = "/api/auth";

export const authRoutes = [AUTH_LOGIN, AUTH_REGISTER, AUTH_ERROR, AUTH_RESET];

export const publicRoutes = ["/"];