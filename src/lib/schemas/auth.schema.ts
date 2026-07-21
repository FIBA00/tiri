import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(5, "password is required"),
});

export const signUpSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().email("Enter a valid email"),
    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine(checkPasswordsMatch, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function checkPasswordsMatch(data: {
  password: string;
  confirmPassword: string;
}) {
  return data.password === data.confirmPassword;
}

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>