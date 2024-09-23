export const REGISTER_API = "/api/auth/register";
export const GET_ALL_NOTICE_API = (page: number) =>
  `/api/notice?page=${page ?? 0}`;
export const CREATE_NOTICE_API = "/api/notice";
export const GET_NOTICE_BY_ID_API = (id: string) => `/api/notice/${id}`;
export const DELETE_NOTICE_BY_ID_API = (id: string) => `/api/notice/${id}`;

export const DELETE_UPLOAD_API = `/api/upload`;
export const UPLOAD_FILE_API = `/api/upload`;

export const PING_API = "/api/ping";
