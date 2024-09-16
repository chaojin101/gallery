"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { backend } from "@/backend";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/useAuth";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@gallery/common";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { toast } = useToast();
  const { setAuthToken } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerForm>({
    resolver: zodResolver(registerFormSchema),
  });

  const registerM = useMutation({
    mutationFn: async (options: { email: string; password: string }) => {
      return await backend.api.v1.users["sign-up"].post(options);
    },
  });

  const onSubmit = async (data: registerForm) => {
    const result = await registerM.mutateAsync({
      email: data.email,
      password: data.password,
    });

    if (!result.data || !result.data.base.success) {
      toast({
        title: "Something went wrong",
        description: result.data?.base.msg,
      });
      return;
    }

    setAuthToken(result.data.data.token);

    router.push("/");
  };

  return (
    <Card className="max-w-md mx-auto mt-12">
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="email" {...register("email")} />
              {errors.email && (
                <div className="pl-1 text-red-400 text-xs">
                  {errors.email.message}
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                {...register("password")}
              />
              {errors.password && (
                <div className="pl-1 text-red-400 text-xs">
                  {errors.password.message}
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="cpassword">Comfirmed Password</Label>
              <Input
                id="cpassword"
                type="password"
                placeholder="Comfirmed Password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <div className="pl-1 text-red-400 text-xs">
                  {errors.confirmPassword.message}
                </div>
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} disabled={registerM.isPending}>
          {registerM.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}{" "}
          Register
        </Button>
      </CardFooter>
    </Card>
  );
}

const registerFormSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
    confirmPassword: z.string(),
  })
  .superRefine((arg, ctx) => {
    if (arg.confirmPassword !== arg.password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
      return false;
    }
    return true;
  });

type registerForm = z.infer<typeof registerFormSchema>;
