import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(4).max(64),
  password: z.string().min(6, { message: "Must be at least of length 8" }),
});

export type RegisterParams = z.infer<typeof registerSchema>;
