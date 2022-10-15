import { z } from "zod";

export const loginSchema = z
  .object({
    type: z.literal("code"),
    email: z.string().email(),
    code: z.string(),
  })
  .or(
    z.object({
      type: z.literal("password"),
      email: z.string().email(),
      password: z.string().min(4),
    })
  );

export type LoginParams = z.infer<typeof loginSchema>;
