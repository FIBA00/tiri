"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { Field } from "@/components/ui/Field.tsx";
import { Input } from "@/components/ui/Input.tsx";

import { signUpSchema, type SignUpInput } from "@/lib/schemas/auth.schema";
import { signUp } from "@/lib/auth-client";

export default function SingUpForm() {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({ resolver: zodResolver(signUpSchema) });

  async function onSubmit(values: SignUpInput) {
    setFormError("");
    const result = await signUp(values.name, values.email, values.password);
    if (!result.success) {
      setFormError(result.error || "Sign up failed");
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
        <p className="eyebrow mb-1">Get started</p>
        <h2 className="font-display text-2xl text-ink">Create an account</h2>
      </div>

      <Field label="Name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" {...register("name")} />
      </Field>

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

      <Field
        label="Confirm password"
        htmlFor="confirmPassword"
        error={errors.confirmPassword?.message}
      >
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
        />
      </Field>

      {formError ? (
        <p className="font-mono text-xs text-seal">{formError}</p>
      ) : null}

      <button
        type="submit"
        className="btn-seal self-start"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
      <p className="font-mono text-xs text-muted text-center">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="text-seal hover:text-seal-hover">
          Sign in
        </Link>
      </p>
    </form>
  );
}
