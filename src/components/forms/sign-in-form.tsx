"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInSchema, type SignInInput } from "@/lib/schemas/auth.schema";
import { authClient } from "@/lib/auth-client";

export function SignInForm() {
  const [formErrorMsg, setFormErrorMsg] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({ resolver: zodResolver(signInSchema) });

  async function OnSubmit(values: SignInInput) {
    setFormErrorMsg("");
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: "/dashboard",
    });
    if (error) {
      setFormErrorMsg("Sign in failed: " + (error.message || "Invalid credentials"));
      return;
    }
  }

  return (
    <form
      onSubmit={handleSubmit(OnSubmit)}
      className="card-surface flex flex-col gap-5 p-8 max-w-md w-full"
    >
      <div>
        <p className="eyebrow mb-1">Welcome Back</p>
        <h2 className="font-display text-2xl font-bold text-ink">Sign In</h2>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-medium text-ink">
          Email Address
        </label>
        <Input id="email" type="email" {...register("email")} placeholder="you@example.com" className="rounded-xl border-hairline bg-paper" />
        {errors.email?.message ? <p className="font-mono text-xs text-seal">{errors.email.message}</p> : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-xs font-medium text-ink">
          Password
        </label>
        <Input id="password" type="password" {...register("password")} className="rounded-xl border-hairline bg-paper" />
        {errors.password?.message ? <p className="font-mono text-xs text-seal">{errors.password.message}</p> : null}
      </div>

      {formErrorMsg ? <p className="font-mono text-xs text-seal">{formErrorMsg}</p> : null}

      <Button type="submit" className="btn-seal w-full py-3" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>

      <p className="font-mono text-xs text-muted text-center mt-2">
        Don&apos;t have an account?{" "}
        <Link href="/auth/sign-up" className="text-seal font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}

export default SignInForm;
