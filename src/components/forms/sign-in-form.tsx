"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInSchema, type SignInInput } from "@/lib/schemas/auth.schema";
import { authClient } from "@/lib/auth-client";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export function SignInForm() {
  const [formErrorMsg, setFormErrorMsg] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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

  async function HandleGoogleSignIn() {
    setFormErrorMsg("");
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err: any) {
      setFormErrorMsg("Google sign-in failed: " + (err?.message || "Something went wrong"));
      setIsGoogleLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(OnSubmit)}
      className="bg-paper-raised border border-hairline rounded-3xl p-8 sm:p-10 shadow-xl w-full flex flex-col gap-8 animate-slide-up"
    >
      <div className="flex flex-col items-center text-center gap-2">
        <div className="h-16 w-16 rounded-full bg-seal/10 flex items-center justify-center mb-2">
          <span className="font-display text-3xl font-black text-seal tracking-tighter">T</span>
        </div>
        <h2 className="font-display text-3xl font-bold text-ink tracking-tight">Welcome back</h2>
        <p className="text-sm text-muted">Sign in to manage your events</p>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={HandleGoogleSignIn}
        disabled={isGoogleLoading || isSubmitting}
        className="w-full h-14 rounded-2xl border-2 border-hairline bg-paper hover:bg-paper-raised hover:border-seal/30 flex items-center justify-center gap-3 font-semibold text-ink transition-all hover:shadow-md active:scale-[0.98]"
      >
        <GoogleIcon className="h-6 w-6" />
        {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
      </Button>

      <div className="flex items-center gap-4 px-2">
        <div className="h-px flex-1 bg-hairline" />
        <span className="eyebrow text-muted">or continue with email</span>
        <div className="h-px flex-1 bg-hairline" />
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-semibold text-ink pl-1">
            Email Address
          </label>
          <Input 
            id="email" 
            type="email" 
            {...register("email")} 
            placeholder="name@company.com" 
            className="h-14 rounded-2xl border-2 border-hairline bg-paper px-4 focus:border-seal transition-colors" 
          />
          {errors.email?.message ? <p className="font-medium text-xs text-red-500 pl-1">{errors.email.message}</p> : null}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between pl-1 pr-1">
            <label htmlFor="password" className="text-sm font-semibold text-ink">
              Password
            </label>
          </div>
          <Input 
            id="password" 
            type="password" 
            {...register("password")} 
            placeholder="••••••••"
            className="h-14 rounded-2xl border-2 border-hairline bg-paper px-4 focus:border-seal transition-colors tracking-widest" 
          />
          {errors.password?.message ? <p className="font-medium text-xs text-red-500 pl-1">{errors.password.message}</p> : null}
        </div>
      </div>

      {formErrorMsg ? (
        <div className="rounded-xl border-2 border-red-500/20 bg-red-500/10 p-3 text-center text-sm font-medium text-red-600 animate-shake">
          {formErrorMsg}
        </div>
      ) : null}

      <div className="flex flex-col gap-6 mt-2">
        <Button type="submit" className="btn-seal w-full h-14 text-lg rounded-2xl font-bold shadow-md hover:shadow-lg transition-all" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>

        <p className="text-sm text-muted text-center">
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="text-seal font-bold hover:underline transition-all">
            Create account
          </Link>
        </p>
      </div>
    </form>
  );
}

export default SignInForm;
