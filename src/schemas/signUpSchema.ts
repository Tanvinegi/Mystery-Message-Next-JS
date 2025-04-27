import { z } from "zod";

export const userNameSchema = z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores.");
export const signUpSchema = z.object({
    username: userNameSchema,
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long").regex(/[a-zA-Z]/, "Password must contain at least one letter").regex(/[0-9]/, "Password must contain at least one number"),
})