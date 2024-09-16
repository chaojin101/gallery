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
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const loginM = useMutation({
    mutationFn: async (options: { email: string; password: string }) => {
      return await backend.api.v1.users["sign-in"].post(options);
    },
  });

  const onSubmit = async (data: LoginInputs) => {
    const result = await loginM.mutateAsync(data);

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
        <CardTitle>Login</CardTitle>
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
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} disabled={loginM.isPending}>
          {loginM.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}{" "}
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
});

type LoginInputs = z.infer<typeof loginSchema>;
