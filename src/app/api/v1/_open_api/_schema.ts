import { z } from "zod";

/**
 * Ping
 */
export const ZSuccessfulGetPingResponseSchema = z.object({
  message: z.string(),
  status: z.string(),
});

export type TSuccessfulGetPingResponseSchema = z.infer<
  typeof ZSuccessfulGetPingResponseSchema
>;

/**
 * General
 */
export const ZAuthorizationHeadersSchema = z.object({
  authorization: z.string(),
});

export type TAuthorizationHeadersSchema = z.infer<
  typeof ZAuthorizationHeadersSchema
>;

export const ZUnsuccessfulResponseSchema = z.object({
  message: z.string(),
});

export type TUnsuccessfulResponseSchema = z.infer<
  typeof ZUnsuccessfulResponseSchema
>;
