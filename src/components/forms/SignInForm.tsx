"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Field } from "../ui/Field.tsx";
import { Input } from "../ui/Input.tsx";

import { signInSchema, type SignInInput } from "@/lib/schemas/auth.schema.ts";
import { signIn } from "@/lib/auth-client.ts";

export default function SignInForm() {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({ resolver: zodResolver(signInSchema) });

  async function onSubmit(values: SignInInput) {
    setFormError("");
    const result = await signIn(values.email, values.password);
    if (!result.success) {
      setFormError(result.error || "Sign in failed");
      return;
    }
    router.push("/");
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card-surface flex flex-col gap-4 p-8 max-w-md w-full"
    >
      <div>
        <p className="eyebrow mb-1">WelcomeBack</p>
        <h2 className="font-display text-2xl text-ink">Sign in</h2>
      </div>
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" {...register("email")} />
      </Field>
      <Field
        label="Password"
        htmlFor="password"
        error={errors.password?.message}
      >
        <Input id="password" type="password" {...register("password")} />
      </Field>
      {formError ? (
        <p className="font-mono text-xs text-seal">{formError}</p>
      ) : null}

      <button
        type="submit"
        className="btn-seal self-start"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
      <p className="font-mono text-xs text-muted text-center">
        Don&apos;t have an account?{" "}
        <Link href="/auth/sign-up" className="text-seal hover:text-seal-hover">
          Sign up
        </Link>
      </p>
    </form>
  );
}
