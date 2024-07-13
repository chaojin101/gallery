"use client";

import { SignReqSchema } from "@gallery/backend";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(SignReqSchema.properties.password.minLength ?? 8)
      .max(SignReqSchema.properties.password.maxLength ?? 20),
    confirmPassword: z.string(),
  })
  .refine((arg) => arg.password === arg.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormSchema = z.infer<typeof formSchema>;

export default function Home() {
  // const t = SignReqSchema.static;
  // SignReqSchema.properties.email;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormSchema) => {};

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="email">Email</label>
        <input
          {...register("email")}
          id="email"
          type="email"
          placeholder="m@example.com"
          required
        />
        {errors.email && (
          <div className="pl-1 text-red-400 text-xs">
            {errors.email.message}
          </div>
        )}
      </div>
      <div className="grid gap-2">
        <label htmlFor="password">Password</label>
        <input
          {...register("password")}
          id="password"
          type="password"
          required
        />
        {errors.password && (
          <div className="pl-1 text-red-400 text-xs">
            {errors.password.message}
          </div>
        )}
      </div>
      <div className="grid gap-2">
        <label htmlFor="confirmPassword">confirmPassword</label>
        <input
          {...register("confirmPassword")}
          id="confirmPassword"
          type="confirmPassword"
          required
        />
        {errors.confirmPassword && (
          <div className="pl-1 text-red-400 text-xs">
            {errors.confirmPassword.message}
          </div>
        )}
      </div>
      <button
        className="w-full"
        onClick={handleSubmit(onSubmit)}
        // disabled={login.isPending}
      >
        {/* {login.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} */}
        Sign in
      </button>
    </div>
  );
}
