"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useAuth } from "@/context/useAuth";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const { login, loginLoading } = useAuth();

  const onSubmit = async (data: LoginInputs) => {
    console.log(data);

    await login({
      email: data.email,
      password: data.password,
    });

    router.back();
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
        <Button onClick={handleSubmit(onSubmit)}>Login</Button>
        {loginLoading && <div className="ml-4">Loading...</div>}
      </CardFooter>
    </Card>
  );
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

type LoginInputs = z.infer<typeof loginSchema>;
