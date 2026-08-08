"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUpSchema, type SignUpInput } from "@/lib/schemas/auth.schema";
import { authClient } from "@/lib/auth-client";

export function SignUpForm() {
  const [formErrorMsg, setFormErrorMsg] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({ resolver: zodResolver(signUpSchema) });

  async function OnSubmit(values: SignUpInput) {
    setFormErrorMsg("");
    const { email, name, password } = values;
    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
      callbackURL: "/dashboard",
    });
    if (error) {
      setFormErrorMsg("Sign up failed: " + (error.message || "Failed to create account"));
      return;
    }
  }

  return (
    <form
      onSubmit={handleSubmit(OnSubmit)}
      className="card-surface flex flex-col gap-4 p-8 max-w-md w-full"
    >
      <div>
        <p className="eyebrow mb-1">Get Started</p>
        <h2 className="font-display text-2xl font-bold text-ink">Create Account</h2>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-xs font-medium text-ink">
          Full Name
        </label>
        <Input id="name" {...register("name")} placeholder="Abebe Bikila" className="rounded-xl border-hairline bg-paper" />
        {errors.name?.message ? <p className="font-mono text-xs text-seal">{errors.name.message}</p> : null}
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

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirmPassword" className="text-xs font-medium text-ink">
          Confirm Password
        </label>
        <Input id="confirmPassword" type="password" {...register("confirmPassword")} className="rounded-xl border-hairline bg-paper" />
        {errors.confirmPassword?.message ? <p className="font-mono text-xs text-seal">{errors.confirmPassword.message}</p> : null}
      </div>

      {formErrorMsg ? <p className="font-mono text-xs text-seal">{formErrorMsg}</p> : null}

      <Button type="submit" className="btn-seal w-full py-3" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create Account"}
      </Button>

      <p className="font-mono text-xs text-muted text-center mt-2">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="text-seal font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default SignUpForm;
